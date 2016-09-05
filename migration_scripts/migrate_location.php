<?php
// Expand memory being used by PHP
ini_set('memory_limit','400M');
// server should keep session data for AT LEAST 1 hour
ini_set('session.gc_maxlifetime', 3600);
// each client should remember their session id for EXACTLY 1 hour
session_set_cookie_params(3600);
session_start();
$now = time();
// echo "discard after: $now<br>";
if (isset($_SESSION['discard_after']) && $now > $_SESSION['discard_after']) {
    // this session has worn out its welcome; kill it and start a brand new one
    session_unset();
    session_destroy();
    session_start();
}
// either new or old, it should live at most for another hour
$_SESSION['discard_after'] = $now + 3600;
// echo "<pre>top of script\n"; print_r($_SESSION);

// Configuration

date_default_timezone_set('America/New_York'); 

if (!file_exists('credentials.inc.php')) {
   echo "My credentials are missing!";
   exit;
}

// Include credentials
require 'credentials.inc.php';
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$string = file_get_contents("flatfile/flatfile_new.json");
$profile_json = json_decode($string, true);

foreach ($profile_json['results'] as $record){
  echo org_location_update($conn, $record);
}
echo "<br>...succeed";


function org_location_update($conn, $record){
  if ($record["row_type"] != "org_profile") {
    return;
  }

  if ($record["org_hq_city"] == null) {
    return;
  }

  $element = array();

   // unique city check
  $sql = "SELECT * FROM org_locations WHERE org_hq_city ='" .
        $record['org_hq_city'] . "' AND org_hq_st_prov='" . 
        $record['org_hq_st_prov'] ."'";

  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
      return;
  }

  // country id
  $sql = "SELECT country_id FROM org_country_info WHERE ISO2 ='  " .
        $record['org_hq_country_locode'] . " '";
  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['country_id'] = $row['country_id'];
  } else {
      echo "<br>  No Country ID for this...";
  }
  

  $element["org_hq_city"] = isset($record["org_hq_city"]) ? mysql_real_escape_string($record["org_hq_city"]) : null;
  $element["org_hq_st_prov"] = isset($record["org_hq_st_prov"])? mysql_real_escape_string($record["org_hq_st_prov"]) : null;
  $element["latitude"] = isset($record["latitude"])? floatval($record["latitude"]) : null;
  $element["longitude"] = isset($record["longitude"])? floatval($record["longitude"]) : null;

  $query = "INSERT INTO org_locations 
  (org_hq_city, 
    org_hq_st_prov,
    country_id,
    latitude,
    longitude) 
  VALUES (
    '" . $element["org_hq_city"] . "', 
    '" . $element["org_hq_st_prov"] . "',
    '" .$element["country_id"]. "',
    '" .$element["latitude"] . "',
    '" .$element["longitude"] . "')";

  $result = mysqli_query($conn, $query);

  if($result){
      return;
  } else{
      echo "<br>";
      echo $query;
      print_r($conn);
      return ("<br>Failed on " . $record['org_name']);
  }

}

?>