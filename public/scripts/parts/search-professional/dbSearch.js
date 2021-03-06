var dbSearch = (function() {

  var database = firebase.firestore();

  var firebaseRef = firebase.database().ref('professionals-location');
  var geoFire = new geofire.GeoFire(firebaseRef);

  function size() {
    database.collection('professionals').get().then(snap => {
      var size = snap.size // will return the collection size
      console.log(size)
    });
  }

  function getTheUid() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user.uid);
        }
      });
    });
  }


  function getProfProfileData(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        });
    })
  }

  function getFilteredProfessionals(dataFil) {
    return new Promise((resolve, reject) => {
      var range = dataFil.range;
      if (dataFilter.location.place == 'Italia') range = 100000;
      loadProfInRange([dataFil.location.lat, dataFil.location.lng], range)
        .then(geoProfs => {
          if (geoProfs == null) {
            resolve([])
            return;
          }
          let uidsInRange = geoProfs.map(prof => prof.key);
          var ref = database.collection('professionals').where("_profile_completed", "==", 1);
          var ref = database.collection('professionals').where(firebase.firestore.FieldPath.documentId(), "in", uidsInRange);


          if (dataFil.profession !== null) {
            if (dataFil.profession.length !== 0) {
              if (dataFil.services.length == 0) {
                //filter profession only
                ref = ref.where("professions.arrayProfessions", "array-contains", dataFil.profession);
              } else {
                //filter services
                $.each(dataFil.services, (i, serv) => {
                  ref = ref.where("professions.selectedServices." + serv, "==", true);
                })
              }
            }
          }


          ref.get()
            .then((snapshot) => {
              var profsArr = snapshot.docs.map(doc => {
                return {...doc.data(), uid: doc.id }
              });

              //set the distance
              var profsWithDistance = [];
              $.each(profsArr, (i, prof) => {
                $.each(geoProfs, (g, geoProf) => {
                  if (prof.uid == geoProf.key) {
                    profsWithDistance.push({...prof, distance: geoProf.distance });
                  }
                });
              })

              resolve(profsWithDistance);
            })
            .catch(e => {
              reject(e);
            });
        })
    })
  }


  function loadProfInRange(arrCenter, range) {
    return new Promise((resolve, reject) => {
      var circle = geoFire.query({
        center: arrCenter,
        radius: range
      });

      console.log(circle)

      var keysEntered = false;
      var arrayOfProfInRange = [];
      circle.on("key_entered", function(key, location, distance) {
        keysEntered = true;
        arrayOfProfInRange.push({
          key: key,
          location: location,
          distance: distance
        });
        resolve(arrayOfProfInRange)
      })
      circle.on("ready", function() {
        if (!keysEntered) {
          resolve(null);
        }
      });
    })
  }






  return {
    getTheUid: getTheUid,
    getProfProfileData: getProfProfileData,
    getFilteredProfessionals: getFilteredProfessionals,
    size: size
  }

})();