(function() {

  var uid;

  //cache dom
  var $box = $('#mainInfo');

  var $modifyContainer = $box.find('.modifyContainer');
  var $saveContainer = $box.find('.saveContainer');

  var currentData = {
    name: '',
    surname: '',
    contact_email: '',
    phone: '',
    location: {
      address: '',
      region: '',
      lat: '',
      lng: '',
    }
  };


  //bind events
  $(document).on('load', _loadCard());
  $(document).on('click', '.modifyBtnMain', _changeToModifyMod);
  $(document).on('click', '.saveBtnMain', _saveData);
  $(document).on('click', '.cancBtnMain', _cancelInputs);


  //init
  async function _loadCard() {
    uid = await dbProfSett.getTheUid();
    $box.find('.inp-text').hide();
    $box.find('input').hide();
    _getData()
      .then(() => {
        _renderTextAndBtn();
        _fillData(currentData);
      })
  }


  //functions
  function _renderTextAndBtn() {
    _renderModifyButton();
    _renderText();
  }

  function _renderSaveButton() {
    var btn = `<button class="def-btn saveBtnMain"">Salva</button>
               <span class="cancel-btn cancBtnMain">cancella</span>`;
    $saveContainer.html(btn);
    $modifyContainer.html('');
  }

  function _renderModifyButton() {
    var btn = `<div class="edit-pen modifyBtnMain">Modifica</div>`;
    $modifyContainer.html(btn);
    $saveContainer.html('');
  }


  function _changeToModifyMod() {
    _renderSaveButton();
    _renderInputs();
  }

  function _changeToTextMode() {
    _renderModifyButton();
    _renderText();
  }


  //hide text show input
  function _renderInputs() {
    $box.find('.inp-text').hide();
    $box.find('input').show();
    $box.find('.get-location-icon').show();
    if ($box.find('.rmv').hasClass('rmvActive')) {
      $box.find('.rmv').show();
    }
  }

  //hide input show text
  function _renderText() {
    $box.find('.inp-text').show();
    $box.find('input').hide();
    $box.find('.get-location-icon').hide();
    if ($box.find('.rmv').hasClass('rmvActive')) {
      $box.find('.rmv').hide();
    }
  }

  function _getData() {
    return new Promise((resolve) => {
      dbProfSett.getProfProfileData(uid).then((data) => {
        if (data) {
          currentData = data.profile;
        }
        resolve();
      });
    })
  }

  function _fillData(obj) {
    _fillInput('#name', obj.name);
    _fillInput('#surname', obj.surname);
    _fillInput('#email', obj.contact_email);
    _fillInput('#phone', obj.phone);
    _fillInput('#location', obj.location.address);
    if (obj.location.address) {
      $box.find('.rmv').show().addClass('rmvActive').hide();
      $box.find('.location-inp').prop('disabled', true);
      $box.find('#location').attr('data-lat', obj.location.lat);
      $box.find('#location').attr('data-lng', obj.location.lng);
      $box.find('#location').attr('data-region', obj.location.region);
    }
  }

  /**
   * fill the given input and text with value
   * @param {string} domId - id of element -> '#el' 
   * @param {*} val - value
   */
  function _fillInput(domId, val) {
    var $nameInp = $box.find(domId);
    var $nameTxt = $box.find(domId).parent().children('.inp-text');
    if (val == '' || val == null) {
      $nameTxt.html('-')
    } else {
      $nameTxt.html(val);
    }
    $nameInp.val(val);
  }

  function _cancelInputs() {
    _changeToTextMode();
    _fillData(currentData);
  }

  async function _saveData() {
    var lat = $box.find('#location').attr('data-lat');
    var lng = $box.find('#location').attr('data-lng');
    var region = $box.find('#location').attr('data-region');
    var obj = {
        name: $box.find('#name').val(),
        surname: $box.find('#surname').val(),
        contact_email: $box.find('#email').val(),
        phone: $box.find('#phone').val(),
        location: {
          address: $box.find('#location').val(),
          region: region,
          lat: lat,
          lng: lng,
        }
      }
      //compare if data is the same
    if (JSON.stringify(obj) === JSON.stringify(currentData)) {
      _changeToTextMode();
      return;
    } else {
      _loadingButtonOn();
      console.log(1)
      await dbProfSett.saveProfMainInfo(uid, obj);
      console.log(2)
      currentData = obj;
      _fillData(obj);
      _changeToTextMode();
      _loadingButtonOff();
      return;
    }
  }

  function _loadingButtonOn() {
    var $btn = $box.find('.saveBtnMain');
    $btn.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
    $btn.html('Salva...');
  }

  function _loadingButtonOff() {
    var $btn = $box.find('.saveBtnMain');
    $btn.attr('disabled', false).css('opacity', 1).css("pointer-events", "auto");
    $btn.html('Salva');
  }


})();