<?php
	$PUBLIC_KEY = "zFYDrRp7UkXfhX3xWuGaLQfi2T0hBjUeJLAszIKIC0RObnKclNc1yPkDGslOotqB";
	$SECRET_KEY = "pn6sboBzfjR73EczCcJuRizm4QGbrB7WJFdykUF1XeNksXqH1Dmp1esoz4LY1rmn";
	// Get the code for request access
	$CODE = $_GET['code'];

// Request the access token
extract($_POST);
$authorize = "authorization_code";
$redirect = "http://localhost:8080/";
$url = 'https://disqus.com/api/oauth/2.0/access_token/?';
$fields = array(
	'grant_type'=>urlencode($authorize),
	'client_id'=>urlencode($PUBLIC_KEY),
	'client_secret'=>urlencode($SECRET_KEY),
	'redirect_uri'=>urlencode($redirect),
	'code'=>urlencode($CODE)
);
//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, "&");
//open connection
$ch = curl_init();
//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
//execute post
$result = curl_exec($ch);
//close connection
curl_close($ch);
?>