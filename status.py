#!/usr/bin/env python3
import os
import subprocess
import pytz
from datetime import datetime
from werkzeug.contrib.cache import SimpleCache
from flask import Flask, jsonify

from util import reverse_readline, sizeof_fmt, isint
from settings import *

app = Flask(__name__)
cache = SimpleCache()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/status')
def status():
    # Measure generation time
    start_time = datetime.now()

    # Retrieve all mirror directories
    mirror_files = os.listdir(mirror_path)
    dirs = [d for d in mirror_files if (os.path.isdir(os.path.join(mirror_path, d)) and not d.startswith('.') and not d.startswith('_'))]
    resp = {d: {} for d in dirs}

    for process in dirs:
        # Disk usage
        usage_path = os.path.join(mirror_path, process + '.usage.txt')
        resp[process]['usage'] = None
        resp[process]['usageHuman'] = None

        if os.path.exists(usage_path):
            # Read usage file, trying cache first
            cache_key = 'du_{}'.format(usage_path)
            cont = cache.get(cache_key)
            if cont is None:
                with open(usage_path, 'r') as usage_file:
                    cont = usage_file.read()
                    cache.set(cache_key, cont, 15)

            val = cont.split('\t')[0]

            if isint(val):
                # Get usage file modified time and convert it to UTC
                mtime = datetime.fromtimestamp(os.path.getmtime(usage_path))
                local_dz = pytz.timezone('Chile/Continental')
                mtime_local = local_dz.localize(mtime, is_dst=None)
                mtime_utc = mtime_local.astimezone(pytz.utc)
                resp[process]['lastUpdate'] = str(mtime_utc)

                # Fill usage data
                resp[process]['usage'] = int(val)
                resp[process]['usageHuman'] = sizeof_fmt(int(val))

        # Resolve log path
        if process in special_logdirs:
            logpath = special_logdirs[process].replace('@', default_logdir)
        else:
            logpath = default_logdir + '/' + process + '.log'

        # Try <path>.0, default value will be "idk"
        resp[process]['status'] = 'idk'
        if not os.path.exists(logpath):
            if os.path.exists(logpath + '.0'):
                logpath += '.0'
            else:
                continue

        status_cache_key = 'status_{}'.format(logpath)
        total_cache_key = 'total_{}'.format(logpath)
        rem_cache_key = 'rem_{}'.format(logpath)
        resp[process]['status'] = cache.get(status_cache_key)

        if resp[process]['status'] is not None:
            resp[process]['total'] = cache.get(total_cache_key)
            resp[process]['remaining'] = cache.get(rem_cache_key)
        else:
            lines = reverse_readline(logpath)
            try:
                line = next(lines)
                if 'Waiting 4h' in line or 'total size is' in line or 'Sync finished.' in line:
                    resp[process]['status'] = 'ready'
                    cache.set(status_cache_key, resp[process]['status'], 5)
                    continue

                # Seek for progress
                resp[process]['status'] = line
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
                            resp[process]['status'] = 'idk'
                            cache.set(status_cache_key, resp[process]['status'], 5)
                        else:
                            total = int(cont_line[1])
                            remaining = int(cont_line[0])
                            resp[process]['status'] = (total - remaining) / total
                            resp[process]['total'] = total
                            resp[process]['remaining'] = remaining

                            cache.set(status_cache_key, resp[process]['status'], 5)
                            cache.set(total_cache_key, resp[process]['total'], 5)
                            cache.set(rem_cache_key, resp[process]['remaining'], 5)

                        break

                    i -= 1
                    line = next(lines)
            except StopIteration as e:
                print('Log read error for process {}: {}'.format(process, e))

    # Retrieve disk usage info
    df = cache.get('df_mirror')
    if df is None:
        df = subprocess.run(['df', '-B1', mirror_path], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        df = [x for x in df.stdout.decode('utf-8').split('\n')[1].replace('  ', ' ').split(' ') if x != '']
        cache.set('df_mirror', df, timeout=15)

    # Measure execution time
    finish_time = datetime.now()
    delta = finish_time - start_time

    response = jsonify({
        'mirrors': resp,
        'disk': {
            'total': int(df[1]),
            'used': int(df[2]),
            'free': int(df[3]),
            'totalHuman': sizeof_fmt(int(df[1])),
            'usedHuman': sizeof_fmt(int(df[2])),
            'freeHuman': sizeof_fmt(int(df[3]))
        },
        '_ms': delta.total_seconds() * 1000
    })

    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
