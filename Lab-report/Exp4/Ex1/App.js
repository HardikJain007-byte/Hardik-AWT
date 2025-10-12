var app = angular.module("myApp", []);
    app.controller("FormController", function($scope) {
      $scope.user = {};

      $scope.submitForm = function() {
        if ($scope.myForm.$valid) {
          alert("Form Submitted!\nName: " + $scope.user.name + "\nEmail: " + $scope.user.email);
        }
      };
    });