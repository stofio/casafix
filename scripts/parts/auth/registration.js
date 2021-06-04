(function() {

  //cache dom
  var $section = $('.registration-sec');
  var $userRole = $section.find('#userRole');
  var $emailRegBtn = $section.find('#email-registration');
  var $googleRegBtn = $section.find('#google-registration');
  var $fbRegBtn = $section.find('#facebook-registration');

  var $popup = $('#email-reg-popup');
  var $popupBtn = $popup.find('#emailRegisterBtn');
  var $inputs = $popup.find('input');
  var $inputEmail = $popup.find('#email');
  var $inputPass = $popup.find('#password');
  var $inputRePassw = $popup.find('#re-password');
  var $errorForEmail = $popup.find('.form-error').find('span');
  var $errorForGoogleAndFb = $section.find('.box-error').find('span');

  //bind events
  $emailRegBtn.on('click', _showEmailRegPopup);
  $popupBtn.on('click', _registerWithEmail);
  $googleRegBtn.on('click', _registerWithGoogle);
  $fbRegBtn.on('click', _registerWithFacebook);
  $inputs.on('input', _removeError);


  function _showEmailRegPopup() {
    popup.showPopup();
  }

  function _registerWithEmail() {
    firebaseAuth.emailSignUp($inputEmail.val(), $inputPass.val(), $inputRePassw.val(), (error, uid) => {
      if (error == 'passw-unequal') {
        $errorForEmail.html('Le password non coincidono. Riprova.');
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/weak-password') {
        $errorForEmail.html('Password minima di 6 caratteri.');
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/invalid-email') {
        $errorForEmail.html('Email invalida. Riprova.');
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      }
      if (error == 'auth/email-already-in-use') {
        $errorForEmail.html(`Email '${$inputEmail.val()}' esistente. Riprova.`);
        $inputPass.val('');
        $inputRePassw.val('');
        return;
      } else {
        //CREATE PROFILE
        if ($userRole.val() === 'professional') {
          dbAuth.createNewProfe(uid, $inputEmail.val(), 'email', '', () => {
            firebaseAuth.sendVerificationEmail(() => {
              window.location.replace(lnk.pgSettProf);
            });
          });
        } else if ($userRole.val() === 'user') {
          dbAuth.createNewUser(uid, $inputEmail.val(), 'email', '', () => {
            firebaseAuth.sendVerificationEmail(() => {
              window.location.replace(lnk.pgSettUser);
            });
          });
        }
      }
    });
  }

  function _registerWithGoogle() {
    firebaseAuth.googleSignin((user) => {
      if ($userRole.val() === 'professional') {
        //IF IS PROFESSIONAL
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a professional
            dbAuth.isProfessional(user.uid, (isProf) => {
              if (isProf) {
                window.location.replace(lnk.pgSettProf);
              } else {
                //error
                $errorForGoogleAndFb.html("L'Account google già registrato come utente, scegli un'altro account.");
                firebase.auth().signOut();
                return;
              }
            })
          } else {
            //CREATE PROFILE
            var photo;
            if (user.photoURL !== '' || user.photoURL !== null) {
              //get better resolution of image
              photo = user.photoURL.replace('s96-c', 's400-c');
            } else {
              photo = '';
            }
            dbAuth.createNewProfe(user.uid, user.email, 'google', photo, () => {
              window.location.replace(lnk.pgSettProf);
            });
          }
        })
      } else if ($userRole.val() === 'user') {
        //IF IS USER
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a user
            dbAuth.isUser(user.uid, (isUser) => {
              if (isUser) {
                window.location.replace(lnk.pgSettUser);
              } else {
                //error
                $errorForGoogleAndFb.html("L'Account google già registrato come professionista, scegli un'altro account.");
                firebase.auth().signOut();
                return;
              }
            })
          } else {
            //CREATE PROFILE
            var photo;
            if (user.photoURL !== '' || user.photoURL !== null) {
              //get better resolution of image
              photo = user.photoURL.replace('s96-c', 's400-c');
            } else {
              photo = '';
            }
            dbAuth.createNewUser(user.uid, user.email, 'google', photo, () => {
              window.location.replace(lnk.pgSettUser);
            });
          }
        })
      }
    })
  }

  function _registerWithFacebook() {
    firebaseAuth.facebookSignin((error, user) => {
      if (error == "auth/account-exists-with-different-credential") {
        $errorForGoogleAndFb.html("L'Account è già registrato con email o google. Riprova");
        return;
      }
      if ($userRole.val() === 'professional') {
        //IF IS PROFESSIONAL
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a professional
            dbAuth.isProfessional(user.uid, (isProf) => {
              if (isProf) {
                window.location.replace(lnk.pgSettProf);
              } else {
                //error
                $errorForGoogleAndFb.html("L'Account Facebook gia registrato come utente, scegli un'altro account.");
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
            dbAuth.createNewProfe(user.uid, user.email, 'facebook', photo, () => {
              firebaseAuth.sendVerificationEmail(() => {
                window.location.replace(lnk.pgSettProf);
              });
            });
          }
        })
      } else if ($userRole.val() === 'user') {
        //IF IS USER
        dbAuth.isUserExistent(user.uid, (exist) => {
          //IF PROFILE ALREADY CREATED
          if (exist) {
            //check if is a user
            dbAuth.isUser(user.uid, (isUser) => {
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

  function _removeError() {
    $errorForEmail.html('');
  }

})();