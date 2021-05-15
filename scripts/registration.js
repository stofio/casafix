var registrationPage = (function() {


  //cache dom
  var $section = $('#registration-prof');
  var $emailRegBtn = $section.find('#email-registration');
  var $googleRegBtn = $section.find('#google-registration');
  var $fbRegBtn = $section.find('#facebook-registration');

  var $popup = $('#email-reg-popup');
  var $popupBtn = $popup.find('#emailRegisterBtn');
  var $inputs = $popup.find('input');
  var $inputEmail = $popup.find('#email');
  var $inputPass = $popup.find('#password');
  var $inputRePassw = $popup.find('#re-password');
  var $error = $popup.find('.form-error').find('span');

  //bind events
  $emailRegBtn.on('click', _showEmailRegPopup);
  $popupBtn.on('click', _registerWithEmail);
  $googleRegBtn.on('click', _registerWithGoogle);
  $fbRegBtn.on('click', _registerWithFacebook);
  $inputs.on('input', removeError);


  function showPage() {
    $section.fadeIn(500);
  }

  function _showEmailRegPopup() {
    popup.showPopup();
  }

  function _registerWithEmail() {
    if (!_isEmail($inputEmail.val())) {
      console.log('aa')
      $error.html('Email invalida. Riprova');
      $inputPass.val('');
      $inputRePassw.val('');
      return;
    }
    if ($inputPass.val().length < 6) {
      $error.html('Password minima di 6 caratteri');
      $inputPass.val('');
      $inputRePassw.val('');
      return;
    }
    if ($inputPass.val() !== $inputRePassw.val()) {
      $error.html('Le password non coincidono. Riprova');
      $inputPass.val('');
      $inputRePassw.val('');
      return;
    }
    firebaseAuth.emailSignUp($inputEmail.val(), $inputPass.val(), $inputRePassw.val(), () => {
      window.location.replace('/benvenuto-professionista.html');
    });
  }

  function _registerWithGoogle() {
    firebaseAuth.googleSignin(() => {
      window.location.replace('/benvenuto-professionista.html');
    });
  }

  function _registerWithFacebook() {}

  function _isEmail(email) {
    var check = "" + email;
    if ((check.search('@') >= 0) && (check.search(/\./) >= 0))
      if (check.search('@') < check.split('@')[1].search(/\./) + check.search('@')) return true;
      else return false;
    else return false;
  }

  function removeError() {
    $error.html('');
  }

  return {
    showPage: showPage
  }


})();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    var userHeader = {
      name: 'pera',
      imgLink: '/images/placeholder-prof-img.png'
    }
    header.getHeader('prof', userHeader);
    registrationPage.showPage();
    var uid = user.uid;
    // ...
  } else {
    header.getHeader('def');
    registrationPage.showPage();
  }
});