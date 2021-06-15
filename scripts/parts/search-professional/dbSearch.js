var dbSearch = (function() {

  var database = firebase.firestore();


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
    console.log(dataFil.services);
    return new Promise((resolve, reject) => {
      var ref = database.collection('professionals').where("_profile_completed", "==", 1);


      if (dataFil.profession.length !== 0) {
        if (dataFil.services.length == 0) {
          //filter profession only
          var ref = ref.where("professions.arrayProfessions", "array-contains", dataFil.profession);
        } else {
          //filter services
          var ref = ref.where("professions.arrayServices", "array-contains-any", dataFil.services);
        }
      }

      if (dataFil.location.place !== "") {
        //filter location
        var ref = ref.where("professions.arrayProfessions", "==", dataFil.location.region);
      }

      ref.get()
        .then((snapshot) => {
          var profsArr = snapshot.docs.map(doc => {
            return {...doc.data(), uid: doc.id }
          });
          //console.log(snapshot.docs.map(doc => doc.id));
          resolve(profsArr);
        })
        .catch(e => {
          reject(e);
        });
    })
  }





  return {
    getTheUid: getTheUid,
    getProfProfileData: getProfProfileData,
    getFilteredProfessionals: getFilteredProfessionals,
  }

})();