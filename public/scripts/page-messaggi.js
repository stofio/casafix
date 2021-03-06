(function() {

  var unsubscribe = firebase.auth().onAuthStateChanged((loggedUser) => {
    var isLoggedOrUid;
    if (loggedUser) {
      isLoggedOrUid = loggedUser.uid;
      chatMain.initChat(loggedUser.uid);
    } else {
      chatMain.showNeedToLoginFirst();
      isLoggedOrUid = false;
    }
    //check the role, get header, show page per id or redirect
    loadPage.loadPageOnAuth(isLoggedOrUid);

    unsubscribe();
  });

})();