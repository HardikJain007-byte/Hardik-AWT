angular.module('billApp', [])
    .controller('BillController', function ($scope) {
        // Initial records
        $scope.records = [

        ];

        $scope.newRecord = {};

        // Add new record
        $scope.addRecord = function (form) {
            if (form.$valid) {
                let newId = $scope.records.length + 1;
                $scope.records.push({
                    id: newId,
                    name: $scope.newRecord.name,
                    amount: $scope.newRecord.amount,
                    date: $scope.newRecord.date
                });
                $scope.newRecord = {};
                form.$setPristine();
                form.$setUntouched();
            }
        };
    });
