(function() {

  //cache dom
  var $section = $('.registration-sec');
  var $userRole = $section.find('#userRole');
  var $emailRegBtn = $section.find('#email-registration');
  var $googleRegBtn = $section.find('#google-registration');
  var $fbRegBtn = $section.find('#facebook-registration');

  var $regBox = $section.find('.registration-box');

  var $popup = $('#email-reg-popup');
  var $popupBtn = $popup.find('#emailRegisterBtn');
  var $inputs = $popup.find('input');
  var $inputEmail = $popup.find('#email');
  var $inputPass = $popup.find('#password');
  var $inputRePassw = $popup.find('#re-password');
  var $errorForEmail = $popup.find('.form-error').find('p');
  var $errorForGoogleAndFb = $section.find('.box-error').find('p');

  //bind events
  $emailRegBtn.on('click', _showEmailRegPopup);
  $popupBtn.on('click', _registerWithEmail);
  $googleRegBtn.on('click', _registerWithGoogle);
  $fbRegBtn.on('click', _registerWithFacebook);
  $inputs.on('input', _removeError);

  $(document).keypress(_registerWithEmailEnter);


  function _showEmailRegPopup() {
    popup.showPopup('#email-reg-popup');
  }

  /**********
   * Email registration
   ***********/
  function _registerWithEmail() {
    firebaseAuth.emailSignUp($inputEmail.val(), $inputPass.val(), $inputRePassw.val(), (error, uid) => {
      if (error == 'passw-unequal') {
        $errorForEmail.html('<span>⚠</span> Le password non coincidono. Riprova.').show();
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/weak-password') {
        $errorForEmail.html('<span>⚠</span> Password minima di 6 caratteri.').show();
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/invalid-email') {
        $errorForEmail.html('<span>⚠</span> Email invalida. Riprova.').show();
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/email-already-in-use') {
        $errorForEmail.html(`<span>⚠</span> Email '${$inputEmail.val()}' esistente. Riprova.`).show();
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      } else {
        //CREATE PROFILE
        var user = {
          uid: uid,
          email: $inputEmail.val(),
          photoURL: '',
        };
        if ($userRole.val() === 'professionals') {
          dbAuth.createNewProfe({ user: user }, 'email')
            .then(() => {
              firebaseAuth.sendVerificationEmail(() => {
                window.location.replace(lnk.pgSettProf);
              });
            });
        } else if ($userRole.val() === 'users') {
          dbAuth.createNewUser({ user: user }, 'email')
            .then(() => {
              firebaseAuth.sendVerificationEmail(() => {
                window.location.replace(lnk.pgSettUser);
              });
            });
        }
      }
    });
  }

  function _registerWithEmailEnter(e) {
    if (e.keyCode == 13) {
      if ($inputs.is(":focus")) {
        _registerWithEmail();
      }
    }
  }


  /**********
   * Google registration
   ***********/
  function _registerWithGoogle() {
    firebaseAuth.googleSignin((user) => {
      var getUserIfRegistered = firebase.functions().httpsCallable('getUserIfRegistered');
      _removeErrors();
      $section.css('pointer-events', 'none');
      $regBox.prepend(_getLoadingCircle());

      if ($userRole.val() === 'professionals') {
        /**
         * register professional
         */
        getUserIfRegistered({ uid: user.user.uid })
          .then(response => {
            _removeLoadingCircle();
            $section.css('pointer-events', 'auto');

            var savedUser = response;
            var loggedUser = user;
            _createProfessionalOrError(savedUser, loggedUser, 'google');

          })
      } else if ($userRole.val() === 'users') {
        /**
         * register user
         */
        getUserIfRegistered({ uid: user.user.uid })
          .then(response => {
            _removeLoadingCircle();
            $section.css('pointer-events', 'auto');

            var savedUser = response;
            var loggedUser = user;
            _createUserOrError(savedUser, loggedUser, 'google');

          })
      }
    })
  }


  /**********
   * Facebook registration
   ***********/
  function _registerWithFacebook() {
    firebaseAuth.facebookSignin((error, user) => {
      if (error == "auth/account-exists-with-different-credential") {
        $errorForGoogleAndFb.html("L'Account è già registrato con email o google. Riprova");
        return;
      }
      if ($userRole.val() === 'professionals') {
        //IF IS PROFESSIONAL
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a professional
            dbAuth.isProfessional(uid).
            then(isProf => {
              if (isProf) {
                window.location.replace(lnk.pgSettProf);
              } else {
                //error
                $errorForGoogleAndFb.html("L'Account Facebook gia registrato come utente, scegli un'altro account.");
                firebase.auth().signOut();
                return;
              }
            });
          } else {
            //CREATE PROFILE
            var photo;
            if (user.photoURL !== '' || user.photoURL !== null) {
              //get better resolution of image
              photo = `${user.photoURL}?type=large`;
            } else {
              photo = '';
            }
            dbAuth.createNewProfe(user, 'facebook')
              .then(() => {
                firebaseAuth.sendVerificationEmail(() => {
                  window.location.replace(lnk.pgSettProf);
                });
              });
          }
        })
      } else if ($userRole.val() === 'users') {
        //IF IS USER
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a user

            dbAuth.isUser(uid).
            then(isUser => {
              if (isUser) {
                window.location.replace(lnk.pgSettUser);
              } else {
                //error
                $errorForGoogleAndFb.html("L'Account Facebook gia registrato come professionista, scegli un'altro account.");
                firebase.auth().signOut();
                return;
              }
            })
          } else {
            //CREATE PROFILE
            var photo;
            if (user.photoURL !== '' || user.photoURL !== null) {
              //get better resolution of image
              photo = `${user.photoURL}?type=large`;
            } else {
              photo = '';
            }
            dbAuth.createNewUser(user.uid, user.email, 'facebook', photo, () => {
              firebaseAuth.sendVerificationEmail(() => {
                window.location.replace(lnk.pgSettUser);
              });
            });
          }
        })
      }
    });
  }





  function _createProfessionalOrError(savedUser, loggedUser, provider) {
    if (savedUser.data == null) { //if user not registered
      //create account
      console.log(loggedUser)
      dbAuth.createNewProfe(loggedUser, provider)
        .then(() => {
          window.location.replace(lnk.pgSettProf);
        });
      return;

    } else if (savedUser.data._role == 'professional') {
      //there is already an account with this email. Login or try with another email
      firebase.auth().signOut();
      $regBox.prepend(_getErrorAccountExist());
      return;
    } else if (savedUser.data._role == 'user') {
      //this email is already used for an USER account. Try with another email
      firebase.auth().signOut();
      $regBox.prepend(_getErrorAccountExist('UTENTE'));
      return;
    }
    firebase.auth().signOut();
    return;
  }


  function _createUserOrError(savedUser, loggedUser, provider) {
    if (savedUser.data == null) { //if user not registered
      //create account
      dbAuth.createNewUser(loggedUser, provider)
        .then(() => {
          window.location.replace(lnk.pgSettUser);
        });
      return;

    } else if (savedUser.data._role == 'user') {
      //there is already an account with this email. Login or try with another email
      firebase.auth().signOut();
      $regBox.prepend(_getErrorAccountExist());
      return;
    } else if (savedUser.data._role == 'professional') {
      //this email is already used for an USER account. Try with another email
      firebase.auth().signOut();
      $regBox.prepend(_getErrorAccountExist('PROFESSIONISTA'));
      return;
    }
    firebase.auth().signOut();
    return;
  }





  function _removeError() {
    $errorForEmail.html('').hide();
    _removeErrors();
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

  function _getErrorAccountExist(role) {
    if (role == null) {
      var error = `Un account con questo indirizzo email già esiste. 
                  Riprova con un'altra email o <a href="${lnk.pgLogin}">accedi</a> al tuo account.`;
    } else {
      var error = `Un account con questo indirizzo email è registrato come ${role}.
                  Devi usare un'altra email per registrarti.`;
    }
    return `<div class="registration-error">
            <p><span>⚠</span> ${error}</p>
            </div>`;
  }

  function _removeErrors() {
    $('.registration-error').remove();
  }


})();