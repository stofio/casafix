var dbProfSett = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();

  var firebaseRef = firebase.database().ref('professionals-location');
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
          _checkIfProfileCanBeListed(uid)
            .then(() => {
              saveGeoLocation(uid, obj.location.lat, obj.location.lng)
                .then(resolve());
            });
        })
      var user = firebase.auth().currentUser;
      user.updateProfile({  displayName: obj.name + ' ' + obj.surname });
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
      }) 
      var user = firebase.auth().currentUser;
      user.updateProfile({  photoURL: url })
        .then(function() { 
          resolve();
        });
    })
  }

  function saveProfession(uid, obj) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).update({
        professions: obj
      }).then(() => {
        _checkIfProfileCanBeListed(uid)
          .then(resolve());
      })
    })
  }


  //return image url
  function uploadWorkImg(uid, image) {
    return new Promise((resolve, reject) => {
      storage.ref('users/' + uid + '/images/portfolio/' + uuidv4()).put(image)
        .then((snapshot) => {
          resolve(snapshot.ref.getDownloadURL());
        }).catch((e) => {
          console.log(e);
          reject();
        })
    })
  }

  function saveWorkImageDb(uid, url, title) {
    return new Promise((resolve) => {
      database.collection('professionals').doc(uid).collection('portfolio').add({
        "img_url": url,
        "img_title": title,
        "created": $.now()
      }).then((snapshot) => {
        resolve(snapshot.id);
      })
    })
  }

  function getPortfolioData(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).collection('portfolio').orderBy('created', "asc").get()
        .then((querySnapshot) => {
          // querySnapshot.forEach(doc => {
          //   console.log(doc.id, " => ", doc.data());
          // });
          // const data = doc.data();
          resolve(querySnapshot);
        });
    })
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function deleteImage(imgUrl) {
    return new Promise((resolve, reject) => {
      storage.refFromURL(imgUrl).delete()
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          console.log('Deleting image by url error: ' + error);
        });
    });
  }

  function deleteImgId(imgId, uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).collection('portfolio').doc(imgId).delete()
        .then((snapshot) => {
          resolve();
        })
        .catch(e => {
          console.log('Deleting portfolio document error: ' + e);
        });
    });
  }

  function modifyTitlePortImg(uid, imgId, newTitle) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).collection('portfolio').doc(imgId).update({
        img_title: newTitle
      }).then(() => {
        resolve();
      })
    })
  }

  /**
   * Check if profile is eligible to be listed in search then set
   */
  function _checkIfProfileCanBeListed(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).get()
        .then(doc => {
          var prof = doc.data();
          if (prof.professions !== undefined) {
            if (prof.professions.length) {
              if (prof.professions.length == 0) {
                _setProfileCompleted(uid, 0)
                  .then(resolve());
              }
            } else if (prof.profile.name == '' || prof.profile.surname == '') {
              _setProfileCompleted(uid, 0)
                .then(resolve());
            } else if (prof.profile.location.address == '') {
              _setProfileCompleted(uid, 0)
                .then(resolve());
            } else {
              _setProfileCompleted(uid, 1)
                .then(resolve());
            }
          } else {
            resolve();
          }
        })
    })
  }

  /**
   * Set if profile is eligible to be listed in search
   */
  function _setProfileCompleted(uid, completed) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).update({
        "_profile_completed": completed
      }).then(() => {
        resolve();
      })
    })
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
    saveProfMainInfo: saveProfMainInfo,
    getProfProfileData: getProfProfileData,
    saveProfDescInfo: saveProfDescInfo,
    uploadProfImage: uploadProfImage,
    saveProfImageUrl: saveProfImageUrl,
    saveProfession: saveProfession,
    uploadWorkImg: uploadWorkImg,
    saveWorkImageDb: saveWorkImageDb,
    getPortfolioData: getPortfolioData,
    deleteImage: deleteImage,
    deleteImgId: deleteImgId,
    modifyTitlePortImg: modifyTitlePortImg,
    setVerifiedPhone: setVerifiedPhone,
    checkIfPhoneIsVerified: checkIfPhoneIsVerified
  }

})();