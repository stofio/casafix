(function() {

  //cache dom
  var $section = $('#login');
  var $emailLogBtn = $section.find('#emailLoginBtn');
  var $googleLogBtn = $section.find('#googleLogin');
  var $fbLogBtn = $section.find('#facebookLogin');

  var $errorForEmail = $section.find('.form-error span');
  var $errorForGoogleAndFb = $section.find('.box-error span');

  var $inpEmail = $section.find('#email');
  var $inputPass = $section.find('#password');

  //bind events
  $emailLogBtn.on('click', _emailLogin);
  $googleLogBtn.on('click', _googleLogin);
  $fbLogBtn.on('click', _facebookLogin);



  function _emailLogin() {
    firebaseAuth.loginWithEmail($inpEmail.val(), $inputPass.val(), (error, uid) => {
      if (error == 'auth/invalid-email') {
        $errorForEmail.html('Email invalida. Riprova.');
        $inputPass.val('');
        return;
      }
      if (error == 'auth/wrong-password') {
        $errorForEmail.html('Password invalida. Riprova.');
        $inputPass.val('');
        return;
      }
      if (error == 'auth/user-not-found') {
        $errorForEmail.html('Account non esiste. Riprova o registrati.');
        $inputPass.val('');
        return;
      }

      dbAuth.isProfessional(uid, () => {
        window.location.replace(lnk.pgAnnounce);
      })

      dbAuth.isUser(uid, () => {
        window.location.replace(lnk.pgHome);
      })

    })
  }

  function _googleLogin() {
    firebaseAuth.googleSignin((user) => {
      dbAuth.isRegistered(user.uid, (registered) => {
        if (!registered) {
          //delete user
          user.delete()
            .then(() => {
              window.location.replace(lnk.pgRegistration);
            })
          return;
        }
      })
      dbAuth.isProfessional(user.uid, () => {
        window.location.replace(lnk.pgAnnounce);
      })

      dbAuth.isUser(user.uid, () => {
        window.location.replace(lnk.pgHome);
      })
    })
  }

  function _facebookLogin() {
    firebaseAuth.facebookSignin((error, user) => {
      if (error == "auth/account-exists-with-different-credential") {
        $errorForGoogleAndFb.html("L'Account è già registrato con email o google. Riprova");
        return;
      }
      dbAuth.isRegistered(user.uid, (registered) => {
        if (!registered) {
          user.delete()
            .then(() => {
              window.location.replace(lnk.pgRegistration);
              return;
            })
        }
      })
      dbAuth.isProfessional(user.uid, () => {
        window.location.replace(lnk.pgAnnounce);
      })

      dbAuth.isUser(user.uid, () => {
        window.location.replace(lnk.pgHome);
      })
    })
  }



})();