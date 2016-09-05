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
  echo org_data_use_update($conn, $record);
}
echo "succeed";


function org_data_use_update($conn, $record){
  if ($record["row_type"] != "data_use") {
    return;
  }

  $element = array();

  // country id
  $sql = "SELECT country_id FROM org_country_info WHERE ISO2 ='  " .
        $record['org_hq_country_locode'] . " '";
  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['src_country_id'] = $row['country_id'];
  } else {
      echo "<br>  No Country ID for this...";
  }

  // profile ID
  $sql = "SELECT profile_id FROM org_profiles WHERE parse_profile_id ='" .
        $record['profile_id'] . "'";
  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['profile_id'] = $row['profile_id'];
  } else {
      echo "<br>  No Profile ID for this...";
  }  

  $element["data_type"] = isset($record["data_type"]) ? $record["data_type"] : null;
  $element["data_use_type_other"] = isset($record["data_use_type_other"]) ? mysql_real_escape_string($record["data_use_type_other"]) : null;
  $element["data_src_gov_level"] = isset($record["data_src_gov_level"])? $record["data_src_gov_level"] : null;
  $element["machine_read"] = isset($record["machine_read"])? strval($record["machine_read"]) : null;
  $element["parse_profile_id"] = isset($record["profile_id"])? strval($record["profile_id"]) : null;
  


  $query = "INSERT INTO org_data_use 
  (data_type, 
    data_use_type_other,
    data_src_gov_level,
    profile_id,
    src_country_id,
    machine_read,
    parse_profile_id) 
  VALUES (
    '" . $element["data_type"] . "', 
    '" . $element["data_use_type_other"] . "',
    '" .$element["data_src_gov_level"]. "',
    '" .$element["profile_id"]. "',
    '" .$element["src_country_id"] . "',
    '" .$element["machine_read"] ."',
    '" .$element["parse_profile_id"] . "')";

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