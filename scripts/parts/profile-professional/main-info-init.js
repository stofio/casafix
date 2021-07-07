(function() {

  /**
   * here is done the request to db and passed to 2 modules
   * of the profile-professional page/folder
   */

  var uid;
  var profData;

  //init
  $(document).on('load', _init());


  //functions
  async function _init() {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");
    await dbProfile.getProfProfileData(uid)
      .then(data => {
        profData = data;
        _initMainInfo(profData);
        _initServices(profData);
      })
  }


  function _initMainInfo(data) {
    profProfMainInfo.init(data);
  }

  function _initServices(data) {
    profProfServices.init(data);
  }


})();