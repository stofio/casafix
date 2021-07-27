var header = (function() {

  var logoLink = "/images/casafix_logo.svg";

  var defaultNavMenu = {
    "Cos'è Casafix": "link",
    "Come funziona": "link"
  };

  var userNavMenu = {
    "Preferiti": "link",
    "Messaggi": "link",
    "Notifiche": "link",
    "Notifiche": "link",
    "Notifiche": "link",
  };

  var professionalNavMenu = {
    "Preferiti": "link",
    "Messaggi": "link",
    "Notifiche": "link",
  };

  var announc = {
    label: "Annunci",
    link: lnk.pgAnnounce
  }

  var defAccessMenu = {
    login: "Accedi",
    login_link: lnk.pgLogin,
    register: "Registrati",
    register_link: lnk.pgRegistration
  };

  var profileLink = 'link';

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
  $(document).on('click', '.h-prof-img, #header-access', _openProfileMenu);
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
    _createAccess(true);
  }


  function _createUsertHeader(userInfo) {
    _createNavigation(userNavMenu, false);
    _createAccess(false, userInfo);
    _createProfileMenu(lnk.pgSettUser);
  }

  function _createProfHeader(userInfo) {
    _createNavigation(professionalNavMenu, true);
    _createAccess(false, userInfo);
    _createProfileMenu(lnk.pgSettProf);
  }


  /**
   * set the navigation in {obj} headerContent 
   * @param {obj} navMenu - object of nav items
   * @param {bool} hasAnnunci - true if has btn annunci
   */
  function _createNavigation(navMenu, hasAnnunci) {
    var nav = `<ul class="nav">
                {{#navig}}
                  {{{.}}}
                {{/navig}}
               </ul>`;
    var arrayOfLi = [];
    $.each(navMenu, (key, val) => {
        arrayOfLi.push(`<li><a href="${val}">${key}</a></li>`);
      })
      //button annunci
    if (hasAnnunci) {
      arrayOfLi.push(`<li class="announc"><a href="${announc.link}">${announc.label}</a></li>`);
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
  function _createAccess(hasAccessMenu, objUserInfo) {
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

  function _createProfileMenu(linkProfile) {
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


  return {
    getHeader: getHeader
  }


})();