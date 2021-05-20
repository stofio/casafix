var dbAuth = (function() {

  var database = firebase.database();

  //create new PROFESSIONAL in db
  function createNewProfe(uid, email, provider, callback) {
    database.ref('users/' + uid).set({
      _is_professional: 1,
      _email: email,
      created: $.now()
    }).then(() => {
      saveUserRoleAndProvider(uid, 'professional', email, provider, () => {
        if (typeof(callback) == 'function') {
          callback();
        }
      })
    }).catch((error) => {
      console.log("create prof, error: " + error);
    })
  }

  //create new USER in db
  function createNewUser(uid, email, provider, callback) {
    database.ref('users/' + uid).set({
      _is_user: 1,
      _email: email,
      created: $.now()
    }).then(() => {
      saveUserRoleAndProvider(uid, 'user', email, provider, () => {
        if (typeof(callback) == 'function') {
          callback();
        }
      })
    }).catch((error) => {
      console.log("create prof, error: " + error);
    })
  }


  function isProfessional(uid, callback) {
    var prof = firebase.database().ref('users/' + uid + '/_is_professional');
    prof.on('value', (snapshot) => {
      const data = snapshot.val();
      var isProf = data == 1 ? true : false;
      if (typeof(callback) == 'function') {
        callback(isProf);
      }
    });
  }

  function isUser(uid, callback) {
    var us = firebase.database().ref('users/' + uid + '/_is_user');
    us.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      var isUser = data == 1 ? true : false;
      if (typeof(callback) == 'function') {
        callback(isUser);
      }
    });
  }

  /**
   * return object with 'name' and 'imgLink' 
   */
  function getUserNameAndImg(uid, callback) {
    var user = firebase.database().ref('users/' + uid);
    user.on('value', (snapshot) => {
      const data = snapshot.val();
      var name = data.name;
      var imgLink = data.imgProfileUrl;
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
    database.ref('users_register/' + uid).set({
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
    var registeredUser = firebase.database().ref('users_register/' + uid);
    registeredUser.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data == null) {
        if (typeof(callback) == 'function') {
          callback(false);
        }
      } else {
        if (typeof(callback) == 'function') {
          callback(true);
        }
      }
    })
  }



  return {
    createNewProfe: createNewProfe,
    createNewUser: createNewUser,
    isProfessional: isProfessional,
    isUser: isUser,
    getUserNameAndImg: getUserNameAndImg,
    isUserExistent: isUserExistent,
    saveUserRoleAndProvider: saveUserRoleAndProvider
  }

})();