(function() {
    var app = angular.module('app');
    app.controller('HelpController', HelpController);

    HelpController.$inject = ['$rootScope', '$scope'];
    function HelpController($rootScope, $scope) {
        $scope.repo = '';
        $scope.closeIcon = '&times;';

        $rootScope.$on("showHelp", function() {
            var helpModalElement = document.getElementById('helpModal');
            var helpModal = new Modal(helpModalElement);
            $scope.repo = $rootScope.repo;
            helpModal.show();
        });
    }
})();
