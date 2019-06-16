#!/usr/bin/env python3
import json
import os
import re
import subprocess
import pytz
from datetime import datetime

from cacheout import memoize
from flask import Flask, jsonify, request

from util import reverse_readline, sizeof_fmt, isint, mirror_config
from settings import *

app = Flask(__name__)
repos = json.dumps(mirror_config())
pat_fn = re.compile(r'^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$')


@app.route('/status')
def status():
    # Measure generation time
    start_time = datetime.now()

    # Retrieve all mirror directories
    mirror_files = os.listdir(mirror_path)
    resp = {d: mirror_info(d) for d in mirror_files if valid_mirror_dir(d)}

    data = {
        'mirrors': resp,
        'disk': disk_usage(),
        '_ms': (datetime.now() - start_time).total_seconds() * 1000
    }

    callback = request.args.get('callback', False)
    if callback and pat_fn.match(callback):
        content = '{}({})'.format(callback, json.dumps(data))
        response = app.response_class(content, mimetype='application/javascript')
    else:
        response = jsonify(data)
        response.headers['Access-Control-Allow-Origin'] = '*'

    return response


@app.route('/config')
def config():
    callback = request.args.get('callback', False)
    if callback and pat_fn.match(callback):
        content = '{}({})'.format(callback, repos)
        resp = app.response_class(content, mimetype='application/javascript')
    else:
        resp = app.response_class(repos, mimetype='application/json')

    resp.add_etag()
    return resp


@memoize(ttl=15)
def disk_usage():
    df = subprocess.run(['df', '-B1', mirror_path], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    df = [x for x in df.stdout.decode('utf-8').split('\n')[1].replace('  ', ' ').split(' ') if x != '']

    return {
        'total': int(df[1]),
        'used': int(df[2]),
        'free': int(df[3]),
        'totalHuman': sizeof_fmt(int(df[1])),
        'usedHuman': sizeof_fmt(int(df[2])),
        'freeHuman': sizeof_fmt(int(df[3]))
    }


@memoize(ttl=15)
def mirror_usage(usage_path):
    with open(usage_path, 'r') as usage_file:
        return usage_file.read()


def mirror_info(mirror_name):
    info = {}

    # Disk usage
    usage_path = os.path.join(mirror_path, mirror_name + '.usage.txt')
    info['usage'] = None
    info['usageHuman'] = None

    if os.path.exists(usage_path):
        cont = mirror_usage(usage_path)
        val = cont.split('\t')[0]

        if isint(val):
            # Get usage file modified time and convert it to UTC
            mtime = datetime.fromtimestamp(os.path.getmtime(usage_path))
            local_dz = pytz.timezone('Chile/Continental')
            mtime_local = local_dz.localize(mtime, is_dst=None)
            mtime_utc = mtime_local.astimezone(pytz.utc)
            info['lastUpdate'] = str(mtime_utc)

            # Fill usage data
            info['usage'] = int(val)
            info['usageHuman'] = sizeof_fmt(int(val))

    return {**info, **mirror_info_cached(mirror_name)}


@memoize(ttl=5)
def mirror_info_cached(mirror_name):
    info = {}

    # Resolve log path
    if mirror_name in special_logdirs:
        logpath = special_logdirs[mirror_name].replace('@', default_logdir)
    else:
        logpath = default_logdir + '/' + mirror_name + '.log'

    # Try <path>.0, default value will be "idk"
    info['status'] = 'idk'
    if not os.path.exists(logpath):
        if os.path.exists(logpath + '.0'):
            logpath += '.0'
        else:
            return info

    lines = reverse_readline(logpath)

    try:
        line = next(lines)
        if 'Waiting 4h' in line or 'total size is' in line or 'Sync finished.' in line:
            info['status'] = 'ready'
            return info

        # Seek for progress
        info['status'] = line
        i = 50

        # Check last 50 lines
        while i > 0:
            to_find = False
            if 'ir-chk' in line:
                to_find = 'ir-chk'
            elif 'to-chk' in line:
                to_find = 'to-chk'

            if to_find:
                cont_start = line.find(to_find) + 7
                cont_line = line[cont_start:-1].split('/')

                if len(cont_line) != 2 or not isint(cont_line[0]) or not isint(cont_line[1]):
                    info['status'] = 'idk'
                else:
                    total = int(cont_line[1])
                    remaining = int(cont_line[0])
                    info['status'] = (total - remaining) / total
                    info['total'] = total
                    info['remaining'] = remaining

                break

            i -= 1
            line = next(lines)
    except StopIteration as e:
        print('Log read error for process {}: {}'.format(mirror_name, e))

    return info


def valid_mirror_dir(mirror_dir):
    return os.path.isdir(os.path.join(mirror_path, mirror_dir)) \
        and not mirror_dir.startswith(('.', '_'))
