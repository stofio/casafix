(function() {

  var unsubscribe = firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
      // hide registration buttons
      $('.register-as-prof-banner').hide();
      $('.add-announcement-banner').hide();
    } else {
      isLoggedOrUid = false;
    }
    //check the role, get header, show page per id or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid);
    unsubscribe();
  });

})();