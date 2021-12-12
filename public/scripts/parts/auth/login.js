(function() {


  //cache dom
  var $section = $('#login');
  var $emailLogBtn = $section.find('#emailLoginBtn');
  var $googleLogBtn = $section.find('#googleLogin');
  var $fbLogBtn = $section.find('#facebookLogin');

  var $regBox = $section.find('.registration-box');

  var $errorForEmail = $section.find('.form-error p');
  var $errorForGoogleAndFb = $section.find('.box-error p');

  var $inpEmail = $section.find('#email');
  var $inputPass = $section.find('#password');
  var $inputs = $section.find('#email-login').find('input');

  //bind events
  $emailLogBtn.on('click', _emailLogin);
  $googleLogBtn.on('click', _googleLogin);
  $fbLogBtn.on('click', _facebookLogin);
  $section.on('input', _removeAllErrors);

  $(document).keypress(_loginWithEmailEnter);


  async function _emailLogin() {
    firebaseAuth.loginWithEmail($inpEmail.val(), $inputPass.val(), (error, uid) => {
      if (error == 'auth/invalid-email') {
        $errorForEmail.html('<span>⚠</span> Email invalida. Riprova.').show();
        $inputPass.val('');
        return;
      }
      if (error == 'auth/wrong-password') {
        $errorForEmail.html('<span>⚠</span> Password invalida. Riprova.').show();
        $inputPass.val('');
        return;
      }
      if (error == 'auth/user-not-found') {
        $errorForEmail.html('<span>⚠</span> Account non esiste. Riprova o registrati.').show();
        $inputPass.val('');
        return;
      }


      dbAuth.isProfessional(uid).
      then(isProf => {
        if (isProf) {
          window.location.replace(lnk.pgAnnounce);
          return;
        }
      })

      dbAuth.isUser(uid).
      then(isUser => {
        if (isUser) {
          window.location.replace(lnk.pgHome);
          return;
        }
      })

    })
  }

  function _googleLogin() {
    firebaseAuth.googleSignin(user => {
      _removeErrorAccountDoesntExist();
      $section.css('pointer-events', 'none');
      $regBox.prepend(_getLoadingCircle());
      //check if exist
      //if not, delete user, and show error
      var isUserRegistered = firebase.functions().httpsCallable('checkOnLoginIfRegistered');
      isUserRegistered({ uid: user.user.uid })
        .catch(error => {
          console.log(error)
          _removeLoadingCircle();
          $regBox.prepend(_getErrorAccountDoesntExist());
          $section.css('pointer-events', 'auto');
          return;
        })
      dbAuth.isProfessional(user.user.uid)
        .then(isProf => {
          if (isProf) {
            window.location.replace(lnk.pgAnnounce);
            return;
          }
        })

      dbAuth.isUser(user.user.uid)
        .then(isProf => {
          if (isProf) {
            window.location.replace(lnk.pgHome);
            return;
          }
        })
    })
  }


  function _facebookLogin() {
    firebaseAuth.facebookSignin((error, user) => {
      _removeErrorAccountDoesntExist();
      $section.css('pointer-events', 'none');
      $regBox.prepend(_getLoadingCircle());
      //check if exist
      //if not, delete user, and show error
      var isUserRegistered = firebase.functions().httpsCallable('checkOnLoginIfRegistered');
      isUserRegistered({ uid: user.user.uid })
        .catch(error => {
          console.log(error)
          _removeLoadingCircle();
          $regBox.prepend(_getErrorAccountDoesntExist());
          $section.css('pointer-events', 'auto');
          return;
        })
      dbAuth.isProfessional(user.user.uid)
        .then(isProf => {
          if (isProf) {
            window.location.replace(lnk.pgAnnounce);
            return;
          }
        })

      dbAuth.isUser(user.user.uid)
        .then(isProf => {
          if (isProf) {
            window.location.replace(lnk.pgHome);
            return;
          }
        })
    })
  }

  // function _facebookLogin() {
  //   firebaseAuth.facebookSignin((error, user) => {
  //     if (error == "auth/account-exists-with-different-credential") {
  //       $errorForGoogleAndFb.html("L'Account è già registrato con email o google. Riprova");
  //       return;
  //     }
  //     dbAuth.isRegistered(user.uid)
  //       .then(isRegistered => {
  //         if (!isRegistered) {
  //           user.delete()
  //             .then(() => {
  //               window.location.replace(lnk.pgRegistration);
  //               return;
  //             })
  //         }
  //       })

  //     dbAuth.isProfessional(uid).
  //     then(isProf => {
  //       if (isProf) {
  //         window.location.replace(lnk.pgAnnounce);
  //         return;
  //       }
  //     })


  //     dbAuth.isUser(uid).
  //     then(isUser => {
  //       if (isUser) {
  //         window.location.replace(lnk.pgHome);
  //         return;
  //       }
  //     })

  //   })
  // }

  function _loginWithEmailEnter(e) {
    if (e.keyCode == 13) {
      if ($inputs.is(":focus")) {
        _emailLogin();
      }
    }
  }

  function _getLoadingCircle() {
    return `<div class="spinning-circle-bar">
            <div class="spinning-circle circle-border">
            </div>
            </div>`;
  }

  function _removeLoadingCircle() {
    $('.spinning-circle-bar').remove();
  }

  function _getErrorAccountDoesntExist() {
    return `<div class="registration-error">
            <p><span>⚠</span> Un account con questo indirizzo email non esiste. 
            Riprova o <a href="${lnk.pgContact}">contatta l'assistenza</a> se non riesci ad accedere al tuo account.<br> 
            Oppure <a href="${lnk.pgRegistration}">registrati</a>.
            </p>
            </div>`;
  }

  function _removeErrorAccountDoesntExist() {
    $('.registration-error').remove();
  }

  function _removeAllErrors() {
    _removeErrorAccountDoesntExist();
    $errorForEmail.html('').hide();
  }



})();