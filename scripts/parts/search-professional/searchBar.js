var searchBar = (function() {

  var servicesJson = {};

  //cache dom
  var $bar = $('#searchBar');
  var $select = $bar.find('select');
  var $inpLocation = $bar.find('#inpLocation');
  var $searchBtn = $bar.find('#searchBtn');

  //bind events
  $(document).on('load', _loadSearch());
  $searchBtn.on('click', _search);

  //init
  function _loadSearch() {
    if ($bar.hasClass('mobile-closing')) _closeSearch();
    _initializeSelect();
    _getServicesJson()
      .then(servObj => {
        _fillSelect(servObj);
      });
  }

  //functions
  function _search(e) {
    if ($searchBtn.hasClass('deactivated')) {
      _openSearch();
      e.preventDefault();
      return;
    } else {
      //go to search page with url service and place
    }
  }


  function _initializeSelect(callback) {
    $select.select2({
      placeholder: "Cerca servizi",
      language: {
        noResults: function(params) {
          return "Nessun risultato trovato";
        }
      },
      templateResult: function(data, container) {
        if (data.element) {
          $(container).addClass($(data.element).attr("class"));
        }
        return data.text;
      }
    });
    $('#sel-search-prof').one('select2:open', function(e) {
      $('input.select2-search__field').prop('placeholder', '🔎︎');
    });
  }

  //get all cat and subcat
  function _getServicesJson() {
    return new Promise((resolve, reject) => {
      //$.getJSON('https://firebasestorage.googleapis.com/v0/b/casafix2.appspot.com/o/categories%2Fservices.json?alt=media&token=f10cd9c9-e8f1-4255-9a70-1a5ae227f9c5', function(data) {
      $.getJSON('/services.json', function(data) {
        if (data == null || data == undefined) reject(new Error('Failed fetch json'));
        servicesJson = data;
        resolve(data);
      })
    });
  }

  function _fillSelect(servicesJson) {
    $.each(servicesJson, (serv, subservArr) => {
      var newOption = new Option(serv, serv, false, false);
      $(newOption).addClass('boldBigService');
      $select.append(newOption);
      $.each(subservArr, (i, subserv) => {
        var newSubOption = new Option(subserv, subserv, false, false);
        $(newSubOption).addClass('smallSubservice');
        $select.append(newSubOption);
      })
    })
  }

  function _openCloseSearch() {

  }

  function _openSearch() {
    $bar.find('.search-inputs').slideDown();
    $searchBtn.removeClass('deactivated');

  }

  function _closeSearch() {
    if ($(window).width() <= 768) {
      $bar.find('.search-inputs').slideUp();
      $searchBtn.addClass('deactivated');
    }
  }


  return {

  }

})();