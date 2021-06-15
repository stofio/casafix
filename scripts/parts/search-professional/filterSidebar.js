var filterSidebar = (function() {

  var servicesJson = {};

  //services checked
  var checked = [];
  var maxChecked = 3;

  //cache dom
  var $sidebar = $('#sidebarFilter');
  var $dropdownServices = $sidebar.find('select');
  var $servicesContainer = $sidebar.find('#servicesContainer');

  //bind events
  $(document).on('load', _loadSidebar());
  $dropdownServices.on('change', setServiceFilter);
  $(document).on('change', '.subserviceItem', _setSubserviceFilter);

  $(window).on('resize', _setMobileFiltersSidebar);
  $('#sidebarFilter h3').on('click', openCloseSwap);

  //init
  function _loadSidebar() {
    _initializeSelect();
    _getServicesJson()
      .then(servObj => {
        _fillSelect(servObj);
      });
  }

  //functions
  function setServiceFilter() {
    $servicesContainer.empty();
    var $selected = $(this).val();
    $.each(servicesJson, (serv, subArr) => {
      if (serv == $selected) {
        $.each(subArr, (i, val) => {
          console.log(val)
          var r = `<div class="radio-cont">
                    <input class="subserviceItem" type="checkbox" id="${val.replace(/\s+/g, '-').toLowerCase()}" name="services" value="${val}">
                    <label class="side-label" for="${val.replace(/\s+/g, '-').toLowerCase()}">${val}</label><br>
                   </div>`;
          $servicesContainer.append(r);
        })
        return;
      }
    })

    //set service par to url
    //render subservices
    //RENDER LIST
  }

  function _setSubserviceFilter(e) {
    _limitChecked(e);
    console.log(checked)
      //set subservice par to url
      //RENDER LIST
  }


  function _initializeSelect(callback) {
    $dropdownServices.select2({
      minimumResultsForSearch: -1,
      placeholder: "Filtra professione",
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
      $dropdownServices.append(newOption);
    })
  }

  function _setMobileFiltersSidebar() {
    if ($(window).width() > 768) {
      openCloseSwap();
    }
  }


  function _setMaxHeightSubservicesContainer() {
    var contFilterHeight = $('.mobile-filter-swap').outerHeight();
    var servContainerHeight = contFilterHeight - (48 * 2) - 30; //48 height of h3 in css, 30 is padding
    $('#servicesContainer').height(servContainerHeight);
  }

  function openCloseSwap() {
    if ($(window).width() <= 768) {
      _setMaxHeightSubservicesContainer(); //run this first time
      var swap = $('.mobile-filter-swap');
      if (swap.hasClass('active')) {
        swap.css('transform', 'translate(0, calc(100% - 48px))');
        $('.mobile-filter-swap h3').removeClass('active');
        swap.removeClass('active');
        $('.mob-fil-overlay').remove();
      } else {
        swap.css('transform', 'translate(0)');
        $('.mobile-filter-swap h3').addClass('active');
        swap.addClass('active');
        swap.parent().append('<div class="mob-fil-overlay"></div>');
        $('.mob-fil-overlay').on('click', openCloseSwap)
      }
    }
  }

  function _limitChecked(e) {
    if ($(e.target).is(":checked")) {
      checked.push(e.target.id);
      if (checked.length > 3) {
        console.log('splice')
        checked.splice(0, 1);
      }
      $(".subserviceItem").prop("checked", false);
      for (var i = 0; i < checked.length; i++) {
        $("#" + checked[i]).prop("checked", true);
      }
    } else {
      var index = checked.indexOf(e.target.id);
      checked.splice(index, 1);
    }
  }

  $('h3').on('click', () => {
    console.log(checked)
  })


  function blockFilterSidebar() {
    $dropdownServices.attr("disabled", "disabled").css('pointer-events', 'none');
    $servicesContainer.find('input').attr("disabled", "disabled").css('pointer-events', 'none');
  }

  function unblockFilterSidebar() {
    $dropdownServices.removeAttr('disabled').css('pointer-events', 'auto');
    $servicesContainer.find('input').removeAttr('disabled').css('pointer-events', 'auto');
  }


  return {
    setServiceFilter: setServiceFilter,
    openCloseSwap: openCloseSwap,
    blockFilterSidebar: blockFilterSidebar,
    unblockFilterSidebar: unblockFilterSidebar
  }

})();