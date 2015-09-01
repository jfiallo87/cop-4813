angular.module("cop4813", ["ngRoute"]).config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "main/index.html"
  }).when("/assignments/1", {
    templateUrl: "assignments/1/index.html"
  }).when("/assignments/2", {
    templateUrl: "assignments/2/index.html"
  }).otherwise({
    redirectTo: "/"
  });
});