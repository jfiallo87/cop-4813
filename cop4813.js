angular.module('cop4813', ['ngRoute', 'ngSanitize', 'ui.mask']).config(
        function($routeProvider) {
          $routeProvider.when('/', {
            templateUrl: 'main/index.html'
          }).when('/assignments/1', {
            templateUrl: 'assignments/1/index.html'
          }).when('/assignments/2', {
            templateUrl: 'assignments/2/index.html'
          }).when('/assignments/3', {
            templateUrl: 'assignments/3/index.html',
            controller: 'a3'
          }).otherwise({
            redirectTo: '/'
          });
        }).filter('tel', function() {
  return function(tel) {
    if (!tel) { return ''; }
    var value = tel.toString().trim().replace(/^\+/, '');
    if (value.match(/[^0-9]/)) { return tel; }
    var country, city, number;
    switch (value.length) {
    case 10: // +1PPP####### -> C (PPP) ###-####
      country = 1;
      city = value.slice(0, 3);
      number = value.slice(3);
      break;
    case 11: // +CPPP####### -> CCC (PP) ###-####
      country = value[0];
      city = value.slice(1, 4);
      number = value.slice(4);
      break;
    case 12: // +CCCPP####### -> CCC (PP) ###-####
      country = value.slice(0, 3);
      city = value.slice(3, 5);
      number = value.slice(5);
      break;
    default:
      return tel;
    }
    if (country == 1) {
      country = '';
    }
    number = number.slice(0, 3) + '-' + number.slice(3);
    return (country + ' (' + city + ') ' + number).trim();
  };
}).filter('url', function() {
  return window.encodeURIComponent;
}).filter('br', function() {
  return function(txt) {
    if (!txt) { return ''; }
    return txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
  };
}).controller(
        'a3',
        function($scope, dateFilter, telFilter, urlFilter, brFilter) {
          $scope.currentDate = new Date();
          $scope.mailto = '';
          $scope.step = 1;
          $scope.model = {
            state: 'AL'
          };
          $scope.next = function() {
            $scope.step++;
            subject = 'COP4813 Assignment 3';
            body = 'Name: ' + $scope.model.firstName + ' '
                    + $scope.model.lastName + '. ';
            body += 'Address: ' + $scope.model.address + ', '
                    + $scope.model.city + ', ' + $scope.model.state + ' '
                    + $scope.model.zip + '. ';
            body += 'Phone Number: ' + telFilter($scope.model.phone) + '. ';
            body += 'Email: ' + $scope.model.email + '. ';
            body += 'Birth Date: ' + dateFilter($scope.model.birthdate) + '. ';
            body += 'Message: ' + $scope.model.message + '.';
            $scope.mailto = 'mailto:juan_fiallo@daytonastate.edu?subject='
                    + urlFilter(subject) + '&body=' + urlFilter(body);
          };
          $scope.back = function() {
            $scope.step--;
          };
        });