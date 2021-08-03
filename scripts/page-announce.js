(function() {

  var unsubscribe = firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
    } else {
      isLoggedOrUid = false;
    }
    //check the role, get header, or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid);
    unsubscribe();
  });

})();