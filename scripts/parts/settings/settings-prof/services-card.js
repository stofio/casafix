(function() {

  var uid;

  var servicesJson = {};
  var currentData;


  var selectedServices = [];


  //cache dom
  var $box = $('#professionsAndServices');
  var $addNewBtn = $box.find('#addProf');
  var $modifyContainer = $box.find('.modifyContainer');
  var $saveContainer = $box.find('.saveContainer');


  //bind events
  $(document).on('load', _loadCard());
  $(document).on('click', '.modifyBtnProf', _changeToModifyMod);
  $(document).on('click', '.saveBtnProf', _saveData);
  $(document).on('click', '.cancBtnProf', _cancelInputs);
  $('.select-prof').on('change', _changeSelect);
  $(document).on('click', '.services-container li', _toggleService);
  $addNewBtn.on('click', _addNewProfession);
  $(document).on('click', '.remove', _removeProfession);
  $(document).on('input', '.other-services input', _toggleInput);


  //init
  async function _loadCard() {
    uid = await dbProfSett.getTheUid();
    $box.find('.inp-text').hide();
    _initializeSelect();
    _getServicesJson()
      .then(obj => {
        servicesJson = obj;
        _fillSelectBoxes();
        _getData()
          .then((myProfession) => {
            currentData = myProfession;
            if (currentData) {
              _fillData(myProfession);
            }
            _renderTextAndBtn();
          });
      }).catch(e => console.log(e));
  }


  //functions
  function _initializeSelect() {
    $box.find('select').select2({
      placeholder: "Professione",
      language: {
        noResults: function(params) {
          return "Nessun risultato trovato";
        }
      }
    });
    $('.select-prof').one('select2:open', function(e) {
      $('input.select2-search__field').prop('placeholder', '🔎︎');
    });
  }

  function _renderTextAndBtn() {
    _renderModifyButton();
    _renderText();
  }

  function _renderSaveButton() {
    var btn = `<button class="def-btn saveBtnProf"">Salva</button>
               <span class="cancel-btn cancBtnProf">cancella</span>`;
    $saveContainer.html(btn);
    $modifyContainer.html('');
  }

  function _renderModifyButton() {
    var btn = `<div class="edit-pen modifyBtnProf">Modifica</div>`;
    $modifyContainer.html(btn);
    $saveContainer.html('');
  }

  function _changeToModifyMod() {
    _renderSaveButton();
    _renderInputs();
  }

  function _changeToTextMode($cont) {
    _renderModifyButton();
    _renderText();
  }

  //on event click
  function _cancelInputs() {
    $cont = $(this).closest('.profile-box');
    _fillData(currentData);
    _changeToTextMode();
  }

  //hide input show text
  function _renderText() {
    $box.find('.other-services input:empty').filter(function() { return this.value !== ""; })
      .prop('disabled', true).css('pointer-events', 'none');
    $box.find('.other-services input:empty').filter(function() { return this.value == ""; }).parent()
      .hide();
    $box.find('.services-container li').filter(function() { return $(this).hasClass('active') })
      .prop('disabled', true).css('pointer-events', 'none').addClass('toText');
    $box.find('.services-container li').filter(function() { return !$(this).hasClass('active') })
      .hide();

    $box.find('.select2').hide();
    $box.find('.set-counter').hide();
    $box.find('.inp-text').show();

    $.each($box.find('.prof-box-body-profession'), (i, box) => {
      if ($(box).find('select').val() == null) {
        $(box).hide();
      }
    })

    $box.find('.add-prof-box').hide();
    $box.find('.remove').hide();
  }

  function _renderInputs() {
    $box.find('.other-services input').prop('disabled', false).css('pointer-events', 'auto');
    $box.find('.other-services input').parent().show();
    $box.find('.services-container li').prop('disabled', false).css('pointer-events', 'auto').removeClass('toText');
    $box.find('.services-container li').show();

    $box.find('.select2').show();
    $box.find('.set-counter').show();
    $box.find('.inp-text').hide();

    $box.find('.add-prof-box').show();
    $box.find('.remove').show();
  }

  function _saveData() {
    var profs = createDataObj();
    if (JSON.stringify(profs) === JSON.stringify(currentData)) {
      _changeToTextMode();
      return;
    } else {
      _loadingButtonOn();
      dbProfSett.saveProfession(uid, profs)
        .then(() => {
          currentData = profs;
          _fillData(profs);
          _changeToTextMode();
          _loadingButtonOff();
          return;
        });

    }
  }

  function _loadingButtonOn() {
    var $btn = $box.find('.saveBtnProf');
    $btn.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
    $btn.html('Salva...');
  }

  function _loadingButtonOff() {
    var $btn = $box.find('.saveBtnProf');
    $btn.attr('disabled', false).css('opacity', 1).css("pointer-events", "auto");
    $btn.html('Salva');
  }

  //return object of services
  function createDataObj() {
    var obj = [];
    var arrayProfessions = [];
    var arrayServices = [];
    var boolServices = {};
    //each profession box get data and push to obj
    $.each($box.find('.prof-box-body-profession'), (i, prof) => {
      var profession = '';
      var selectedServ = [];
      var otherServ = [];
      var isServiceObj = {};
      if (i == 3) return;
      //get profession
      profession = $(prof).find('select').val();
      if (profession !== null) {
        //get other services
        $(prof).find('.other-services input').filter(function() { return this.value !== ""; })
          .each((i, item) => {
            if (i == 4) return;
            otherServ.push($(item).val());
          })
          //get selected services
        $(prof).find('.services-container li').filter(function() { return $(this).hasClass('active') })
          .each((i, item) => {
            selectedServ.push($(item).html());
            isServiceObj[$(item).html()] = true;
          })

        //remove items over max of 12
        if (selectedServ.length + otherServ.length > 12) {
          var selRemainingFree = 12 - otherServ.length;
          selectedServ.slice(0, selRemainingFree);
        }

        arrayProfessions.push(profession);
        arrayServices.push(...selectedServ);
        boolServices = isServiceObj;
        obj.push({
          "_prof_name": profession,
          "sel_serv": selectedServ,
          "other_serv": otherServ
        });
      }
    });
    return {
      arrayProfessions: arrayProfessions,
      selectedServices: boolServices,
      objProfService: obj
    }
    //return obj;
  }


  function _getData() {
    return new Promise((resolve) => {
      dbProfSett.getProfProfileData(uid).then((data) => {
        if (data) {
          currentData = data.professions;
        }
        resolve(currentData);
      });
    })
  }

  function _fillData(myProfession) {
    _emptyData();
    $.each(myProfession.objProfService, (i, prof) => {
      currProfBox = $box.find('.prof-box-body-profession')[i];
      if (!$(currProfBox).is(':visible')) $(currProfBox).show();
      $(currProfBox).find('select').val('').val(prof._prof_name).trigger('change');
      $(currProfBox).find('.inp-text').html(prof._prof_name);
      //fill the selection services
      $.each(prof.sel_serv, (i, item) => {
        $.each($(currProfBox).find('.services-container li'), (i, li) => {
          if ($(li).html() == item) {
            _incrementCounter($(currProfBox));
            $(li).addClass('active');
          }
        })
      });
      //fill the inputs
      $.each(prof.other_serv, (i, item) => {
        $(currProfBox).find('input:empty')
          .filter(function() { return this.value == ""; }).first().val(item).trigger('input');
      })
    })
  }

  function _emptyData() {
    $box.find('.services-container li').removeClass('active');
    $box.find('.other-services input').removeClass('active').val('');
  }

  //get all cat and subcat
  function _getServicesJson() {
    return new Promise((resolve, reject) => {
      //$.getJSON('https://firebasestorage.googleapis.com/v0/b/casafix2.appspot.com/o/categories%2Fservices.json?alt=media&token=f10cd9c9-e8f1-4255-9a70-1a5ae227f9c5', function(data) {
      $.getJSON('/services.json', function(data) {
        if (data == null || data == undefined) reject(new Error('Failed fetch json'));
        resolve(data);
      })
    });
  }


  function _fillSelectBoxes() {
    $.each($box.find('select'), (i, select) => {
      $.each(servicesJson, (prof, serv) => {
        var newOption = new Option(prof, prof, false, false);
        select.append(newOption);
      })
    })
  }


  function _changeSelect() {
    //disable this selected, not in this select
    var selected = $(this).val();
    $(this).parent().find('.inp-text').html(selected);
    $box.find('select').not(this).find('option:not(:first)').attr('disabled', false);
    $box.find('select').not(this).find(`option[value="${selected}"]`).attr('disabled', true);
    addSubcategories(selected, this);
  }

  function addSubcategories(selected, select) {
    if (select == '') {
      $(select).parent().find('.services-container').empty();
    }
    var a = servicesJson[selected];
    var ul = document.createElement('ul');
    $.each(a, (i, item) => {
      var li = document.createElement('li');
      li.innerHTML = item
      ul.append(li);
    })
    $(select).parent().find('.services-container').empty();
    $(select).parent().find('.services-container').append(ul);
    $(select).parent().find('.other-services').show();

  }

  function _toggleService() {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      _decrementCounter($(this).closest('.prof-box-body-profession'))
    } else {
      $(this).addClass('active');
      _incrementCounter($(this).closest('.prof-box-body-profession'))
    }
  }

  function _toggleInput() {
    if ($(this).val() && !$(this).hasClass('active')) {
      $(this).addClass('active');
      _incrementCounter($(this).closest('.prof-box-body-profession'))
    }
    if (!$(this).val() && $(this).hasClass('active')) {
      $(this).removeClass('active');
      _decrementCounter($(this).closest('.prof-box-body-profession'))
    }
  }

  function _incrementCounter($cont) {
    var currNum = parseInt($cont.find('.counter').val());
    $cont.find('.counter').val(currNum + 1)
    $cont.find('.set-counter b').html(currNum + 1)
    if ($cont.find('.counter').val() == 12) {
      _blockMoreInputs($cont);
    }
  }

  function _decrementCounter($cont) {
    var currNum = parseInt($cont.find('.counter').val());
    $cont.find('.counter').val(currNum - 1)
    $cont.find('.set-counter b').html(currNum - 1)
    if ($cont.find('.counter').val() < 12) {
      _allowMoreInputs($cont);
    }
  }

  function _blockMoreInputs($cont) {
    $cont.find('input:empty').filter(function() { return this.value == ""; })
      .prop('disabled', true).css('pointer-events', 'none');
    $cont.find('.services-container li').filter(function() { return !$(this).hasClass('active') })
      .prop('disabled', true).css('pointer-events', 'none');
  }

  function _allowMoreInputs($cont) {
    $cont.find('input:empty').filter(function() { return this.value == ""; })
      .prop('disabled', false).css('pointer-events', 'auto');
    $cont.find('.services-container li').filter(function() { return !$(this).hasClass('active') })
      .prop('disabled', false).css('pointer-events', 'auto');
  }

  function _addNewProfession() {
    $box.find('.prof-box-body-profession:hidden:first').slideDown();
    _hideShowNewProfBtn()
  }

  function _removeProfession() {
    $(this).closest('.prof-box-body-profession').find('input').val('').removeClass('active').prop('disabled', false);
    $(this).closest('.prof-box-body-profession').find('.counter').val('0');
    var select = $(this).closest('.prof-box-body-profession').find('select');
    select.val([]);
    select.val('0').trigger('change');
    $(this).closest('.prof-box-body-profession').hide(() => {
      _hideShowNewProfBtn()
    });
    $(this).closest('.prof-box-body-profession').find('.other-services').hide();
  }

  function _hideShowNewProfBtn() {
    if ($box.find('.prof-box-body-profession:visible').length == 3) {
      $addNewBtn.slideUp();
    } else {
      $addNewBtn.slideDown();
    }
  }









})();