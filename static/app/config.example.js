var repohelp = {
  archlinux: `
Official mirror for Arch Linux, tier 2. Information available at: https://www.archlinux.org/mirrors/ufro.cl/.

Line for \`mirrorlist\` configuration file
  
\`\`\`Server = http://mirror.ufro.cl/archlinux/$repo/os/$arch\`\`\`
	
Get the latest ISOS from: https://mirror.ufro.cl/archlinux/iso/latest/`,

  // ---------------------

  centos: `
Full CentOS mirror.

CentOS 7 ISO files can be found at https://mirror.ufro.cl/centos/7/isos/x86_64/`,

  // ---------------------

  debian: `
Debian mirror for architectures: \`all amd64 arm64 armel armhf hurd-i386 i386 ia64 kfreebsd-amd64 kfreebsd-i386 mips mips64el powerpc ppc64el source\`.

Deb lines for \`stretch\`:

    deb http://mirror.ufro.cl/debian/ stretch main contrib
    deb-src http://mirror.ufro.cl/debian/ stretch main contrib
            
    deb http://mirror.ufro.cl/debian/ stretch-updates main contrib
    deb-src http://mirror.ufro.cl/debian/ stretch-updates main contrib
            
    deb http://mirror.ufro.cl/debian stretch-backports main contrib
    deb-src http://mirror.ufro.cl/debian stretch-backports main contrib`,
  'debian-cd': `
Debian ISO files and releases stuff.

Direct links:

* [Directorio de ISOs live 9.5.0 amd64](https://mirror.ufro.cl/debian-cd/9.5.0-live/amd64/iso-hybrid/)
* [ISO netinst 9.5.0 amd64](https://mirror.ufro.cl/debian-cd/9.5.0/amd64/iso-cd/debian-9.5.0-amd64-netinst.iso)  
  SHA256: \`1f97a4b8dee7c3def5cd8215ff01b9edef27c901b28fa8b1ef4f022eff7c36c2\``,

  // ---------------------

  epel: `
Fedora's Extra Packages for Enterprise Linux (EPEL) full mirror.`,

  // ---------------------

  fedora: `
Fedora full mirror.

Direct links:

* [ISO 28 Workstation Live x86_64](https://mirror.ufro.cl/fedora/linux/releases/28/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-28-1.1.iso)  
  SHA256: \`bd5c9ee34b7698eb0852a320da4fbdf616222a493d99f6054aa96afa96207bfb\`
* [ISO 28 Workstation netinst x86_64](https://mirror.ufro.cl/fedora/linux/releases/28/Workstation/x86_64/iso/Fedora-Workstation-netinst-x86_64-28-1.1.iso)  
  SHA256: \`34da8b46b23d786bb1d43a77a4dcd713c446fc70a4ace0c6f52e43b086350562\``,

  // ---------------------

  ius: `
IUS Community Project full mirror

> **I**nline with **U**pstream **S**table`,

  // ---------------------

  linuxmint: `Linux Mint full mirror.`,

  // ---------------------

  'linuxmint-cd': `
Linux Mint releases (ISO files) full mirror.

Linux Mint 19 Tara v2 (64bit) ISO files:

* [Cinnamon](https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-cinnamon-64bit-v2.iso)  
  SHA256: \`c92a9baafdd599da057a97236f0a853ce1f8b3c7ad41e652ceba493f9ca5623f\`
* [Mate](https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-mate-64bit-v2.iso)  
  SHA256: \`f8164654b7600ced1aa8ef6abee2e56620388b0baa161d7b17699f425223d7c7\`
* [XFCE](https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-xfce-64bit-v2.iso)  
  SHA256: \`c996a0de1e010476f36ed55322cb055b07d3bd507f0c60eff65b07634f20f897\``,

  // ---------------------

  manjaro: `Manjaro official full mirror. Check mirrors information at https://repo.manjaro.org/`,

  // ---------------------

  raspbian: `Raspbian full mirror.`,

  // ---------------------

  ubuntu: `Ubuntu full archive mirror.`,

  // ---------------------

  'ubuntu-releases': `
Ubuntu releases (ISO files and stuff) full mirror.

ISOs amd64:

* [18.04 LTS desktop](https://mirror.ufro.cl/ubuntu-releases/18.04/ubuntu-18.04-desktop-amd64.iso)  
  SHA256: \`a55353d837cbf7bc006cf49eeff05ae5044e757498e30643a9199b9a25bc9a34\`
* [18.04 live server](https://mirror.ufro.cl/ubuntu-releases/18.04/ubuntu-18.04-live-server-amd64.iso)  
  SHA256: \`7a1c2966f82268c14560386fbc467d58c3fbd2793f3b1f657baee609b80d39a8\``,

  // ---------------------

  'ubuntu-cdimage': `
Ubuntu CDImage full mirror. Contains ISO files and more stuff about daily images and other Ubuntu derivates.`,

  // ---------------------

  'kali': `
	Official Kali packages mirror, syncing from the main mirror server.`,

  // ---------------------

  'kali-images': `
	Official Kali images mirror, syncing from the main mirror server.`
};

