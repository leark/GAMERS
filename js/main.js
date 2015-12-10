var myApp = angular.module('myApp', ['ui.router', 'firebase']);
var ref;

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'home',
		templateUrl: 'templates/forum/home.html',
		controller: 'HomeController',
	})

	.state('featuredTopic', {
		url:'/featuredTopic',
		templateUrl: 'templates/forum/featuredTopic.html',
		controller: 'featuredTopicController',
	})

	.state('newThread', {
		url: '/newThread',
		templateUrl: 'templates/forum/newThread.html',
		controller: 'NewThreadController',	
	})

	.state('threads', {
		url: '/thread/{threadId}',
		templateUrl: 'templates/forum/threads.html',
		controller: 'ThreadController'
	})

	.state('irc', {
		url: '/irc',
		templateUrl: 'templates/forum/irc.html',
		controller: 'IrcController'
	})

	.state('general', {
		url: '/general',
		templateUrl: 'templates/forum/general.html',
		controller: "GeneralController"
	})

	.state('blogs', {
		url: '/blogs',
		templateUrl: 'templates/forum/blogs.html',
		controller: "BlogsController"
	})

	.state('moderator', {
		url: '/moderator',
		templateUrl: 'templates/moderator.html',
		controller: "ModeratorController"
	})
}) 

.controller('HomeController', function($scope){})

.controller('NewThreadController', function($scope, $firebaseArray) {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	$scope.submit = function() {
		console.log("Attempting to create new thread...");
		console.log($scope.forumSelect);
		ref = new Firebase("https://gameruw.firebaseio.com/");

		$.post("https://disqus.com/api/3.0/threads/create.json", 
		{	access_token: ACCESS_TOKEN,
			api_key: API_KEY,
			forum: $scope.forumSelect,
			title: $scope.threadTitle,
			message: $scope.threadMessage 
		}, function(response) {
			data = response.response;
			console.log("creating " + $scope.threadTitle);
			console.log(data);
			var threads = ref.child($scope.forumSelect);
			$scope.threads = $firebaseArray(threads);
			var thread = threads.child(data.id);
	  		thread.set({
				title: $scope.threadTitle,
	    		message: $scope.threadMessage,
	    		author: $scope.userName,
	    		featured: false,
	    		forum: $scope.forumSelect,
	    		replies: 0,
	    		recent: Firebase.ServerValue.TIMESTAMP
		    })
    		$scope.threadTitle = "";
    		$scope.threadMessage = "";
		})	
	}
})

.controller('IrcController', function($scope){})

.controller('GeneralController', function($scope, $firebaseArray){
	ref = new Firebase("https://gameruw.firebaseio.com/");
	var threads = ref.child('gamergroupgeneral');
	$scope.generals = $firebaseArray(threads);
})

.controller('BlogsController', function($scope, $firebaseArray){
	ref = new Firebase("https://gameruw.firebaseio.com/");
	var threads = ref.child('gamergroupblog');
	$scope.blogs = $firebaseArray(threads);
})

.controller('featuredTopicController', function($scope, $firebaseArray){
	ref = new Firebase("https://gameruw.firebaseio.com/");
	var threads = ref.child('gamergroupfeaturedtopic');
	$scope.featured = $firebaseArray(threads);
})

