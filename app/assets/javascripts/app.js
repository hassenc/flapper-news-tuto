angular.module('flapperNews', ['ui.router', 'templates', 'Devise'])
.config([
'$stateProvider',
'$urlRouterProvider',
'AuthProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: 'posts/_posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    })
    .state('users', {
      url: '/users/login',
      templateUrl: 'users/_users_login.html',
      controller: 'UsersCtrl'
    })
    .state('home', {
      url: '/',
      templateUrl: 'home/_home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          var a = posts.getAll();
          return a;
        }]
      }
    });

  $urlRouterProvider.otherwise('/')
}])

.factory('posts', [
'$http',
function($http){
  var o = {
    posts: []
  };
  o.getAll = function() {
    return $http.get('/posts.json').then(function(res){
      angular.copy(res.data, o.posts);
    });
  };
  o.get = function(id) {
    return $http.get('/posts/' + id + '.json').then(function(res){
      return res.data;
    });
  };
  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments.json', comment).then(function(res){
      return res.data;
    });;
  };
  o.create = function(post) {
    return $http.post('/posts.json', post).then(function(success){
      o.posts.push(success.data);
    });
  };
  return o;
}])

.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
  $scope.post = post;

  $scope.addComment = function(){

    if($scope.body === '') { return; }
    posts.addComment(post.id, {
      body: $scope.body,
      author: 'user',
    }).then(function(comment) {
      if(post.comments == undefined) { post.comments = [] }
      post.comments.push(comment);
    });
    $scope.body = '';
    $scope.author = '';

  };

}])

.controller('UsersCtrl', [
'$scope',
'$http',
'Auth',
function($scope, $http, Auth){
  console.log(Auth._currentUser);
  $scope.login_user = {email: null, password: null};

  $scope.login = function() {
    var credentials = {
      email: $scope.login_user.email,
      password: $scope.login_user.password,
      // password_confirmation: 'password1'
    };
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };

    Auth.login(credentials, config).then(function(user) {
        console.log(user); // => {id: 1, ect: '...'}
        console.log(Auth._currentUser);
    }, function(error) {
        // Authentication failed...
    });

    $scope.$on('devise:login', function(event, currentUser) {
        // after a login, a hard refresh, a new tab
    });

  };

  $scope.logout = function() {
    var config = {
        headers: {
            'X-HTTP-Method-Override': 'DELETE'
        }
    };
    // Log in user...
    // ...
    Auth.logout(config).then(function(oldUser) {
        console.log(oldUser);
        console.log(Auth._currentUser);
    }, function(error) {
        // An error occurred logging out.
    });

    $scope.$on('devise:logout', function(event, oldCurrentUser) {
        // ...
    });
  };



  $scope.signup = function() {

    var credentials = {
      email: $scope.signup_user.email,
      password: $scope.signup_user.password,
      // password_confirmation: 'password1'
    };
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };
    Auth.register(credentials, config).then(function(registeredUser) {
      console.log(registeredUser); // => {id: 1, ect: '...'}
      console.log(Auth._currentUser);
    }, function(error) {
      // Registration failed...
    });
    $scope.$on('devise:new-registration', function(event, user) {
      console.log('devise:new-registration');
      // ...
    });
  }


}])

.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };

}]);
