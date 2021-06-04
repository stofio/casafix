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

  function saveProfMainInfo(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).update({
          "profile.name": obj.name,
          "profile.surname": obj.surname,
          "profile.contact_email": obj.contact_email,
          "profile.phone": obj.phone,
          "profile.location.address": obj.location.address,
          "profile.location.region": obj.location.region,
          "profile.location.lat": obj.location.lat,
          "profile.location.lng": obj.location.lng,
        })
        .then(() => {
          resolve();
        })
    })
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

  function saveProfDescInfo(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).update({
        "profile.birth_date": obj.birth_date,
        "profile.description": obj.description,
      }).then(() => {
        resolve();
      })
    })
  }

  //return image url
  function uploadProfImage(uid, image) {
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

  function saveProfImageUrl(uid, url) {
    return new Promise((resolve) => {
      database.collection('professionals').doc(uid).update({
        "profile.prof_img_url": url
      }).then(() => {
        resolve();
      })
    })
  }

  function saveProfession(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).update({
        professions: obj
      }).then(() => {
        resolve();
      })
    })
  }


  return {
    getTheUid: getTheUid,
    saveProfMainInfo: saveProfMainInfo,
    getProfProfileData: getProfProfileData,
    saveProfDescInfo: saveProfDescInfo,
    uploadProfImage: uploadProfImage,
    saveProfImageUrl: saveProfImageUrl,
    saveProfession: saveProfession
  }

})();