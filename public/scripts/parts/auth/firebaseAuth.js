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
        console.log("Error google sign in: " + error);
      });
  }

  function facebookSignin(callback) {
    firebase.auth().signInWithPopup(facebookProvider)
      .then((user) => {
        if (typeof(callback) == 'function') {
          //

          callback(e = false, user); //ADD USER IMAGEE!!
        }
      }).catch((error) => {
        console.log("Error facebook sign in: " + error);
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
        window.location.replace(lnk.pgHome);
      }).catch((error) => {
        console.log('Sign out failed:' + error);
      });
  }

  function sendVerificationEmail(callback) {
    actionCodeSettings = {
      //  url: ''
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