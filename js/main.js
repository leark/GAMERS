var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'/',
		templateUrl: 'templates/home.html',
		controller: 'HomeController',
	})
	// Configure states for "content" and "about"

	.state('newPost', {
		url: '/newPost',
		templateUrl: 'templates/newPost.html',
		controller: 'NewPostController',
	})
}) 

.controller('HomeController', function($scope){
})

.controller('NewPostController', function($scope){
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

