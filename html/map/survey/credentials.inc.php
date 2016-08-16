<?php

# AWS
define(AWS_KEY, 	'xxxxxxxxxxxxxx'); # $aws_key
define(AWS_SECRET,  'uxxxxxxxxxxxxx'); # $aws_secret

// twilio
define(ACCOUNTSID, 'Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define(AUTHTOKEN,  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// PARSE credentials TEST
define("PARSE_APPLICATION_ID", "ZCESUvcimp7wb77lZNQz7lhknH6cdBNfGcUK7Ncn" );
define("PARSE_API_KEY", "FCZvUcYCZW34CyNkxcsHMTXevli4ji4HGjrWvQdr" );

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
function connect_db() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="Sep@2015";
	$dbname="opendata_db";
	$dbh = "";
	try
	{
		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		echo "Connection failed: " . $e->getMessage();
	}
	return $dbh;
}

?>