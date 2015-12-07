var myApp = angular.module('myApp', ['ui.router']);

.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'/',
		templateUrl: 'templates/home.html',
		controller: 'HomeController',
	})
	// Configure states for "content" and "about"
	.state('forum', {
		url:'/forum',
		templateUrl: 'templates/forum.html',
		controller: 'ForumController',
	})

	.state('calendar', {
		url:'/calendar',
		templateUrl: 'templates/calendar.html',
		controller: 'CalendarController',
	})
})

.controller('HomeController', function($scope){
})

.controller('ForumController', function($scope){
})

.controller('CalendarController', function($scope){
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
