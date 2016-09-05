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

$string = file_get_contents("flatfile/org_contact.json");
$profile_json = json_decode($string, true);

foreach ($profile_json['results'] as $record){
  echo org_contact_update($conn, $record);
}
echo "<br>...succeed";


function org_contact_update($conn, $record){
  $element = array();

  // profile ID
  $sql = "SELECT profile_id FROM org_profiles WHERE parse_profile_id ='" .
        $record['profile_id'] . "'";
  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['profile_id'] = $row['profile_id'];
  } else {
      echo "<br>  No Profile ID for this...";
      return;
  }  
  

  $element["survey_contact_email"] = isset($record["survey_contact_email"]) ? strval($record["survey_contact_email"]) : null;
  $element["survey_contact_first"] = isset($record["survey_contact_first"]) ? mysql_real_escape_string($record["survey_contact_first"]) : null;
  $element["survey_contact_last"] = isset($record["survey_contact_last"]) ? mysql_real_escape_string($record["survey_contact_last"]) : null;
  $element["survey_contact_phone"] = isset($record["survey_contact_phone"]) ? mysql_real_escape_string($record["survey_contact_phone"]) : null;
  $element["survey_contact_title"] = isset($record["survey_contact_title"]) ? mysql_real_escape_string($record["survey_contact_title"]) : null;
  
  $query = "INSERT INTO org_contacts 
  (survey_contact_email,
    survey_contact_first, 
    survey_contact_last,
    survey_contact_phone,
    survey_contact_title,
    profile_id) 
  VALUES (
    '" . $element["survey_contact_email"] . "', 
    '" . $element["survey_contact_first"] . "', 
    '" . $element["survey_contact_last"] . "',
    '" .$element["survey_contact_phone"]. "',
    '" .$element["survey_contact_title"] . "',
    '" .$element["profile_id"] . "')";

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