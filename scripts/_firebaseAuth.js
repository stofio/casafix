var firebaseAuth = (function() {

  var googleProvider = new firebase.auth.GoogleAuthProvider();

  function googleSignin(callback) {

    firebase.auth().signInWithPopup(googleProvider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      var user = result.user;
      if (typeof(callback) == 'function') {
        callback();
      }
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email; // The email of the user's account used.
      var credential = error.credential; // The firebase.auth.AuthCredential type that was used.
      console.log("Error: " + errorMessage);
    });
  }

  function emailSignUp(email, pwd, re_pwd, callback) {
    if (pwd != re_pwd) {
      console.log('Error: Passw not match');
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function(user) {
        if (user) {
          if (typeof(callback) == 'function') {
            callback();
          }
        }
      }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: " + errorMessage);
      });
    }
  }

  function signOut() {
    firebase.auth().signOut().then(() => {
      window.location.replace('/registrazione');
    }).catch((error) => {
      console.log('Sign out failed:' + error);
    });
  }


  return {
    emailSignUp: emailSignUp,
    googleSignin: googleSignin,
    signOut: signOut,
  }

})();