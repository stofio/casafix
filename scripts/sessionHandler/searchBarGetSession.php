<?php
session_start();
//here retrieve the session, destroy session and send back

$o = array(
    "profession" => $_SESSION["profession"],
    "services" => $_SESSION["services"],
    "place" => $_SESSION["place"],
    "region" => $_SESSION["region"],
    "lat" => $_SESSION["lat"],
    "lng" => $_SESSION["lng"],
    "sort" => $_SESSION["sort"]
);


$JSON = json_encode($o);

// session_unset();
// session_destroy();

echo $JSON;

?>