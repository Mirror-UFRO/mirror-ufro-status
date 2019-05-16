(function(d, w){
    'use strict';

    const md = markdownit({ linkify: true });

    let app = new Vue({
        el: "#app",
        data: {
            selrepo: { name: '', details: '' },
            loading: true,
            data: null,
            helpModal: null
        },
        mounted() {
            getStatus(function(err, data) {
                app.loading = false;
                if (err) {
                    console.error(err);
                    return;
                }

                if (!data.hasOwnProperty('mirrors')) {
                    alert('Mirrors cound not be retrieved!');
                    return [];
                }

                // Check settings available for each mirror
                for (let repo in data.mirrors) {
                    // Hide repos that aren't on the config
                    if (!repoconfig.hasOwnProperty(repo)) {
                        delete data.mirrors[repo];
                        continue;
                    }

                    // Parse and filter mirror data
                    parseMirror(data.mirrors[repo], repo);
                }

                app.data = data;
            });
            
            this.helpModal = d.querySelector('.modal');
        },
        methods: {
            relatimeShort: function(dt) {
                let msPerMinute = 60 * 1000;
                let msPerHour = msPerMinute * 60;
                let msPerDay = msPerHour * 24;
                let msPerMonth = msPerDay * 30;
                let msPerYear = msPerDay * 365;
                let elapsed = (new Date()) - (new Date(dt));

                let number = 0;
                let value = '';

                if (elapsed < msPerMinute) {
                    number = Math.round(elapsed/1000);
                    value = 's';
                } else if (elapsed < msPerHour) {
                    number = Math.round(elapsed/msPerMinute);
                    value = 'm';
                } else if (elapsed < msPerDay) {
                    number = Math.round(elapsed/msPerHour);
                    value = 'h';
                } else if (elapsed < msPerMonth) {
                    number = Math.round(elapsed/msPerDay);
                    value = 'd';
                } else if (elapsed < msPerYear) {
                    number = Math.round(elapsed/msPerMonth);
                    value = 'm';
                } else {
                    number = Math.round(elapsed/msPerYear);
                    value = 'y';
                }

                return number + value;
            },
            openHelp: function(repo) {
                if (!repo.details) {
                    alert('No available help for this repository.');
                    return;
                }

                app.selrepo = repo;
                app.toggleModal();
            },
            mdRender: function(content) {
                return md.render(content);
            },
            toggleModal: function() {
                let cl = d.querySelector('body').classList;
                cl.toggle('has-modal');
            }
        }
    });

    function parseMirror(mirror, name) {
        // Default data
        mirror.link = '#';
        mirror.folderLink = `https://mirror.ufro.cl/${name}/`;

        // Copy settings to data object
        for (let j in repoconfig[name]) {
            if (!repoconfig[name].hasOwnProperty(j)) {
                continue;
            }

            let val = repoconfig[name][j];
            if (j === 'logo') {
                // Replace placeholder for logo URL
                val = val.replace('@', '/static/img/logos');
            }

            mirror[j] = val;
        }

        // In progress
        if (mirror.hasOwnProperty('status')) {
            let r = mirror;
            if (typeof r.status === 'number') {
                r.status = 'sync (' + (r.status * 100).toFixed(2) + '%' + ')';
            } else if (r.status === 'idk' || !r.status) {
                r.status = 'unknown';
            } else if (r.status !== 'ready') {
                r.statusLine = r.status.trim() + '';
                r.status = 'in progress';
            }
        }

        // Add "repo" as property name if it hasn't been set
        if (!mirror.hasOwnProperty('name')) {
            mirror.name = repo;
        }
    }

    function getStatus(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://mirror.ufro.cl/status');
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(null, JSON.parse(xhr.responseText));
            } else {
                callback(new Error(xhr.status));
            }
        };
        xhr.send();
    }
})(document, window);
