var myApp = angular.module('myApp', ['ui.router']);
var ref;

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'',
		templateUrl: 'templates/forum/home.html',
		controller: 'HomeController',
	})

	.state('newPost', {
		url: '/newPost',
		templateUrl: 'templates/forum/newPost.html',
		controller: 'NewPostController',	
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
}) 

.controller('HomeController', function($scope){})

.controller('NewPostController', function($scope){})

.controller('IrcController', function($scope){
})

.controller('ThreadController', function($scope, $http, $stateParams) {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	var DISQUS_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
	var FORUM_NAME = "youtatest1";

	var THREAD_ID = $stateParams.threadId;

	$scope.name = "stuff";
	$scope.posts = {};

	console.log(THREAD_ID);
	
	//example urls:
	// http://localhost:8080/#/thread/4367055812
	// http://localhost:8080/#/thread/4367336827

	$http.get('https://disqus.com/api/3.0/threads/listPosts.json', {
		params: {
			access_token: ACCESS_TOKEN,
			api_key: API_KEY,
			thread: THREAD_ID,
			order: 'asc' }
	}).success(function(response) {
		var data = response.response;
		console.log(data);
		for (var i =0; i < data.length; i++) {
	    	data[i].createdAt = Date.parse(data[i].createdAt);
	    }
		$scope.posts = data;
	});

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
				author_name: "sherry",
				author_email: "shgao1011@gmail.com"
			}
		}).success(function() {
			document.location.reload(true);
		})
	}
})

.controller('myController', function($scope) {

	$scope.forums = {};
	$scope.showLogin = true;
	$('#login').click(function() {
		ref = new Firebase("https://gameruw.firebaseio.com");
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
				})
			}
		});	
	})

	$('#logout').click(function() {
		ref.unauth();
		$scope.showLogin = true;
		$scope.$digest();
	})
})

// loads after page is done loading
$(function() {
	var ACCESS_TOKEN = "d1a4145e953c4c4e9f0ee0c61c202486";
	var API_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";

	$.get("https://disqus.com/api/3.0/users/listForums.json", {
		access_token: ACCESS_TOKEN,
		api_key: API_KEY,
		user: "185257554",
		order: "asc"
	}, function(response) {
		data = response.response;
		console.log(data);
		getForums(data);
	})

	var getForums = function(data) {
		var number = 1;
		for (var i = 0; i < data.length; i++) {
			var name = data[i].name;	
			$.get("https://disqus.com/api/3.0/forums/listThreads.json", {
				access_token: ACCESS_TOKEN,
				api_key: API_KEY,
				forum: name
			}, function(response) {
				dat = response.response;
				getThreads(dat, "threads" + number);
				number++;
			})
		}
	}

	var getThreads = function(data, num) {
		var scope = angular.element($("body")).scope();
    	scope.$apply(function() {
    		scope[num] = data;
		})
	}

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