var repoconfig = {
  'archlinux': {
    'logo': '@/archlinux.svg',
    'name': 'Arch Linux',
    'link': 'https://www.archlinux.org/',
    'official': true
  },
  'centos': {
    'logo': '@/centos.svg',
    'name': 'CentOS',
    'link': 'https://www.centos.org/'
  },
  'debian': {
    'logo': '@/debian.svg',
    'name': 'Debian',
    'link': 'https://www.debian.org/'
  },
  'debian-cd': {
    'logo': '@/debian.svg',
    'name': 'Debian CD',
    'link': 'https://www.debian.org/distrib/'
  },
  'epel': {
    'logo': '@/epel.png',
    'name': 'EPEL',
    'link': 'https://fedoraproject.org/wiki/EPEL'
  },
  'fedora': {
    'logo': '@/fedora.svg',
    'name': 'Fedora',
    'link': 'https://getfedora.org/'
  },
  'gentoo': {
    'logo': '@/gentoo.svg',
    'name': 'Gentoo',
    'link': 'https://www.gentoo.org/'
  },
  'ius': {
    'logo': '@/ius.svg',
    'name': 'IUS',
    'link': 'https://ius.io/'
  },
  'kali': {
    'logo': '@/kali.svg',
    'name': 'Kali Linux',
    'link': 'https://www.kali.org/',
    'official': true
  },
  'kali-images': {
    'logo': '@/kali.svg',
    'name': 'Kali CD',
    'link': 'https://www.kali.org/',
    'official': true
  },
  'linuxmint': {
    'logo': '@/linuxmint.svg',
    'name': 'Linux Mint',
    'link': 'https://www.linuxmint.com/'
  },
  'linuxmint-cd': {
    'logo': '@/linuxmint.svg',
    'name': 'Linux Mint CD',
    'link': 'https://www.linuxmint.com/download.php'
  },
  'manjaro': {
    'logo': '@/manjaro.svg',
    'name': 'Manjaro',
    'link': 'https://manjaro.org/',
    'official': true
  },
  'mariadb': {
    'logo': '@/mariadb.svg',
    'name': 'MariaDB',
    'link': 'https://mariadb.org/'
  },
  'opensuse': {
    'logo': '@/opensuse.svg',
    'name': 'openSUSE',
    'link': 'https://www.opensuse.org/'
  },
  'raspbian': {
    'logo': '@/raspbian.svg',
    'name': 'Raspbian',
    'link': 'https://www.raspberrypi.org/downloads/raspbian/',
    'official': true
  },
  'ubuntu': {
    'logo': '@/ubuntu.svg',
    'name': 'Ubuntu',
    'link': 'https://www.ubuntu.com/'
  },
  'ubuntu-releases': {
    'logo': '@/ubuntu.svg',
    'name': 'Ubuntu Releases',
    'link': 'http://releases.ubuntu.com/'
  },
  'ubuntu-cdimage': {
    'logo': '@/ubuntu.svg',
    'name': 'Ubuntu CDi',
    'link': 'http://cdimage.ubuntu.com/'
  }
};

for (let name in repohelp) {
  if (!!repoconfig[name]) {
    repoconfig[name].details = repohelp[name];
  }
}
