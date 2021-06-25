<?php
session_start();
//
$_SESSION["profession"] = "Elettricista";
$_SESSION["services"] = ["imballaggio"];
$_SESSION["place"] = "placee";
$_SESSION["region"] = "regionnn";
$_SESSION["lat"] = "lattt";
$_SESSION["lng"] = "lngg";
$_SESSION["sort"] = "sorttt";

echo 'set';

echo $_SESSION["profession"];

?>