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
