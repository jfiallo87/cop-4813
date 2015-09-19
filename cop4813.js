angular.module('cop4813', ['ngRoute', 'ngSanitize', 'ui.mask', 'highcharts-ng']).config(
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
          }).when('/assignments/4', {
            templateUrl: 'assignments/4/index.html',
            controller: 'a4'
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
          $scope.captchas = [{
            q: 'If tomorrow is Monday, what day is today?',
            a: 'Sunday'
          }, {
            q: 'If tomorrow is Sunday, what day is today?',
            a: 'Saturday'
          }, {
            q: 'If yesterday was Sunday, what day is today?',
            a: 'Monday'
          }];
          $scope.cq = Math.floor(Math.random() * 3);
          $scope.ca = null;
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
            body += 'Message: ' + $scope.model.message;
            $scope.mailto = 'mailto:juan_fiallo@daytonastate.edu?subject='
                    + urlFilter(subject) + '&body=' + urlFilter(body);
          };
          $scope.back = function() {
            $scope.step--;
          };
        }).controller('a4', function($scope, orderByFilter) {
  $scope.G = 6.674 * Math.pow(10, -11);
  $scope.m1 = 1;
  $scope.m2 = 1;
  $scope.distances = [{
    value: 100
  }, {
    value: 200
  }, {
    value: 300
  }, {
    value: 400
  }, {
    value: 500
  }];
  $scope.newDistance = null;
  $scope.F = [];
  $scope.addNewDistance = function() {
    if ($scope.newDistance) {
      $scope.distances.push({
        value: $scope.newDistance
      });
    }
    $scope.newDistance = null;
  };
  $scope.removeDistance = function(i) {
    $scope.distances.splice(i, 1);
  };
  $scope.plotGravity = function() {
    $scope.gravity = {
      chart: {
        options: {
          chart: {
            type: 'line',
            zoomType: 'x'
          }
        },
        series: [{
          name: 'Gravity',
          data: $scope.F
        }],
        title: {
          text: 'Gravity Plot'
        }
      }
    };
  };
  $scope.calculateGravity = function() {
    $scope.F = [];
    var m1 = $scope.m1 * 1000000000;
    var m2 = $scope.m2 * 1000000000;
    $scope.distances = orderByFilter($scope.distances, 'value');
    angular.forEach($scope.distances, function(distance) {
      var d = distance.value;
      var F = Math.ceil(($scope.G * m1 * m2) / Math.pow(d, 2));
      $scope.F.push([d, F]);
    });
    $scope.plotGravity();
  };
  $scope.calculateGravity();
});