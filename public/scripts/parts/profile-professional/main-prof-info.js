var profProfMainInfo = (function() {

  var prof_uid;

  //cache dom
  $section = $('#prof-main-info');

  $profUid = $section.find('.profuid');

  $profImg = $section.find('.prof-img-bg');
  $profProfession = $section.find('.prof-professions');
  $profName = $section.find('.prof-name');
  $profLocation = $section.find('.prof-location');
  $profStars = $section.find('.prof-prof-stars');
  $profDesc = $section.find('.full-description');

  var $favourites = $('.save-to-favorite');


  $btnContact = $section.find('.sendMessage');

  $profUid = $section.find('.profuid');


  //bind events
  $btnContact.on('click', _goToChat);
  $favourites.find('i').on('click', _toggleFavourite);


  //init
  function init(data) {
    _fillData(data);
  }

  //functions
  function _fillData(data) {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");

    prof_uid = uid;

    $profUid.val(uid);

    $profImg.css('background', `url(${data.profile.prof_img_url})`);
    $profProfession.html(data.professions.objProfService.map(prof => `<span>${prof._prof_name}</span>`).join("- &nbsp;"));
    $profName.html(data.profile.name + ' ' + data.profile.surname);
    $profLocation.html(data.profile.location.address);
    $profStars.find('span').html(data.reviews);
    $profDesc.find('p').html(data.profile.description);
    $profStars.find('.number-stars').rateYo({
      rating: data.stars,
      starWidth: "24px",
      spacing: "1px",
      readOnly: true,
      ratedFill: "#FBBB3E",
      normalFill: "#cdcdcd"
    });

    _setFavourite(uid);

  }

  function _goToChat() {
    console.log(firebase.auth().currentUser.uid);
    var room = firebase.auth().currentUser.uid + '-' + $profUid.val();
    window.location.replace(lnk.pgMessages + `?room=${room}`);
  }


  async function _toggleFavourite() {
    $(this).css('pointer-events', 'none');
    $("i,span").toggleClass("press", 1000);
    if (!$(this).hasClass('press')) {
      //remove from favourite
      await dbProfile.removeFromFavourite(uid);
      $(this).css('pointer-events', 'auto');
      return;
    } else {
      //add to favourite
      await dbProfile.addToFavourite(uid);
      $(this).css('pointer-events', 'auto');
      return;
    }
  }

  async function _setFavourite(uid) {
    var isFavourite = await dbProfile.isMyFavourite(uid);
    if (isFavourite) {
      $favourites.find('i').addClass('press');
    }
  }



  return {
    init: init
  }

})();