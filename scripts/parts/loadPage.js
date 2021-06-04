var loadPage = (function() {

  /**
   * //check the role -> get header -> show page per sectionId or redirect
   * @param {string} uid - the uid
   * @param {string} sectionId - section id '#section'
   * @param {string} profLinkRed - link redirect if professional is logged, or false
   * @param {string} userLinkRed - link redirect if user is logged, or false
   * @param {string} notLoggedLinkRed - link redirect if not logged, or false
   */
  function loadPageOnAuth(uid, sectionId, profLinkRedir = false, userLinkRedir = false, notLoggedLinkRed = false) {
    if (uid !== false) {
      //IF IS LOGGED
      var isEmailAuth = firebaseAuth.isEmailAuthenticated();
      if (!isEmailAuth) {
        if (window.location.pathname == lnk.pgVerifyEmail) return; //prevent continous reload 
        window.location.replace(lnk.pgVerifyEmail);
        return;
      }
    }
    if (isEmailAuth) {
      dbAuth.isProfessional(uid, (isProf) => {
        //PROFESSIONAL
        if (isProf) {
          if (profLinkRedir == false) {
            dbAuth.getUserNameAndImgProf(uid, (obj) => {
              header.getHeader('prof', obj);
              $(sectionId).fadeIn(500);
              return;
            });
          } else {
            window.location.replace(profLinkRedir);
            return;
          }
        }
      });
      dbAuth.isUser(uid, (isUser) => {
        //USER
        console.log(isUser)
        if (isUser) {
          if (userLinkRedir == false) {
            dbAuth.getUserNameAndImgUser(uid, (obj) => {
              header.getHeader('user', obj);
              $(sectionId).fadeIn(500);
              return;
            });
          } else {
            window.location.replace(userLinkRedir);
            return;
          }
        }
      });
    } else {
      if (notLoggedLinkRed == false) {
        //NOT LOGGED
        header.getHeader('def');
        $(sectionId).fadeIn(500);
        return;
      }
      window.location.replace(notLoggedLinkRed);
      return;
    }
  }

  function animateProgressBar() {
    if ($("#progress").length === 0) {
      $("body").append($("<div><b></b><i></i></div>").attr("id", "progress"));
      $("#progress").width("101%").delay(800).fadeOut(500, function() {
        $(this).remove();
      });
    }
  }

  return {
    loadPageOnAuth: loadPageOnAuth,
    animateProgressBar: animateProgressBar
  }


})();