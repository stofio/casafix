var loadPage = (function() {

  /**
   * //check the role -> get header -> or redirect
   * @param {string} uid - the uid 
   * @param {string} profLinkRed - link redirect if professional is logged, or false
   * @param {string} userLinkRed - link redirect if user is logged, or false
   * @param {string} notLoggedLinkRed - link redirect if not logged, or false
   */
  async function loadPageOnAuth(uid, profLinkRedir = false, userLinkRedir = false, notLoggedLinkRed = false) {
    //if is logged and not verified
    if (uid !== false) {
      var isEmailAuth = firebaseAuth.isEmailAuthenticated();
      if (!isEmailAuth) {
        if (window.location.pathname == lnk.pgVerifyEmail) {
          _showPageContent();
          return; //prevent continous reload 
        }
        window.location.replace(lnk.pgVerifyEmail);
        return;
      }
    }
    if (uid == false) {
      //not logged in
      if (notLoggedLinkRed == false) {
        header.getHeader('def');
        _showPageContent();
        return;
      } else {
        window.location.replace(notLoggedLinkRed);
      }
    }

    //professional
    var isProf = await dbAuth.isProfessional(uid)
    if (isProf) {
      if (profLinkRedir == false) {
        var imgAndName = await dbAuth.getUserNameAndImgProf(uid);
        header.getHeader('prof', imgAndName);
        _showPageContent();
        return;
      } else {
        window.location.replace(profLinkRedir);
        return;
      }
    }


    //user
    var isUser = await dbAuth.isUser(uid);
    if (isUser) {
      if (userLinkRedir == false) {
        var imgAndName = await dbAuth.getUserNameAndImgUser(uid);
        header.getHeader('user', imgAndName);
        _showPageContent()
        return;
      } else {
        window.location.replace(userLinkRedir);
        return;
      }
    }


    //return;
    window.location.replace(notLoggedLinkRed);
    return;

    function _showPageContent() {
      $('body nav').css('display', 'block');
      $('body section').css('display', 'block');
      $('body footer').css('display', 'block');
    }

  }

  return {
    loadPageOnAuth: loadPageOnAuth
  }


})();