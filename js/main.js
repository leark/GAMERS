var myApp = angular.module('myApp', ['ui.router', 'firebase']);
var ref;

myApp.config(function($stateProvider) {

  // Prevent $urlRouter from automatically intercepting URL changes;
  // this allows you to configure custom behavior in between
  // location changes and route synchronization:

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

.controller('GeneralController', function($scope){})

.controller('BlogsController', function($scope){})

.controller('featuredContentController', function($scope){})

.controller('ThreadController', function($scope, $http, $stateParams, $firebaseArray) {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	var DISQUS_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
	
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

	//example urls:
	// http://localhost:8080/#/thread/4367055812
	// http://localhost:8080/#/thread/4367336827

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

		$http({
			url: "https://disqus.com/api/3.0/posts/create.json",
			method: "POST",
			params: {
				api_key: DISQUS_KEY,
				message: post,
				thread: id,
				author_name: $scope.userName,
				author_email: $scope.userEmail
			}
		}).success(function() {
			$scope.getPosts;

			var threadRef = new Firebase('https://gameruw.firebaseio.com/' + forumName + '/' + id);

			threadRef.update({ replies: replies, recent: Firebase.ServerValue.TIMESTAMP });

			setTimeout(function(){
			    window.location.reload(true);
			}, 800);
		})
	}
})

.controller('myController', function($scope, $firebaseArray) {
	$scope.forums = {};
	$scope.showLogin = true;

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
		//ref = new Firebase("https://gameruw.firebaseio.com");
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
})

// loads after page is done loading
$(function() {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";


	// $.get("https://disqus.com/api/3.0/users/listForums.json", {
	// 	access_token: ACCESS_TOKEN,
	// 	api_key: API_KEY,
	// 	user: "185257554",
	// 	order: "asc"
	// }, function(response) {
	// 	data = response.response;
	// 	getForums(data);
	// })

	// var getForums = function(data) {
	// 	var number = 1;
	// 	for (var i = 0; i < data.length; i++) {
	// 		var name = data[i].name;	
	// 		$.get("https://disqus.com/api/3.0/forums/listThreads.json", {
	// 			access_token: ACCESS_TOKEN,
	// 			api_key: API_KEY,
	// 			forum: name
	// 		}, function(response) {
	// 			dat = response.response;
	// 			console.log("forum response");
	// 			console.log(dat);
	// 			getThreads(dat, "threads" + number);
	// 			number++;
	// 		})
	// 	}
	// }

	// var getThreads = function(data, num) {
	// 	var scope = angular.element($("body")).scope();
 //    	scope.$apply(function() {
	// 		for (var i =0; i < data.length; i++) {
	// 	    	data[i].createdAt = Date.parse(data[i].createdAt);
	// 	    }
 //    		scope[num] = data;
	// 	})
	// }

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