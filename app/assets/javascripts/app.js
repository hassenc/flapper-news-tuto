angular.module('flapperNews', ['ui.router', 'templates'])
.config([
'$stateProvider',
'$urlRouterProvider',
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
    .state('home', {
      url: '/home',
      templateUrl: 'home/_home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          var a = posts.getAll();
          return a;
        }]
      }
    });

  $urlRouterProvider.otherwise('home')
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
