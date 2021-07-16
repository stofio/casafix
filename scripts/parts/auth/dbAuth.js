var dbAuth = (function() {

  var database = firebase.firestore();

  //create new PROFESSIONAL in db
  function createNewProfe(uid, email, provider, photoUrl, callback) {
    database.collection('professionals').doc(uid).set({
      _is_professional: 1,
      _email: email,
      created: $.now(),
      reviews: 0,
      stars: 0,
      profile: {
        contact_email: email,
        prof_img_url: photoUrl,
      }
    }).then(() => {
      saveUserRoleAndProvider(uid, 'professionals', email, provider, () => {
        if (typeof(callback) == 'function') {
          callback();
        }
      })
    }).catch((error) => {
      console.log("create prof, error: " + error);
    })
  }

  //create new USER in db
  function createNewUser(uid, email, provider, photoUrl, callback) {
    database.collection('users').doc(uid).set({
      _is_user: 1,
      _email: email,
      created: $.now(),
      profile: {
        contact_email: email,
        prof_img_url: photoUrl,
      }
    }).then(() => {
      saveUserRoleAndProvider(uid, 'users', email, provider, () => {
        if (typeof(callback) == 'function') {
          callback();
        }
      })
    }).catch((error) => {
      console.log("create prof, error: " + error);
    })
  }



  function isProfessional(uid, callback) {
    database.collection('professionals').doc(uid).get()
      .then((doc) => {
        var isProf;
        if (!doc.exists) {
          isProf = false;
        } else {
          const data = doc.data();
          if (data._is_professional == 1) {
            isProf = true;
          } else {
            isProf = false;
          }
          if (typeof(callback) == 'function') {
            callback(isProf);
          }
        }
      });
  }

  function isUser(uid, callback) {
    database.collection('users').doc(uid).get()
      .then((doc) => {
        var isUser;
        if (!doc.exists) {
          isUser = false;
        } else {
          const data = doc.data();
          if (data._is_user == 1) {
            isUser = true;
          } else {
            isUser = false;
          }
          if (typeof(callback) == 'function') {
            callback(isUser);
          }
        }
      });
  }

  function isRegistered(uid, callback) {
    database.collection('registered_accounts').doc(uid).get()
      .then((doc) => {
        console.log(doc)
        var isReg;
        if (!doc.exists) {
          console.log('false')
          isReg = false;
        } else {
          console.log('true')
          isReg = true;
        }
        if (typeof(callback) == 'function') {
          callback(isReg);
        }
      });

  }

  /**
   * return object with 'name' and 'imgLink' 
   */
  function getUserNameAndImgProf(uid, callback) {
    database.collection('professionals').doc(uid).get()
      .then((doc) => {
        const data = doc.data();
        var name = data.profile.name;
        var imgLink = data.profile.prof_img_url;
        if (name == '' || name == null) {
          name = 'Profilo';
        }
        if (imgLink == '' || imgLink == null) {
          imgLink = '/images/placeholder-prof-img.png';
        }
        var obj = {
          name: name,
          imgLink: imgLink
        }
        if (typeof(callback) == 'function') {
          callback(obj);
        }
      });
  }

  function getUserNameAndImgUser(uid, callback) {
    database.collection('users').doc(uid).get()
      .then((doc) => {
        const data = doc.data();
        var name = data.profile.name;
        var imgLink = data.profile.prof_img_url;
        if (name == '' || name == null) {
          name = 'Profilo';
        }
        if (imgLink == '' || imgLink == null) {
          imgLink = '/images/placeholder-prof-img.png';
        }
        var obj = {
          name: name,
          imgLink: imgLink
        }
        if (typeof(callback) == 'function') {
          callback(obj);
        }
      });
  }




  function saveUserRoleAndProvider(uid, role, email, provider, callback) {
    database.collection('registered_accounts').doc(uid).set({
      _role: role,
      email: email,
      provider: provider
    }).then(() => {
      if (typeof(callback) == 'function') {
        callback();
      }
    }).catch((error) => {
      console.log("create prof, error: " + error);
    })
  }

  function isUserExistent(uid, callback) {
    database.collection('registered_accounts').doc(uid).get()
      .then((doc) => {
        var isExistent;
        if (!doc.exists) {
          isExistent = false;
        } else {
          isExistent = true;
        }
        if (typeof(callback) == 'function') {
          callback(isExistent);
        }
      })
  }



  return {
    createNewProfe: createNewProfe,
    createNewUser: createNewUser,
    isProfessional: isProfessional,
    isUser: isUser,
    getUserNameAndImgProf: getUserNameAndImgProf,
    getUserNameAndImgUser: getUserNameAndImgUser,
    isUserExistent: isUserExistent,
    saveUserRoleAndProvider: saveUserRoleAndProvider,
    isRegistered: isRegistered
  }

})();