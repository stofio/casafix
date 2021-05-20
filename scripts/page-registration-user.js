(function() {

  $(window).on('load', () => {
    loadPage.animateProgressBar();
  });

  $(document).on('click', '.back-btn', function() {
    window.location.replace(lnk.pgRegistration);
  })

  var unsubscribe = firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
    } else {
      isLoggedOrUid = false;
    }
    //check the role, get header, show page per id or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid, '#registration-user', lnk.pgAnnounce, lnk.pgHome);
    unsubscribe();
  });



})();