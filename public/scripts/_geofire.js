var firebaseRef = firebase.database().ref('professionals-location');
var geoFire = new geofire.GeoFire(firebaseRef);

// geoFire.set("asdfljh234w;lkihd;lkj", [37.785326, -122.405696]).then(function() {
//   console.log("Provided key has been added to GeoFire");
// }, function(error) {
//   console.log("Error: " + error);
// });





var geoQuery = geoFire.query({
  center: [45.44889263992208, 10.985060246607718],
  radius: 10000.5
});

var arrayOfProfInRange = [];
geoQuery.on("key_entered", function(key, location, distance) {
  arrayOfProfInRange.push({
    key: key,
    location: location,
    distance: distance
  });
})

//console.log(arrayOfProfInRange)