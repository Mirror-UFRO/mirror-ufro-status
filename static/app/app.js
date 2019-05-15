(function(){
    'use strict';

    const md = markdownit({ linkify: true });
    const app = angular.module('app', []);
    app.controller('MainController', MainController);

    MainController.$inject = ['$scope', '$http', '$sce', '$timeout'];
    function MainController($scope, $http, $sce, $timeout) {
        let helpModalElement = document.getElementById('helpModal');
        let helpModal = new Modal(helpModalElement);
        $scope.selrepo = null;

        $scope.load = function() {
            $scope.loading = true;
            $scope.data = null;

            // Retrieve repository information
            $http.get('/status').then(function(response) {
                let data = response.data;
                if (!data.hasOwnProperty('mirrors')) {
                    alert('Mirrors cound not be retrieved!');
                    return [];
                }

                // Check settings available for each mirror
                for (let repo in data.mirrors) {
                    if (!data.mirrors.hasOwnProperty(repo)) {
                        continue;
                    }

                    // Hide repos that aren't on the config
                    if (!repoconfig.hasOwnProperty(repo)) {
                        delete data.mirrors[repo];
                        continue;
                    }

                    // Default data
                    data.mirrors[repo].link = '#';

                    // Copy settings to data object
                    for (let j in repoconfig[repo]) {
                        if (!repoconfig[repo].hasOwnProperty(j)) {
                            continue;
                        }

                        let val = repoconfig[repo][j];
                        if (j === 'logo') {
                            // Replace placeholder for logo URL
                            val = val.replace('@', '/static/img/logos');
                        }

                        data.mirrors[repo][j] = val;
                    }

                    // In progress
                    if (data.mirrors[repo].hasOwnProperty('status')) {
                        let r = data.mirrors[repo];
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
                    if (!data.mirrors[repo].hasOwnProperty('name')) {
                        data.mirrors[repo].name = repo;
                    }

                    // Mirror help
                    if (data.mirrors[repo].hasOwnProperty('details')) {
                        let html = md.render(data.mirrors[repo].details);
                        data.mirrors[repo].details = $sce.trustAsHtml(html);
                    }
                }
                return data;
            }).then(function(data) {
                $scope.data = data;
                $scope.loading = false;
            });
        };

        $scope.relatime = function(dt) {
            let msPerMinute = 60 * 1000;
            let msPerHour = msPerMinute * 60;
            let msPerDay = msPerHour * 24;
            let msPerMonth = msPerDay * 30;
            let msPerYear = msPerDay * 365;
            let elapsed = Date.now() - Date.parse(dt);

            let number = 0;
            let value = '';

            if (elapsed < msPerMinute) {
                number = Math.round(elapsed/1000);
                value = 'second';
            } else if (elapsed < msPerHour) {
                number = Math.round(elapsed/msPerMinute);
                value = 'minute';
            } else if (elapsed < msPerDay) {
                number = Math.round(elapsed/msPerHour);
                value = 'hour';
            } else if (elapsed < msPerMonth) {
                number = Math.round(elapsed/msPerDay);
                value = 'day';
            } else if (elapsed < msPerYear) {
                number = Math.round(elapsed/msPerMonth);
                value = 'month';
            } else {
                number = Math.round(elapsed/msPerYear);
                value = 'year';
            }

            if (number !== 1) {
                value += 's';
            }

            return number + ' ' + value + ' ago';
        };

        $scope.relatimeShort = function(dt) {
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
        };

        $scope.openHelp = function(e, repo) {
            e.preventDefault();
            if (!repo.details) {
                alert('No available help for this repository.');
                return;
            }

            $scope.selrepo = repo;
            helpModal.show();
        };

        $scope.$watch('data', function() {
            $timeout(function() {
                var els = document.querySelectorAll('[data-toggle="tooltip"]');
                Array.prototype.forEach.call(els, function(el) {
                    new Tooltip(el);
                })

            });
        });

        $scope.load();
    }
})();
