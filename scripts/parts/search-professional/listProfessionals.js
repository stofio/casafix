var listProfessionals = (function() {


  //cache dom
  var $profList = $('#listProf');

  $profList.find('.number-stars').rateYo({
    rating: 3,
    starWidth: "18px",
    spacing: "1px",
    readOnly: true,
    ratedFill: "#FBBB3E",
    normalFill: "#cdcdcd"
  });

  //bind events
  $(document).on('load', _loadList);

  //init
  function _loadList() {

  }

  //functions
  function renderList() {
    //get par from url
    // else if 
    // else if 
    // else if 
    // else if 
  }




  return {
    renderList: renderList
  }

})();