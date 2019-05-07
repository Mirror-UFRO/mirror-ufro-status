var repohelp = {
    archlinux: `
        <p>Line for <code>mirrorlist</code> configuration file</p>
        <pre><code>Server = http://mirror.ufro.cl/archlinux/$repo/os/$arch</code></pre>`,
    centos: `
        <p>Full CentOS mirror.</p>
        <p>
            CentOS 7 ISO files can be found at
            <a href="https://mirror.ufro.cl/centos/7/isos/x86_64/">aquí</a>.
        </p>`,
    debian: `
        <p>Debian mirror for architectures: <code>all amd64 arm64 armel armhf hurd-i386 i386 ia64 kfreebsd-amd64 kfreebsd-i386 mips mips64el powerpc ppc64el source</code>.</p>
        <p>Deb lines for <code>stretch</code>:</p>
        <p class="scroll-y">
        <code>
            deb http://mirror.ufro.cl/debian/ stretch main contrib
            deb-src http://mirror.ufro.cl/debian/ stretch main contrib
            
            deb http://mirror.ufro.cl/debian/ stretch-updates main contrib
            deb-src http://mirror.ufro.cl/debian/ stretch-updates main contrib
            
            deb http://mirror.ufro.cl/debian stretch-backports main contrib
            deb-src http://mirror.ufro.cl/debian stretch-backports main contrib
        </code>
        </p>`,
    'debian-cd': `
        <p>Debian ISO files and releases stuff.</p>
        <p>Direct links:</p>
        <ul>
            <li><a href="https://mirror.ufro.cl/debian-cd/9.5.0-live/amd64/iso-hybrid/">Directorio de ISOs live 9.5.0 amd64</a></li>
            <li>
                <a href="https://mirror.ufro.cl/debian-cd/9.5.0/amd64/iso-cd/debian-9.5.0-amd64-netinst.iso">ISO netinst 9.5.0 amd64</a>
                <p class="scroll-y">SHA256: <code>1f97a4b8dee7c3def5cd8215ff01b9edef27c901b28fa8b1ef4f022eff7c36c2</code></p>
            </li>
        </ul>`,
    epel: `
      <p>Fedora's Extra Packages for Enterprise Linux (EPEL) full mirror.</p>`,
    fedora: `
        <p>Fedora full mirror.</p>
        <p>Direct links:</p>
        <ul>
            <li>
                <a href="https://mirror.ufro.cl/fedora/linux/releases/28/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-28-1.1.iso">ISO 28 Workstation Live x86_64</a>
                <p class="scroll-y">SHA256: <code>bd5c9ee34b7698eb0852a320da4fbdf616222a493d99f6054aa96afa96207bfb</code></p>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/fedora/linux/releases/28/Workstation/x86_64/iso/Fedora-Workstation-netinst-x86_64-28-1.1.iso">ISO 28 Workstation netinst x86_64</a>
                <p class="scroll-y">SHA256: <code>34da8b46b23d786bb1d43a77a4dcd713c446fc70a4ace0c6f52e43b086350562</code></p>
            </li>
        </ul>`,
    ius: `
        <p>IUS Community Project full mirror</p>
        <p>
            <blockquote class="blockquote">
                <strong>I</strong>nline with <strong>U</strong>pstream <strong>S</strong>table
            </blockquote>
        </p>`,
    linuxmint: `
        Linux Mint full mirror.`,
    'linuxmint-cd': `
        <p>Linux Mint releases (ISO files) full mirror.</p>
        <p>Linux Mint 19 Tara v2 (64bit) ISO files:</p>
        <ul>
            <li>
                <a href="https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-cinnamon-64bit-v2.iso">Cinnamon</a>
                <p class="scroll-y">SHA256: <code>c92a9baafdd599da057a97236f0a853ce1f8b3c7ad41e652ceba493f9ca5623f</code></p>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-mate-64bit-v2.iso">Mate</a>
                <p class="scroll-y">SHA256: <code>f8164654b7600ced1aa8ef6abee2e56620388b0baa161d7b17699f425223d7c7</code></p>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/linuxmint-cd/stable/19/linuxmint-19-xfce-64bit-v2.iso">XFCE</a>
                <p class="scroll-y">SHA256: <code>c996a0de1e010476f36ed55322cb055b07d3bd507f0c60eff65b07634f20f897</code></p>
            </li>
        </ul>`,
    manjaro: `
        <p>Manjaro full mirror.</p>`,
    raspbian: `
        <p>Raspbian full mirror.</p>`,
    ubuntu: `
        <p>Ubuntu full archive mirror.</p>`,
    'ubuntu-releases': `
        <p>Ubuntu releases (ISO files and stuff) full mirror.</p>
        <p>ISOs amd64:</p>
        <ul>
            <li>
                <a href="https://mirror.ufro.cl/ubuntu-releases/18.04/ubuntu-18.04-desktop-amd64.iso">18.04 LTS desktop</a>
                <p class="scroll-y">SHA256: <code>a55353d837cbf7bc006cf49eeff05ae5044e757498e30643a9199b9a25bc9a34</code></p>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/ubuntu-releases/18.04/ubuntu-18.04-live-server-amd64.iso">18.04 live server</a></p>
                <p class="scroll-y">SHA256: <code>7a1c2966f82268c14560386fbc467d58c3fbd2793f3b1f657baee609b80d39a8</code>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/ubuntu-releases/16.04.4/ubuntu-16.04.4-desktop-amd64.iso">16.04.4 LTS desktop</a></p>
                <p class="scroll-y">SHA256: <code>3380883b70108793ae589a249cccec88c9ac3106981f995962469744c3cbd46d</code>
            </li>
            <li>
                <a href="https://mirror.ufro.cl/ubuntu-releases/16.04.4/ubuntu-16.04.4-server-amd64.iso">16.04.4 LTS server</a></p>
                <p class="scroll-y">SHA256: <code>0a03608988cfd2e50567990dc8be96fb3c501e198e2e6efcb846d89efc7b89f2</code>
            </li>
        </ul>`,
    'ubuntu-cdimage': `
        Ubuntu CDImage full mirror. Contains ISO files and more stuff about daily images and
        other Ubuntu derivates.`
};

