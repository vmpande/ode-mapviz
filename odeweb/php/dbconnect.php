<?php
$host = 'localhost:3306';
$username = 'root';
$password = '1892kop';
$database = 'opendata_db';

    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

/*$myquery = "SELECT  `lat`, `lng`, `l_count` FROM  `locations` WHERE `lat` <> 0";  
*/
$myquery = "SELECT  * FROM  `temp`";  

    $query = mysql_query($myquery);


    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();

    while($row =mysql_fetch_assoc($query))
    {
        $data[] = $row;
    }
 
  echo json_encode($data);

 echo "var testdata = [";
    
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
        echo "[",$data[$x]['lat'],",",$data[$x]['lng'],"]";
        if ($x <= (mysql_num_rows($query)-2) ) {
      echo ",";
    }
    }

      echo "];";
     

    mysql_close($server);
?>
