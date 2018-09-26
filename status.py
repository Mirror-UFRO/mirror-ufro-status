#!/usr/bin/env python3
import os
import subprocess
import pytz
from datetime import datetime
from util import reverse_readline, sizeof_fmt, isint
from flask import Flask, jsonify

app = Flask(__name__)

mirror_path = '/srv/mirror'
default_logdir = '/var/log/mirror'
special_logdirs = {
    'archlinux': '@/arch.log',
    'debian': '/opt/ftpsync/log/rsync-ftpsync.log',
    'debian-cd': '@/debiancd.log',
    'linuxmint': '@/mint.log',
    'linuxmint-cd': '@/mintcd.log',
    'ubuntu-releases': '@/ubunturelease.log'
}


@app.route('/status')
def index():
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
            with open(usage_path, 'r') as usage_file:
                # Usage file contains output from du -h <mirror_path>
                # Format: <bytes>\t<path>
                cont = usage_file.read()
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

        # Process status
        logpath = ''

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

        lines = reverse_readline(logpath)
        resp[process]['status'] = 'idk'
        try:
            line = next(lines)
            if 'Waiting 4h' in line or 'total size is' in line:
                resp[process]['status'] = 'ready'
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
                    else:
                        total = int(cont_line[1])
                        remaining = int(cont_line[0])
                        resp[process]['status'] = (total - remaining) / total
                        resp[process]['total'] = total
                        resp[process]['remaining'] = remaining

                    break

                i -= 1
                line = next(lines)
        except StopIteration as e:
            print('Log read error for process {}: {}'.format(process, e))

    # Retrieve disk usage info
    df = subprocess.run(['df', '-B1', mirror_path], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    df = [x for x in df.stdout.decode('utf-8').split('\n')[1].replace('  ', ' ').split(' ') if x != '']

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

