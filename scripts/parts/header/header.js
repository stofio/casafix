var header = (function() {

  var logoLink = "/images/casafix_logo.png";

  var defaultNavMenu = {
    "Cos'è Casafix": "link",
    "Come funziona": "link"
  };

  var userNavMenu = {
    "Preferiti": "link",
    "Messaggi": "link",
    "Notifiche": "link",
  };

  var professionalNavMenu = {
    "Preferiti": "link",
    "Messaggi": "link",
    "Notifiche": "link",
  };

  var announc = {
    label: "Annunci",
    link: "link"
  }

  var defAccessMenu = {
    login: "Accedi",
    login_link: "link",
    register: "Registrati",
    register_link: "link"
  };

  var profileLink = 'link';

  var tmpHeader = `
    <div class="container">
      <div class="row">
        <header id="header-logo">
          <img src="{{logo}}"/>    
        </header>
        <div id="header-navigation">
            {{{navigation}}}
        </div>
        <div id="header-access">
            {{{access}}}
        </div>
      </div>
    </div>
  `;

  var tmpMobileHeader = `
    <div class="container">
      <div class="row">
        <header id="mobile-header-logo">
          <img src="{{logo}}"/> 
        </header>
        <div id="mobile-header-access">
            {{{access}}}
            <div id="menu-icon"><img src="/images/menu.svg"/></div>
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
    access: ''
  };

  //cache dom
  var $el = $('#header');


  //bind events
  $(window).on('resize', _render);
  $(document).on('click', '#menu-icon', _openCloseMenu);


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
    createNavigation(defaultNavMenu, true);
    createAccess(defAccessMenu);
  }


  function _createUsertHeader(userInfo) {
    createNavigation(userNavMenu, false);
    createAccess(0, userInfo);
  }

  function _createProfHeader(userInfo) {
    createNavigation(userNavMenu, true);
    createAccess(0, userInfo);
  }


  /**
   * set the navigation in {obj} headerContent 
   * @param {obj} navMenu - object of nav items
   * @param {bool} hasAnnunci - true if has btn annunci
   */
  function createNavigation(navMenu, hasAnnunci) {
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


  function createAccess(accessMenu, objUserInfo) {
    if (accessMenu) {
      var acc = `<ul class="access">
                  <li><a href="${defAccessMenu.register_link}">${defAccessMenu.register}</a></li>
                  <li><a href="${defAccessMenu.login_link}">${defAccessMenu.login}</a></li>
                </ul>`;
      headerContent['access'] = acc;
    } else {
      var acc = `<a href="${objUserInfo.name}">
                  <div class="header-prof-info">
                    <span class="header-prof-img"><div style="background-image:url('${objUserInfo.imgLink}')"></div></span>
                    <span class="header-prof-name">${objUserInfo.name}</span>                 
                  </div>
                </a>`;

      headerContent['access'] = acc;
    }
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


  return {
    getHeader: getHeader
  }


})();