(function() {

  $(window).on('load', function() {
    loadPage.animateProgressBar();
  });

  var unsubscribe = firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
    } else {
      isLoggedOrUid = false;
    }
    //check the role, get header, show page per id or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid, '#registration', lnk.pgAnnounce, lnk.pgHome);
    unsubscribe();
  });

})();