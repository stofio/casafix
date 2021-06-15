var popup = (function() {

  dataFilter = {
    profession: "Elettricista",
    services: ["imballaggio"],
    location: {
      place: '',
      region: 'provincia di Verona',
      lat: 0,
      lng: 0
    },
    sort: 'new',
  };

  //cache dom

  $section = $('#search-page');
  $professionFilter = $section.find('#sel-side-prof');
  $sortFilter = $section.find('#sortFilter');

  //bind events
  $(document).on('load', _init());
  $professionFilter.on('change', changeFilterProfession);
  $(document).on('change', '.subserviceItem', changeFilterServices);
  $sortFilter.on('change', changeFilterProfession);

  //init
  function _init() {

    listProfessionals.renderList(dataFilter);
  }


  //functions
  function changeFilterProfession() {}

  function changeFilterServices() {}

  function changeSort() {}









  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
    return false;
  };



  function _blockInputs() {
    sortDropdown.blockSortDropdown();
    filterSidebar.blockFilterSidebar();
  }

  function _unblockInputs() {
    sortDropdown.unblockSortDropdown();
    filterSidebar.unblockFilterSidebar();
  }




  return {

  }

})();