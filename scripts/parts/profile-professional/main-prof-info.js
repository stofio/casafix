var profProfMainInfo = (function() {

  //cache dom
  $section = $('#prof-main-info');

  $profUid = $section.find('.profuid');

  $profImg = $section.find('.prof-img-bg');
  $profProfession = $section.find('.prof-professions');
  $profName = $section.find('.prof-name');
  $profLocation = $section.find('.prof-location');
  $profStars = $section.find('.prof-prof-stars');
  $profDesc = $section.find('.full-description');


  $btnContact = $section.find('.sendMessage');

  $profUid = $section.find('.profuid');


  //bind events
  $btnContact.on('click', _goToChat);


  //init
  function init(data) {
    _fillData(data);
  }

  //functions
  function _fillData(data) {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");

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
  }

  function _goToChat() {
    console.log(firebase.auth().currentUser.uid);
    var room = firebase.auth().currentUser.uid + '-' + $profUid.val();
    window.location.replace(lnk.pgMessages + `?room=${room}`);
  }



  return {
    init: init
  }

})();