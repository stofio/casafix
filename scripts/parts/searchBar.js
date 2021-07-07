/**
 * here we use PHP to save SESSION of the search
 */
var searchBar = (function() {

  var servicesJson = {};

  //cache dom
  var $bar = $('#searchBar');
  var $select = $bar.find('select');
  var $inpLocation = $bar.find('#location');
  var $searchBtn = $bar.find('#searchBtn');

  //bind events
  $(document).on('load', _loadSearch());
  $searchBtn.on('click', _search);
  $(document).on('click', (e) => {
    if (!e.target.matches('#searchBtn, #searchBtn *')) {
      _removeLocationMandatory();
    }
  });

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
    if (!_validated()) { return; }
    if ($searchBtn.hasClass('deactivated')) {
      _openSearch();
      e.preventDefault();
      return;
    } else {
      var lat = $inpLocation.attr('data-lat');
      var lng = $inpLocation.attr('data-lng');
      var pl = $inpLocation.val();
      var selected = $select.val();

      var srv = '';
      var prf = '';


      $.each(servicesJson, (i, prof) => {
        if (i == selected) {
          prf = selected;
        }
        $.each(prof, (a, serv) => {
          //console.log(i, serv)
          if (serv == selected) {
            srv = serv;
            prf = i;
            return;
          }
        })
      })
      window.location.href = lnk.pgCercaProf + `?lat=${lat}&lng=${lng}&pl=${pl}&srv=${srv}&prf=${prf}`;
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

  function _validated() {
    if ($searchBtn.hasClass('deactivated')) return true;
    if ($inpLocation.val() == "") {
      _removeLocationMandatory();
      _showLocationMandatory();
      return false;
    } else {
      return true;
    }
  }

  function _showLocationMandatory() {
    $('#searchBar').append('<div class="loc-err">Per iniziare la ricerca seleziona prima una località</div>')
  }

  function _removeLocationMandatory() {
    $('.loc-err').remove();
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

  function blockSearchBar() {
    $bar.find('select').attr("disabled", "disabled").css('pointer-events', 'none');
    $bar.find('input').attr("disabled", "disabled").css('pointer-events', 'none');
    $bar.find('button').attr("disabled", "disabled").css('pointer-events', 'none');
  }

  function unblockSearchBar() {
    $bar.find('select').removeAttr('disabled').css('pointer-events', 'auto');
    $bar.find('input').removeAttr('disabled').css('pointer-events', 'auto');
    $bar.find('button').removeAttr('disabled').css('pointer-events', 'auto');
  }


  return {
    blockSearchBar: blockSearchBar,
    unblockSearchBar: unblockSearchBar
  }

})();