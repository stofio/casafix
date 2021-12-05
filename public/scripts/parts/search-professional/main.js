/**
 * here we use PHP to save SESSION of the search
 */
var main = (function() {

  dataFilter = {
    profession: "",
    services: [],
    location: {
      place: '',
      region: '',
      lat: 45.3,
      lng: 10.2
    },
    range: 50,
    sort: 'distance',
  };

  //cache dom
  $section = $('#search-page');
  $professionFilter = $section.find('#sel-side-prof');
  $servContainer = $section.find('#servicesContainer');
  $sortFilter = $section.find('#sortFilter');
  $placeName = $section.find('#place-name');
  $range = $('#range');

  //bind events
  $(document).on('load', _init());
  $professionFilter.on('change', changeFilterProfession);
  $(document).on('change', '.subserviceItem', changeFilterServices);
  $sortFilter.on('change', changeSorting);
  $range.find('li').on('click', changeRange);

  //init
  function _init() {
    var url_string = window.location.href
    var url = new URL(url_string);

    var lat = url.searchParams.get("lat") * 1;
    var lng = url.searchParams.get("lng") * 1;
    var pl = url.searchParams.get("pl");
    var srv = url.searchParams.get("srv");
    var prf = url.searchParams.get("prf");

    if (pl == '' || pl == null) {
      $('.searched-location').remove();
      $('#sort-prof').remove();
      $('#sidebarFilter').remove();
      $('#listProf').append('<h4 class="no-results">Per visualizzare i professionisti, <br> seleziona prima una località nella barra di ricerca in alto</h4>');
      return;
    }

    dataFilter.location.lat = lat;
    dataFilter.location.lng = lng;
    dataFilter.location.place = pl;
    dataFilter.profession = prf;
    if (srv !== "") {
      dataFilter.services.push(srv);
    }

    selectProfession(prf);

    //tutta italia
    if (pl == 'Italia') {
      setTuttaItalia();
      sortDropdown.disableSortByDistance();
    } else {
      setPlace(pl);
    }
    listProfessionals.renderList(dataFilter);
  }

  function selectProfession(profession) {
    setTimeout(() => {
      $professionFilter.val(profession).trigger('change');
      $.each(dataFilter.services, (i, serv) => {
        console.log(serv)
        $servContainer.find(`input[type=checkbox][value='${serv}']`).prop('checked', true);
      })
    }, 2000);
  }

  function setPlace(place) {
    if (place == '') {
      $placeName.html('-');
    } else {
      $placeName.html(place.replace('Italia', ''));
    }
  }

  function setTuttaItalia() {
    $section.find('.searched-location h1').html('Professionisti in Italia');
  }


  //functions
  function changeFilterProfession() {
    _blockInputs();
    var $selected = $(this).val();
    dataFilter.profession = $selected;
    listProfessionals.renderList(dataFilter)
      .then(_unblockInputs());
  }

  function changeFilterServices() {
    _blockInputs();
    var s = [];
    $('.subserviceItem').filter(':checked').each((i, item) => {
      s.push(item.value);
    });
    dataFilter.services = s;
    listProfessionals.renderList(dataFilter)
      .then(_unblockInputs());
  }

  function changeSorting() {
    _blockInputs();
    dataFilter.sort = $sortFilter.val();
    listProfessionals.renderList(dataFilter)
      .then(_unblockInputs());
  }

  function changeRange() {
    _blockInputs();
    var range = $(this).html().replace('km', '') * 1;
    dataFilter.range = range;
    listProfessionals.renderList(dataFilter)
      .then(_unblockInputs());
  }




  function _blockInputs() {
    sortDropdown.blockSortDropdown();
    filterSidebar.blockFilterSidebar();
  }

  function _unblockInputs() {
    sortDropdown.unblockSortDropdown();
    filterSidebar.unblockFilterSidebar();
  }



})();