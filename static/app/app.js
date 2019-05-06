(function(){
    'use strict';

    var app = angular.module('app', []);
    app.controller('MainController', MainController);

    MainController.$inject = ['$rootScope', '$scope', '$http'];
    function MainController($rootScope, $scope, $http) {
        $scope.greeting = 'Hello World';

        $scope.load = function() {
            $scope.loading = true;
            $scope.data = null;

            // Retrieve repository information
            $http.get('/status').then(function(response) {
                var data = response.data;

                // Check settings available for each mirror
                for (var repo in data.mirrors) {
                    if (!data.mirrors.hasOwnProperty(repo)) {
                        continue;
                    }

                    // Default data
                    data.mirrors[repo].link = '#';

                    // Copy settings to data object
                    for (var j in repoconfig[repo]) {
                        if (!repoconfig[repo].hasOwnProperty(j)) {
                            continue;
                        }

                        var val = repoconfig[repo][j];
                        if (j === 'logo') {
                            // Replace placeholder for logo URL
                            val = val.replace('@', '/static/img/logos');
                        }

                        data.mirrors[repo][j] = val;
                    }

                    // In progress
                    if (data.mirrors[repo].hasOwnProperty('status')) {
                        var r = data.mirrors[repo];
                        if (typeof r.status === 'number') {
                            r.status = 'sync (' + (r.status * 100).toFixed(2) + '%' + ')';
                        } else if (r.status === 'idk' || !r.status) {
                            r.status = 'unknown';
                        } else if (r.status !== 'ready') {
                            r.statusLine = r.status.trim() + '';
                            r.status = 'in progress';
                        }
                    }
                }
                return data;
            }).then(function(data) {
                $scope.data = data;
                $scope.loading = false;
            });

            $scope.openHelp = function(e, repo) {
                e.preventDefault();
                $rootScope.repo = repo;
                $rootScope.$broadcast("showHelp");
            };

            $scope.relatime = function(dt) {
                var msPerMinute = 60 * 1000;
                var msPerHour = msPerMinute * 60;
                var msPerDay = msPerHour * 24;
                var msPerMonth = msPerDay * 30;
                var msPerYear = msPerDay * 365;
                var elapsed = (new Date()) - (new Date(dt));

                var number = 0;
                var value = '';

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
                var msPerMinute = 60 * 1000;
                var msPerHour = msPerMinute * 60;
                var msPerDay = msPerHour * 24;
                var msPerMonth = msPerDay * 30;
                var msPerYear = msPerDay * 365;
                var elapsed = (new Date()) - (new Date(dt));

                var number = 0;
                var value = '';

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
            }
        };

        $scope.load();
    }
})();