.controller('ThreadController', function($scope, $http, $stateParams, $firebaseArray) {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	var DISQUS_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
	var SECRET_KEY = "pn6sboBzfjR73EczCcJuRizm4QGbrB7WJFdykUF1XeNksXqH1Dmp1esoz4LY1rmn";
	
	var THREAD_ID = $stateParams.threadId;

	$scope.name = "stuff";
	$scope.posts = {};
	
	var forumName;
	var replies;

	$http({
		url: "https://disqus.com/api/3.0/threads/details.json",
		method: "GET",
		params: {
			api_key: API_KEY,
			thread: THREAD_ID
		}
	}).success(function(response) {
		forumName = response.response.forum;
		var ref = new Firebase("https://gameruw.firebaseio.com/");
		var forum = $firebaseArray(ref.child(forumName));
		forum.$loaded().then(function (response) { 
			$scope.first = forum.$getRecord(THREAD_ID);
			replies = $scope.first.replies;
			replies++;
		})
	})

	$scope.getPosts = function() {
		$http({
			url: 'https://disqus.com/api/3.0/threads/listPosts.json', 
			method: "GET",
			params: {
				access_token: ACCESS_TOKEN,
				api_key: API_KEY,
				thread: THREAD_ID,
				order: 'asc' 
			}
		}).success(function(response) {
			var data = response.response;
			for (var i =0; i < data.length; i++) {
		    	data[i].createdAt = Date.parse(data[i].createdAt);
	    	}
			$scope.posts = data;
		})
	}

	$scope.createPost = function() {
		var post = $('#replyText').val();
		var url = window.location.href;
		var id = url.substr(url.lastIndexOf("/") + 1);
		var authorName = $scope.userName;
		var authorEmail = $scope.userEmail;
		console.log(authorName);
		console.log(authorEmail);

		$.post("https://disqus.com/api/3.0/posts/create.json", 
		{	api_key: API_KEY,
			api_secret: SECRET_KEY,
			access_token: ACCESS_TOKEN,
			thread: THREAD_ID,
			message: post,
			author_name: authorName,
			author_email: authorEmail,
			strict: 1
		}, function(response) {
			$scope.getPosts;
			var threadRef = new Firebase('https://gameruw.firebaseio.com/' + forumName + '/' + id);
			threadRef.update({ replies: replies, recent: Firebase.ServerValue.TIMESTAMP });
			setTimeout(function() {
			    window.location.reload(true);
			}, 800);
		})	

		// $http({
		// 	url: "https://disqus.com/api/3.0/posts/create.json",
		// 	method: "POST",
		// 	params: {
		// 		api_secret: SECRET_KEY,
		// 		message: post,
		// 		thread: id,
		// 		author_name: $scope.userName,
		// 		author_email: $scope.userEmail
		// 	}
		// }).then(function successCallback(response) {
		// 	$scope.getPosts;

		// 	var threadRef = new Firebase('https://gameruw.firebaseio.com/' + forumName + '/' + id);

		// 	threadRef.update({ replies: replies, recent: Firebase.ServerValue.TIMESTAMP });

		// 	setTimeout(function(){
		// 	    window.location.reload(true);
		// 	}, 800);
		// }, function errorCallback(response) {
		// 	console.log(response);
		// });
	}
})

.controller('myController', function($scope, $firebaseArray) {
	$scope.forums = {};
	$scope.showLogin = true;
	$scope.numLimitNFeature = 6;
	$scope.numLimitFeature = 2;

	var ref = new Firebase("https://gameruw.firebaseio.com/");

	var blogs = ref.child('gamergroupblog');
	var featured = ref.child('gamergroupfeaturedtopic');
	var generals = ref.child('gamergroupgeneral');

	$scope.blogs = $firebaseArray(blogs);
	$scope.featured = $firebaseArray(featured);
	$scope.generals = $firebaseArray(generals);

	ref = new Firebase("https://gameruw.firebaseio.com");
	ref.onAuth(function(authData) {
		  if (authData) {
		    $scope.showLogin = false;
		    var scope = angular.element($("body")).scope();
	    	$scope.userName = authData.facebook.displayName;
	    	$scope.userEmail = authData.facebook.email;
		  } else {
		    $scope.showLogin = true;
		  }
	});
	
	$('#login').click(function() {
		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
		    	console.log("Login Failed!", error);
			} else {
			  	$scope.showLogin = false;
			  	$scope.$digest();
			    console.log("Authenticated successfully with payload:", authData);
			    var scope = angular.element($("body")).scope();
	    		scope.$apply(function() {
	    			scope.userName = authData.facebook.displayName;
	    			if (authData.facebook.email == false)
	    				scope.userEmail = "uwdisqus@gmail.com";
	    			else
	    				scope.userEmail = authData.facebook.email;
				})
			}
		}, {
			remember: "sessionOnly",
			scope: "email"
		});	
	})

	$('#logout').click(function() {
		ref.unauth();
		$scope.showLogin = true;
		$scope.$digest();
		window.location.reload(true);
	})
})

.controller('ModeratorController', function($scope, $firebaseArray) {
	ref = new Firebase("https://gameruw.firebaseio.com/");
	var forums = $firebaseArray(ref);
	
	forums.$loaded().then(function (response) {
		var general = response.$getRecord("gamergroupgeneral");
		var blog = response.$getRecord("gamergroupblog");
		$scope.forums = [general, blog];
	})

	// var ref = new Firebase("https://gameruw.firebaseio.com/");
	// var forum = $firebaseArray(ref.child(forumName));
	// forum.$loaded().then(function (response) { 
	// 	$scope.first = forum.$getRecord(THREAD_ID);
	// 	replies = $scope.first.replies;
	// 	replies++;

	// var threadRef = new Firebase('https://gameruw.firebaseio.com/' + forumName + '/' + id);

	// threadRef.update({ featured });
})

// loads after page is done loading
$(function() {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";

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
})