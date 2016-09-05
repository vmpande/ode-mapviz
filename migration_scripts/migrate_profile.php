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
  echo org_profile_update($conn, $record);
}


// flatfile_update_db("org_hq_country_locode", "defined", 7);

/* For "org_profile" table, use_... fields */
function org_profile_update($conn, $record){
  if ($record["row_type"] != "org_profile") {
    return;
  }

  $element = array();

  // created at
  $et = new DateTimeZone('America/New_York');
  $createAt = new DateTime($record["createdAt"], $et);

  // country id
  $sql = "SELECT country_id FROM org_country_info WHERE ISO2 ='  " .
        $record['org_hq_country_locode'] . " '";
  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['country_id'] = $row['country_id'];
  } else {
      echo "...No Country ID for this...";
  }

  // location id
  $sql = "SELECT location_id FROM org_locations WHERE org_hq_city ='" .
        $record['org_hq_city'] . "' AND org_hq_st_prov='" . 
        $record['org_hq_st_prov'] ."'";

  $result = mysqli_query($conn, $sql);
  
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $element['location_id'] = $row['location_id'];
  } else {
      echo "...No Location ID for this...";
  }
  
  $element["parse_profile_id"] = isset($record["profile_id"]) ? strval($record["profile_id"]) : null;
  $element["industry_id"] = isset($record["industry_id"]) ? $record["industry_id"] : null;
  $element["industry_other"] = isset($record["industry_other"]) ? $record["industry_other"] : null;
  $element["org_confidence"] = isset($record["org_confidence"])? $record["org_confidence"] : null;
  $element["no_org_url"] = isset($record["no_org_url"])? intval($record["no_org_url"]) : null;
  $element["org_additional"] = isset($record["org_additional"])? mysql_real_escape_string($record["org_additional"]) : null;
  $element["org_description"] = isset($record["org_description"]) ? mysql_real_escape_string($record["org_description"]) : null;
  $element["org_greatest_impact"] = isset($record["org_greatest_impact"])? $record["org_greatest_impact"] : null;
  $element["org_greatest_impact_detail"] = isset($record["org_greatest_impact_detail"]) ? mysql_real_escape_string($record["org_greatest_impact_detail"]) : null;
  $element["org_name"] = $record["org_name"] ? mysql_real_escape_string($record["org_name"]) : null;
  $element["org_size"] = $record["org_size_id"] ? $record["org_size_id"] : null;
  $element["org_profile_category"] = $record["org_profile_category"] ? $record["org_profile_category"] : null;
  $element["org_profile_src"] = $record["org_profile_src"]? mysql_real_escape_string($record["org_profile_src"]) : null;
  $element["org_profile_status"] = $record["org_profile_status"]? $record["org_profile_status"] : null;
  $element["org_profile_year"] = intval($record["org_profile_year"])? intval($record["org_profile_year"]) : null;
  $element["org_type"] = $record["org_type"]? $record["org_type"] : null;
  $element["org_type_other"] = $record["org_type_other"]? $record["org_type_other"] : null;
  $element["org_url"] = $record["org_url"]? $record["org_url"] : null;
  $element["org_year_founded"] = intval($record["org_year_founded"]) ? intval($record["org_year_founded"]) : $element["org_profile_year"];
  $element["createdAt"] = $createAt->format('Y-m-d H:i:s');
  $element["machine_read"] = isset($record["machine_read"]) ? $record["machine_read"] : null;

  $query = "INSERT INTO org_profiles 
  (parse_profile_id, 
    country_id,
    industry_id,
    industry_other,
    location_id,
    org_confidence,
    no_org_url,
    org_additional,
    org_description,
    org_greatest_impact,
    org_greatest_impact_detail,
    org_name,
    org_size,
    org_profile_category,
    org_profile_src,
    org_profile_status,
    org_profile_year,
    org_type,
    org_type_other,
    org_url,
    org_year_founded,
    createdAt,
    machine_read) 
  VALUES (
    '" . $element["parse_profile_id"] . "', 
    '" . $element["country_id"] . "',
    '" .$element["industry_id"]. "',
    '" .$element["industry_other"]. "',
    '" .$element["location_id"]. "',
    '" .$element["org_confidence"]. "',
    '" .$element["no_org_url"]. "',
    '" .$element["org_additional"]. "',
    '" .$element["org_description"]. "',
    '" .$element["org_greatest_impact"]. "',
    '" .$element["org_greatest_impact_detail"]. "',
    '" .$element["org_name"]. "',
    '" .$element["org_size"]. "',
    '" .$element["org_profile_category"]. "',
    '" .$element["org_profile_src"]. "',
    '" .$element["org_profile_status"]. "',
    '" .$element["org_profile_year"]. "',
    '" .$element["org_type"]. "',
    '" .$element["org_type_other"]. "',
    '" .$element["org_url"] . "',
    '" .$element["org_year_founded"] . "',
    '" .$element["createdAt"] . "', 
    '" .$element["machine_read"] . "')";

  $result = mysqli_query($conn, $query);

  if($result){
      return ("<br>Succeed in putting " . $record['org_name']);
  } else{
      echo "<br>";
      echo $query;
      print_r($conn);
      return ("<br>Failed on " . $record['org_name']);
  }

}

?>