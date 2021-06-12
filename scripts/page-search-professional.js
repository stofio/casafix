(function() {

  $(window).on('load', () => {
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
    loadPage.loadPageOnAuth(isLoggedOrUid, '#search-page', false, false, false);
    unsubscribe();
  });


})();