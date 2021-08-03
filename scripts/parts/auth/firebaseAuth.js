var firebaseAuth = (function() {

  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();

  function googleSignin(callback) {
    firebase.auth().signInWithPopup(googleProvider)
      .then(user => {
        if (typeof(callback) == 'function') {
          callback(user); //ADD USER IMAGEE!!
        }
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  }

  function facebookSignin(callback) {
    firebase.auth().signInWithRedirect(facebookProvider)
      .then((user) => {
        var token = user.credential.accessToken;
        var user = user.user;
        var uid = user.uid;
        var email = user.email;
        if (typeof(callback) == 'function') {
          //if doesnt exist, return uid & email to save in db
          callback(e = false, user); //ADD USER IMAGEE!!
        }
      }).catch((error) => {
        console.log(error)
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: " + errorMessage)
        console.log(errorCode);
        if (typeof(callback) == 'function') {
          callback(errorCode);
        }
      });
  }

  function emailSignUp(email, pwd, rpwd, callback) {
    if (pwd == rpwd) {
      firebase.auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((userCredential) => {
          var user = userCredential.user;
          if (typeof(callback) == 'function') {
            callback(e = 0, user.uid);
          }
        })
        .catch((error) => {
          var errorCode = error.code;
          if (typeof(callback) == 'function') {
            callback(errorCode);
          }
        });
    } else {
      var errorCode = 'passw-unequal';
      if (typeof(callback) == 'function') {
        callback(errorCode);
      }
      return;
    }
  }


  function isEmailAuthenticated() {
    if (firebase.auth().currentUser !== null) {
      return firebase.auth().currentUser.emailVerified;
    }
  }

  function getCurrentUserEmail() {
    if (firebase.auth().currentUser !== null) {
      return firebase.auth().currentUser.email;
    }
  }


  function signOut() {
    firebase.auth().signOut()
      .then(() => {
        window.location.replace('/registrazione.html');
      }).catch((error) => {
        console.log('Sign out failed:' + error);
      });
  }

  function sendVerificationEmail(callback) {
    actionCodeSettings = {
      // url: 'localhost/'
    }
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
      .then(() => {
        if (typeof(callback) == 'function') {
          callback();
        }
      });
  }

  function loginWithEmail(email, pw, callback) {
    firebase.auth().signInWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        var user = userCredential.user;
        if (typeof(callback) == 'function') {
          callback(false, user.uid);
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        if (typeof(callback) == 'function') {
          callback(errorCode);
        }
      });
  }


  return {
    emailSignUp: emailSignUp,
    googleSignin: googleSignin,
    facebookSignin: facebookSignin,
    signOut: signOut,
    isEmailAuthenticated: isEmailAuthenticated,
    getCurrentUserEmail: getCurrentUserEmail,
    sendVerificationEmail: sendVerificationEmail,
    loginWithEmail: loginWithEmail
  }

})();