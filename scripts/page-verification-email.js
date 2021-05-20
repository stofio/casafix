(function() {

  $(window).on('load', () => {
    loadPage.animateProgressBar();
  });

  $(document).on('click', 'button.resend', () => {
    firebaseAuth.sendVerificationEmail();
    alert("Abbiamo rinviato l'email di verificazione a " + firebaseAuth.getCurrentUserEmail());
  });

  $(document).on('click', 'logout', () => {
    firebaseAuth.signOut();
  });

  firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
    } else {
      isLoggedOrUid = false;
    }
    if (firebaseAuth.isEmailAuthenticated()) {
      window.location.replace(lnk.pgHome);
    }
    //set email on page
    $('#user-email').html(firebaseAuth.getCurrentUserEmail);
    //check the role, get header, show page per id or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid, '#verification-email"', lnk.pgSettProf, false, lnk.pgLogin);

  });

})();