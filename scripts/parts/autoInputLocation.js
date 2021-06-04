var dbSett = (function() {

  var geocodingClient = mapboxSdk({ accessToken: 'pk.eyJ1Ijoic3RvZmlvIiwiYSI6ImNrZ3duNHhmdDA0MnoycXBmYWVlYjJtMHgifQ.eS9K2EYvkEEDASW4SBEjdQ' });

  function autocompleteSuggestionMapBoxAPI(inputParams, callback) {
    geocodingClient.geocoding.forwardGeocode({
        query: inputParams,
        countries: ['IT'],
        language: ['IT'],
        autocomplete: true,
        limit: 5,
        //types: ['region', 'district', 'place', 'locality', 'neighborhood']
      })
      .send()
      .then(response => {
        const match = response.body;
        callback(match);
      });
  }

  function autocompleteInputBox(inp) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);

      // suggestion list MapBox api called with callback
      autocompleteSuggestionMapBoxAPI($('#location').val(), function(results) {
        results.features.forEach(function(key) {
          var region = '';
          $.each(key.context, (i, value) => {
            //console.log(value.id);
            if (value.id.indexOf('region') >= 0) {
              region = value.text_IT;
            }
          });
          b = document.createElement("DIV");
          b.innerHTML = key.place_name.substr(0, val.length);
          b.innerHTML += key.place_name.substr(val.length);
          b.innerHTML += "<input type='hidden' data-lat='" + key.geometry.coordinates[1] + "' data-lng='" + key.geometry.coordinates[0] + "' data-region='" + region + "'  value='" + key.place_name + "'>";
          b.addEventListener("click", function(e) {
            let lat = $(this).find('input').attr('data-lat');
            let long = $(this).find('input').attr('data-lng');
            let region = $(this).find('input').attr('data-region');
            inp.value = $(this).find('input').val();
            $(inp).attr('data-lat', lat);
            $(inp).attr('data-lng', long);
            $(inp).attr('data-region', region);
            disableInputAndShowX(inp);
            closeAllLists();
          });
          a.appendChild(b);
        });
      })
    });


    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });

    $(inp).on('focusout', () => {
      //if lat and long are not set, empty input
      if ($(inp).attr('data-lat') == '' || $(inp).attr('data-lng') == '') {
        $(inp).val('');
      }
    })

    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
      closeAllLists(e.target);
    });

    //enable disable input
    function disableInputAndShowX(inp) {
      $(inp).nextAll('.rmv').show().addClass('rmvActive');
      $(inp).prop('disabled', true);
    }

    function enableInputAndHideX(inp) {
      $(inp).nextAll('.rmv').hide().removeClass('rmvActive');
      $(inp).prop('disabled', false);
    }



    $('.autocomplete-input .rmv').on('click', (el) => {
      console.log($(el))
      $('#location').attr('data-lat', '');
      $('#location').attr('data-lng', '');
      $('#location').attr('data-region', '');
      $('#location').val('');
      $('#location').parent().find('.inp-text').html('');
      enableInputAndHideX('#location');
    })


  }

  $("#location").attr("autocomplete", "off");
  autocompleteInputBox(document.getElementById("location"));



})();