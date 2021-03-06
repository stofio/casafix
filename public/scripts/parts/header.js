var header = (function() {

  var logoLink = "/images/casafix_logo.svg";

  var defaultNavMenu = {
    "Cos'รจ Casafix": lnk.pgWhatIsIt,
    "Come funziona": lnk.pgHowItWorks
  };

  var userNavMenu = {
    "Preferiti": lnk.pgFavouritesProfessionals,
    "Messaggi": lnk.pgMessages,
    "Notifiche": lnk.pgNotification,
  };

  var professionalNavMenu = {
    "Preferiti": lnk.pgFavouritesAnnounces,
    "Messaggi": lnk.pgMessages,
    "Notifiche": lnk.pgNotification,
  };

  var announcSearch = {
    label: "๐๏ธ Annunci",
    link: lnk.pgAnnounce
  }

  var profSearch = {
    label: "๐๏ธ Cerca Professionisti",
    link: lnk.pgCercaProf
  }

  var defAccessMenu = {
    login: "Accedi",
    login_link: lnk.pgLogin,
    register: "Registrati",
    register_link: lnk.pgRegistration
  };


  var tmpHeader = `
    <div class="container">
      <div class="row">
        <header id="header-logo">
          <a href="${lnk.pgHome}">
            <img src="{{logo}}"/>    
          </a>
        </header>
        <div id="header-navigation">
            {{{navigation}}}
        </div>
        <div id="header-access">
            {{{access}}}
            {{{profileMenu}}}
        </div>
      </div>
    </div>
  `;

  var tmpMobileHeader = `
    <div class="container">
      <div class="row">
        <header id="mobile-header-logo">
          <a href="${lnk.pgHome}">
            <img src="{{logo}}"/> 
          </a>
        </header>
        <div id="mobile-header-access">
            {{{access}}}
            <div id="menu-icon"><img src="/images/menu.svg"/></div>
            {{{profileMenu}}}
        </div>
        <div id="mobile-header-navigation">
            {{{access}}}
            {{{navigation}}}
        </div>
      </div>
    </div>
  `;

  var headerContent = {
    logo: logoLink,
    navigation: '',
    access: '',
    profileMenu: ''
  };

  //cache dom
  var $el = $('#header');


  //bind events
  $(window).on('resize', _render);
  $(document).on('click', '#menu-icon', _openCloseMenu);
  $(document).on('click', '.h-prof-img, .header-prof-name', '#header-access', _openProfileMenu);
  $(document).on('click', '.logout', _logout);
  document.onclick = function(e) {
    if (!e.target.matches('.profileMenu, .profileMenu *, .header-prof-info, .header-prof-info *, .h-prof-img')) {
      _closeProfileMenu();
    }
  }


  function _render() {
    if ($(window).width() < 992) {
      $el.html(Mustache.render(tmpMobileHeader, headerContent));
    } else {
      $el.html(Mustache.render(tmpHeader, headerContent));
    }
  }


  /**
   * render the nav menu based on role
   * @param {string} role - can be 'def', 'user', 'prof'
   * @param {obj} userInfo - object with 'name' and 'imgLink' of user
   */
  function getHeader(role, userInfo) {
    switch (role) {
      case 'def':
        _createDefaultHeader();
        _render();
        break;
      case 'user':
        _createUsertHeader(userInfo);
        _render();
        break;
      case 'prof':
        _createProfHeader(userInfo);
        _render();
        break;
    }
  }

  function _createDefaultHeader() {
    _createNavigation(defaultNavMenu, true);
    _generateLoginOrProfileBox(true);
  }


  function _createUsertHeader(userInfo) {
    _createNavigation(userNavMenu, false, false, true);
    _generateLoginOrProfileBox(false, userInfo);
    _createProfileSubmenu(lnk.pgSettUser);
    firebase.auth().onAuthStateChanged(loggedUser => {
      if (loggedUser) {
        _listenOnlineStatus(loggedUser);
        _listenMessage(loggedUser);
      }
    })
  }

  function _createProfHeader(userInfo) {
    _createNavigation(professionalNavMenu, false, true, false);
    _generateLoginOrProfileBox(false, userInfo);
    _createProfileSubmenu(lnk.pgSettProf);
    firebase.auth().onAuthStateChanged(loggedUser => {
      if (loggedUser) {
        _listenOnlineStatus(loggedUser);
        _listenMessage(loggedUser);
      }
    })
  }


  /**
   * set the navigation in {obj} headerContent 
   * @param {obj} navMenu - object of nav items
   * @param {bool} hasAnnunciAndProfessionalSearch - true if has btn annunci
   */
  function _createNavigation(navMenu, hasAnnunciAndProfessionalSearch, hasAnnunciSearch, hasProfessionalSearch) {
    var nav = `<ul class="nav">
                {{#navig}}
                  {{{.}}}
                {{/navig}}
               </ul>`;
    var arrayOfLi = [];
    $.each(navMenu, (key, val) => {
        arrayOfLi.push(`<li class="${key}"><a href="${val}">${key}</a></li>`);
      })
      //button annunci
    if (hasAnnunciAndProfessionalSearch) {
      var searchHeaderSection = `<div class="searchHeaderSection">
        <li class="announc"><a href="${announcSearch.link}">${announcSearch.label}</a></li>
        <li class="announc"><a href="${profSearch.link}">${profSearch.label}</a></li>
      </div> `;
      arrayOfLi.push(searchHeaderSection);
    }
    if (hasAnnunciSearch) {
      var searchHeaderSection = `<div class="searchHeaderSection">
        <li class="announc"><a href="${announcSearch.link}">${announcSearch.label}</a></li>
      </div> `;
      arrayOfLi.push(searchHeaderSection);
    }
    if (hasProfessionalSearch) {
      var searchHeaderSection = `<div class="searchHeaderSection">
        <li class="announc"><a href="${profSearch.link}">${profSearch.label}</a></li>
      </div> `;
      arrayOfLi.push(searchHeaderSection);
    }
    var data = {
      navig: arrayOfLi
    }
    headerContent['navigation'] = Mustache.render(nav, data);
  }


  /**
   * 
   * @param {bool} hasAccessMenu - true for login/signup, false for profile menu
   * @param {obj} objUserInfo - object with 'name' and 'imgLink' of user
   */
  function _generateLoginOrProfileBox(hasAccessMenu, objUserInfo) {
    if (hasAccessMenu) {
      var acc = `<ul class="access">
                  <li><a href="${defAccessMenu.register_link}">${defAccessMenu.register}</a></li>
                  <li><a href="${defAccessMenu.login_link}">${defAccessMenu.login}</a></li>
                </ul>`;
      headerContent['access'] = acc;
    } else {
      var acc = `<a href="#">
                  <div class="header-prof-info">
                    <span class="header-prof-img"><div class="h-prof-img" style="background-image:url('${objUserInfo.imgLink}')"></div></span>
                    <span class="header-prof-name">${objUserInfo.name}</span>                 
                  </div>
                </a>`;

      headerContent['access'] = acc;
    }
  }

  function _createProfileSubmenu(linkProfile) {
    var acc = `<ul class="profileMenu">
                <li>
                  <a href="${linkProfile}">
                    <img src="/images/profile-icon.svg">
                    <span>Profilo</span>
                  </a>
                </li>
                <li>
                  <a class="logout" href="">
                    <img src="/images/logout-icon.svg">
                    <span>Esci</span>
                  </a>
                </li>
              </ul>`;

    headerContent['profileMenu'] = acc;
  }

  function _openCloseMenu() {
    if ($el.find('#menu-icon').hasClass('menu-opened')) {
      $el.find('#mobile-header-navigation').css('display', 'none');
      $el.find('#menu-icon').html('<img src="/images/menu.svg" />');
      $el.find('#menu-icon').removeClass('menu-opened');
    } else {
      $el.find('#mobile-header-navigation').css('display', 'block');
      $el.find('#menu-icon').html('<img src="/images/close-menu.svg" />');
      $el.find('#menu-icon').addClass('menu-opened');
    }
  }

  function _openProfileMenu() {
    $('.profileMenu').css('display', 'block');
  }

  function _closeProfileMenu() {
    $('.profileMenu').css('display', 'none');
  }

  function _logout() {
    firebaseAuth.signOut();
  }

  function _listenOnlineStatus(loggedUser) {
    if (typeof onlineStatus === 'undefined') return; //if script is not included
    onlineStatus.statusListener(loggedUser.uid);
  }

  async function _listenMessage(loggedUser) {

    var rooms = firebase.firestore().collection('messages_meta').doc(loggedUser.uid).collection('my_rooms');
    rooms.onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          _getTotalUnread(loggedUser.uid)
            .then(total => { _showUnreadMessages(total) })
        }
        if (change.type === "modified") {
          _getTotalUnread(loggedUser.uid)
            .then(total => { _showUnreadMessages(total) })
        }
      });
    })
  }

  function _showUnreadMessages(number) {
    var $headerMessages = $el.find('.Messaggi');
    $headerMessages.find('.header-unread').remove();
    if (number !== 0) {
      $headerMessages.find('a').append(`<span class="header-unread">${number}</span>`)
    }
  }

  function _getTotalUnread(uid) {
    return new Promise((resolve, reject) => {
      var rooms = firebase.firestore().collection('messages_meta').doc(uid);
      rooms.get()
        .then(snapshot => {
          resolve(snapshot.data().total_unread_messages);
        })
    })
  }


  return {
    getHeader: getHeader
  }


})();