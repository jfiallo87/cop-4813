angular
        .module(
                'cop4813',
                ['ngRoute', 'ngSanitize', 'ui.mask', 'highcharts-ng',
                    'ngDragDrop'])
        .config(function($routeProvider) {
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
          }).when('/assignments/5', {
            templateUrl: 'assignments/5/index.html',
            controller: 'a5'
          }).when('/assignments/6/1', {
            templateUrl: 'assignments/6/1/index.html'
          }).when('/assignments/6/2', {
            templateUrl: 'assignments/6/2/index.html'
          }).when('/assignments/6/3', {
            templateUrl: 'assignments/6/3/index.html',
            controller: 'a6.3'
          }).when('/assignments/7', {
            templateUrl: 'assignments/7/index.html',
            controller: 'a7'
          }).when('/assignments/8', {
            templateUrl: 'assignments/8/index.html'
          }).otherwise({
            redirectTo: '/'
          });
        })
        .filter('tel', function() {
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
        })
        .filter('url', function() {
          return window.encodeURIComponent;
        })
        .filter('br', function() {
          return function(txt) {
            if (!txt) { return ''; }
            return txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
          };
        })
        .controller(
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
                            + $scope.model.city + ', ' + $scope.model.state
                            + ' ' + $scope.model.zip + '. ';
                    body += 'Phone Number: ' + telFilter($scope.model.phone)
                            + '. ';
                    body += 'Email: ' + $scope.model.email + '. ';
                    body += 'Birth Date: ' + dateFilter($scope.model.birthdate)
                            + '. ';
                    body += 'Message: ' + $scope.model.message;
                    $scope.mailto = 'mailto:juan_fiallo@daytonastate.edu?subject='
                            + urlFilter(subject) + '&body=' + urlFilter(body);
                  };
                  $scope.back = function() {
                    $scope.step--;
                  };
                })
        .controller('a4', function($scope, orderByFilter) {
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
        })
        .controller(
                'a5',
                function($scope) {
                  $scope.drawing = false;
                  var t = 0;
                  var R = 0;
                  var r = 0;
                  var O = 0;
                  var x = 0;
                  var y = 0;
                  var interval;
                  var intervals = 0;
                  var canvas = document.getElementById("spirograph");
                  var size = window.innerWidth * 2 / 3;
                  if (size > 500) {
                    size = 500;
                  }
                  canvas.width = size;
                  canvas.height = size;
                  var ctx = canvas.getContext("2d");
                  var center = function() {
                    ctx.translate(size / 2, size / 2);
                  }
                  center();
                  $scope.play = function() {
                    $scope.drawing = true;
                    randomize();
                    interval = setInterval(spirograph, speed());
                  }
                  $scope.stop = function() {
                    clearInterval(interval);
                    $scope.drawing = false;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    center();
                  }
                  var spirograph = function() {
                    intervals++;
                    draw();
                    animate();
                  }
                  var draw = function() {
                    x = Math.floor((R + r) * Math.cos(t) - (r + O)
                            * Math.cos(((R + r) / r) * t));
                    y = Math.floor((R + r) * Math.sin(t) - (r + O)
                            * Math.sin(((R + r) / r) * t));
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    t += 0.05;
                  }
                  var animate = function() {
                    if (intervals == 1000) {
                      randomize();
                    }
                  }
                  var randomize = function() {
                    randomizeColor();
                    R = randomNumber(size / 10, size / 8);
                    r = randomNumber(1, R - 5);
                    O = randomNumber(5, size / 8);
                    intervals = 0;
                  }
                  var randomizeColor = function() {
                    ctx.beginPath();
                    ctx.strokeStyle = '#'
                            + Math.floor(Math.random() * 16777215).toString(16);
                  }
                  var speed = function() {
                    return randomNumber(10, 25);
                  }
                  var randomNumber = function(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                  }
                })
        .controller(
                'a6.3',
                function($scope) {
                  var options = {};
                  var map = new google.maps.Map(document.getElementById("map"),
                          options);
                  var url = 'http://cop4813.juanfiallo.com/assignments/6/3/hialeah.kml?v=0.1';
                  var kml = {
                    map: map
                  };
                  var layer = new google.maps.KmlLayer(url, kml);
                }).controller(
                'a7',
                function($scope, $window) {
                  $scope.model = {};
                  $scope.model.deck = [];
                  var currentCardIndex = 0;
                  var nextCard = function() {
                    $scope.model.currentGuess = $scope.model.deck[0];
                    currentCardIndex = Math.floor(Math.random() * $scope.model.deck.length);
                    $scope.model.currentCard = $scope.model.deck[currentCardIndex];
                  };
                  $scope.setUp = function() {
                    $scope.model.successCount = 0;
                    $scope.model.deck = [];
                    $scope.model.discardedDeck = [];
                    var cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];
                    var cardPrototypes = [];
                    for (i = 1; i <= 13; i++) {
                      var cardPrototype = {
                        number: i,
                        name: '' + i
                      };
                      cardPrototypes.push(cardPrototype);
                    }
                    cardPrototypes[0].name = 'ace';
                    cardPrototypes[10].name = 'jack';
                    cardPrototypes[11].name = 'queen';
                    cardPrototypes[12].name = 'king';
                    angular.forEach(cardSuits, function(suit) {
                      angular.forEach(cardPrototypes, function(prototype) {
                        var card = {
                          id: suit + '-' + prototype.number,
                          name: prototype.name + ' of ' + suit,
                          img: 'assignments/7/deck/' + prototype.name + '_of_'
                                  + suit + '.png',
                          revealed: false
                        };
                        $scope.model.deck.push(card);
                      });
                    });
                    nextCard();
                  };
                  $scope.setUp();
                  $scope.currentCardImg = function() {
                    var img = '';
                    if ($scope.model.currentCard && $scope.model.currentCard.img) {
                      img = 'assignments/7/deck/back.png';
                      if ($scope.model.currentCard.revealed) {
                        img = $scope.model.currentCard.img;
                      }
                    }
                    return img;
                  };
                  $scope.guess = function() {
                    if ($scope.model.currentGuess.id == $scope.model.currentCard.id) {
                      $scope.model.successCount++;
                    }
                    $scope.model.currentCard.revealed = true;
                  };
                  $scope.discard = function() {
                    var discardedCardName = $scope.model.deck.splice(currentCardIndex, 1)[0].name;
                    nextCard();
                    $window.alert('You discarded the ' + discardedCardName);
                  };
                });