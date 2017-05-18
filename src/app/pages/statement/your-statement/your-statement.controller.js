(function () {
    'use strict';

    angular
        .module('app.pages.statement')
        .controller('YourStatementController', YourStatementController);

    /* @ngInject */
    function YourStatementController($scope, activeStep, $state, pageService, userService, stepService) {

        angular.extend($scope, activeStep.model, {
            forward: true,
            sendData: sendData
        });

        if ($scope.fullName === null) {
            userService.getUser().then(function (user) {
                $scope.fullName = user.name + ' ' + user.lastName;
            });
        }

        pageService
            .reset()
            .setShowBC(false)
            .addCrumb({name: 'Dashboard', path: 'home'})
            .setPageTitle('SLAP | Your SLAPstatement');

        function sendData() {
            stepService.updateActiveModel($scope);
            stepService.setFinishActiveStep();

            var nextStep = stepService.getNextAndPrevStep().nextStep;
            var urls = activeStep.sref.split('.');

            return stepService.sendApiData(urls[urls.length - 1], $scope.data)
                .then(function () {
                    $state.go(nextStep.sref);
                });
        }
    }
}());