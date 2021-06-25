<?php
// Start the session
session_start();

$dataFilter =  new stdClass();


$_SESSION["obj"] = {
    "profession": "Elettricista",
    "services": ["imballaggio"],
    "location": {
      "place": '',
      "region": 'provincia di Verona',
      "lat": 0,
      "lng": 0
    },
    "sort": 'new',
};




print_r($_SESSION);



?>