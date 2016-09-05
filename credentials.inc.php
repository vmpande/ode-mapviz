<?php

# AWS
define(AWS_KEY, 	'xxxxxxxxxxxxxx'); # $aws_key
define(AWS_SECRET,  'uxxxxxxxxxxxxx'); # $aws_secret

// twilio
define(ACCOUNTSID, 'Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define(AUTHTOKEN,  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// PARSE credentials PROD
// define("PARSE_APPLICATION_ID", "you_application_id" );
// define("PARSE_API_KEY", "your_rest_api_key" );

// ArcGIS
define(ArcGIS_CLIENT_ID, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define(ArcGIS_CLIENT_SECRET,  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// MailGun
define("MAILGUN_SERVER", 'sandboxc1675fc5cc30472ca9bd4af8028cbcdf.mailgun.org');
define("MAILGUN_APIKEY", 'key-c70b616d5e81bc982452d41aca27c9b3');

//cred test for db
define (DB_HOST, "localhost");
define (DB_USER, "root");
define (DB_PASS, "root");
define (DB_NAME, "opendata_db");
// function connect_db() {
// 	$dbhost="localhost";
// 	$dbuser="root";
// 	$dbpass="root";
// 	$dbname="opendata_db";
// 	$dbh = "";
// 	try
// 	{
// 		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
// 		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// 	}
// 	catch(PDOException $e)
// 	{
// 		echo "Connection failed: " . $e->getMessage();
// 	}
// 	return $dbh;
// }

?>