var repoconfig = {
    'archlinux': {
        'logo': '@/archlinux.svg',
        'name': 'Arch Linux',
        'link': 'https://www.archlinux.org/'
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
        'name': 'Debian CD (ISOs)',
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
        'link': 'https://www.kali.org/'
    },
    'kali-images': {
        'logo': '@/kali.svg',
        'name': 'Kali CD images',
        'link': 'https://www.kali.org/'
    },
    'linuxmint': {
        'logo': '@/linuxmint.svg',
        'name': 'Linux Mint',
        'link': 'https://www.linuxmint.com/'
    },
    'linuxmint-cd': {
        'logo': '@/linuxmint.svg',
        'name': 'Linux Mint ISOs',
        'link': 'https://www.linuxmint.com/download.php'
    },
    'manjaro': {
        'logo': '@/manjaro.svg',
        'name': 'Manjaro',
        'link': 'https://manjaro.org/'
    },
    'opensuse': {
        'logo': '@/opensuse.svg',
        'name': 'openSUSE',
        'link': 'https://www.opensuse.org/'
    },
    'raspbian': {
        'logo': '@/raspbian.svg',
        'name': 'Raspbian',
        'link': 'https://www.raspberrypi.org/downloads/raspbian/'
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
        'name': 'Ubuntu CDImage',
        'link': 'http://cdimage.ubuntu.com/'
    }
};

for (let name in repohelp) {
    if (!!repoconfig[name]) {
        repoconfig[name].details = repohelp[name];
    }
}
