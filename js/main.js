var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'',
		templateUrl: 'templates/forum/home.html',
		controller: 'HomeController',
	})
	// Configure states for "content" and "about"

	.state('newPost', {
		url: '/newPost',
		templateUrl: 'templates/forum/newPost.html',
		controller: 'NewPostController',
	})

	.state('threads', {
		url: '/thread',
		templateUrl: 'templates/forum/threads.html',
		controller: 'ThreadController'
	})
}) 

.controller('HomeController', function($scope){
})

.controller('NewPostController', function($scope){
})

.controller('ThreadController', function($scope, $http) {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	var FORUM_NAME = "youtatest1";

	  $scope.name = "stuff";
	  $scope.posts = {};

	  $http.get('https://disqus.com/api/3.0/forums/listPosts.json', {
	      params: {
	        access_token: ACCESS_TOKEN,
	        api_key: API_KEY,
	        forum: FORUM_NAME,
	        order: "asc" } 
	  }).success(function(response) {
	    var data = response.response;
	    console.log(data);
	    $scope.posts = data;
	  });
	
})

$('#login').click(function() {
	var ref = new Firebase("https://gamersuw.firebaseio.com");
	ref.authWithOAuthPopup("facebook", function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	});
})

$('#titleleft').click(function() {
	if($('#leftbar').css('display') == 'none') {
		$('#leftbar').css('display', 'initial')
		$('#left').css('height', 'auto')
		$('#left').css('z-index', '1001')
	} else {
		$('#leftbar').css('display', 'none')
		$('#left').css('z-index', '0')
	}
});

$('#titleright').click(function() {
	if($('#rightbar').css('display') == 'none') {
		$('#rightbar').css('display', 'initial')
		$('#right').css('height', 'auto')
		$('#right').css('position', 'absolute')
		$('#right').css('z-index', '1001')
	} else {
		$('#rightbar').css('display', 'none')
		$('#right').css('z-index', '0')
	}
});

$(window).resize(function() {
	if($('#titleleft').css('display') == 'none') {
		$('#rightbar').css('display', 'initial')
		$('#leftbar').css('display', 'initial')
	} else {
		$('#rightbar').css('display', 'none')
		$('#leftbar').css('display', 'none')
	}
});

// $(newPostButton).click(function() {


// })
