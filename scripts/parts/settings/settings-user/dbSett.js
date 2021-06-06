var dbSett = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();

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
      }).then(() => {
        resolve();
      })
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
      }).then(() => {
        resolve();
      })
    })
  }



  return {
    getTheUid: getTheUid,
    saveUserMainInfo: saveUserMainInfo,
    getUserProfileData: getUserProfileData,
    uploadUserImage: uploadUserImage,
    saveUserImageUrl: saveUserImageUrl,
    saveUserDescInfo: saveUserDescInfo
  }

})();