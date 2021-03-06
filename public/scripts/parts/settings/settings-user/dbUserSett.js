var dbUserSett = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();

  var firebaseRef = firebase.database().ref('users-location');
  var geoFire = new geofire.GeoFire(firebaseRef);

  function getTheUid() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user.uid);
        }
      });
    });
  }

  function saveUserMainInfo(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('users').doc(uid).update({
          "profile.name": obj.name,
          "profile.surname": obj.surname,
          "profile.contact_email": obj.contact_email,
          "profile.phone": obj.phone,
        })
        .then(() => {
          resolve();
        })
      var user = firebase.auth().currentUser;
      user.updateProfile({  displayName: obj.name + ' ' + obj.surname });
    })
  }

  function getUserProfileData(uid) {
    return new Promise((resolve, reject) => {
      database.collection('users').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        });
    })
  }

  //return image url 
  function uploadUserImage(uid, image) {
    return new Promise((resolve, reject) => {
      storage.ref('profileImage/' + uid).put(image)
        .then((snapshot) => {
          resolve(snapshot.ref.getDownloadURL());
        }).catch((e) => {
          console.log(e);
          reject();
        })
    })
  }

  function saveUserImageUrl(uid, url) {
    return new Promise((resolve) => {
      database.collection('users').doc(uid).update({
        "profile.prof_img_url": url
      })
      var user = firebase.auth().currentUser;
      user.updateProfile({  photoURL: url })
        .then(function() { 
          resolve();
        });
    })
  }

  function getUserProfileData(uid) {
    return new Promise((resolve, reject) => {
      database.collection('users').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        });
    })
  }

  function saveUserDescInfo(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('users').doc(uid).update({
          "profile.birth_date": obj.birth_date,
          "profile.location.address": obj.location.address,
          "profile.location.region": obj.location.region,
          "profile.location.lat": obj.location.lat,
          "profile.location.lng": obj.location.lng,
        })
        .then(() => {
          saveGeoLocation(uid, obj.location.lat, obj.location.lng)
            .then(resolve());
        });
    })
  }

  function saveGeoLocation(uid, lat, lng) {
    return new Promise((resolve, reject) => {
      geoFire.set(uid, [lat * 1, lng * 1]).then(function() {
        resolve();
      }, function(error) {
        console.log("Error: " + error);
        reject();
      });
    });
  }

  function setVerifiedPhone(uid) {
    return new Promise((resolve, reject) => {
      database.collection('registered_accounts').doc(uid).update({
          "phoneVerified": 1
        })
        .then(() => {
          resolve();
        })
    })
  }

  function checkIfPhoneIsVerified(uid) {
    return new Promise((resolve, reject) => {
      database.collection('registered_accounts').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data.phoneVerified);
        });
    })
  }



  return {
    getTheUid: getTheUid,
    saveUserMainInfo: saveUserMainInfo,
    getUserProfileData: getUserProfileData,
    uploadUserImage: uploadUserImage,
    saveUserImageUrl: saveUserImageUrl,
    saveUserDescInfo: saveUserDescInfo,
    setVerifiedPhone: setVerifiedPhone,
    checkIfPhoneIsVerified: checkIfPhoneIsVerified
  }

})();