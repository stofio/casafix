var profProfMainInfo = (function() {

  //cache dom
  $section = $('#prof-main-info');

  $profImg = $section.find('.prof-img-bg');
  $profProfession = $section.find('.prof-professions');
  $profName = $section.find('.prof-name');
  $profLocation = $section.find('.prof-location');
  $profStars = $section.find('.prof-prof-stars');
  $profDesc = $section.find('.full-description');

  //bind events


  //init
  function init(data) {
    _fillData(data);
  }

  //functions
  function _fillData(data) {
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



  return {
    init: init
  }

})();