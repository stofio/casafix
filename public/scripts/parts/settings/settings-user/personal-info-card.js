(function() {

  var uid;
  var limitImageSize = 2097152; // 2 MiB for bytes.

  //cache dom
  var $box = $('#descriptionInfo');

  var $modifyContainer = $box.find('.modifyContainer');
  var $saveContainer = $box.find('.saveContainer');


  var currentData = {
    birth_date: '',
    prof_img_url: '',
    location: {
      address: '',
      region: '',
      lat: '',
      lng: '',
    }
  }

  //bind events
  $(document).on('load', _loadCard());
  $(document).on('click', '.modifyBtnDesc', _changeToModifyMod);
  $(document).on('click', '.saveBtnDesc', _saveData);
  $(document).on('click', '.cancBtnDesc', _cancelInputs);
  $(document).on('click', '#changeImg', _changeImage);
  $(document).on('change', '#changeImgInput', _uploadImage);


  //init
  async function _loadCard() {
    uid = await dbUserSett.getTheUid();
    $box.find('.inp-text').hide();
    $box.find('input, #changeImg').hide();
    _getData()
      .then(() => {
        _renderTextAndBtn();
        _fillData(currentData);
      })
  }


  //function
  function _renderTextAndBtn() {
    _renderModifyButton();
    _renderText();
  }

  function _renderSaveButton() {
    var btn = `<button class="def-btn saveBtnDesc"">Salva</button>
                 <span class="cancel-btn cancBtnDesc">cancella</span>`;
    $saveContainer.html(btn);
    $modifyContainer.html('');
  }

  function _renderModifyButton() {
    var btn = `<div class="edit-pen modifyBtnDesc">Modifica</div>`;
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
    $box.find('input, textarea, #changeImg').show();
    $box.find('.get-location-icon').show();
    if ($box.find('.rmv').hasClass('rmvActive')) {
      $box.find('.rmv').show();
    }
  }

  //hide input show text
  function _renderText() {
    $box.find('.inp-text').show();
    $box.find('input, #changeImg').hide();
    $box.find('.get-location-icon').hide();
    if ($box.find('.rmv').hasClass('rmvActive')) {
      $box.find('.rmv').hide();
    }
  }

  function _getData() {
    return new Promise((resolve) => {
      dbUserSett.getUserProfileData(uid).then((data) => {
        if (data) {
          currentData = data.profile;
        }
        resolve();
      });
    })
  }

  function _fillData(obj) {
    //_fillInput('#name', obj.prof_img_url);
    _fillInput('#birthDate', obj.birth_date);
    _setProfImageUrl(obj.prof_img_url);
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
        birth_date: $box.find('#birthDate').val(),
        description: $box.find('#description').val(),
        prof_img_url: $box.find('.prof-my-img').attr('attr-img'),
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
      await dbUserSett.saveUserDescInfo(uid, obj);
      currentData = obj;
      _fillData(obj);
      _changeToTextMode();
      _loadingButtonOff();
      return;
    }
  }

  function _loadingButtonOn() {
    var $btn = $box.find('.saveBtnDesc');
    $btn.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
    $btn.html('Salva...');
  }

  function _loadingButtonOff() {
    var $btn = $box.find('.saveBtnDesc');
    $btn.attr('disabled', false).css('opacity', 1).css("pointer-events", "auto");
    $btn.html('Salva');
  }

  function _changeImage() {
    $box.find('#changeImgInput').trigger('click');
  }

  async function _uploadImage() {
    $box.find('#changeImgInput').attr('disabled', true);
    var uploadedImage = this.files[0];
    if (uploadedImage == null) {
      _loadingButtonOn();
    }
    var fileType = uploadedImage["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    if ($.inArray(fileType, validImageTypes) < 0) {
      _loadingButtonOff();
      $box.find('#changeImgInput').attr('disabled', false);
      alert('Puoi caricare solo immagini, riprova!');
      return;
    }

    if (uploadedImage.size > limitImageSize) {
      _loadingButtonOff();
      $box.find('#changeImgInput').attr('disabled', false);
      alert("La dimensione dell'immagine deve essere inferiore a 2MiB, riprova!");
      return;
    }

    dbUserSett.uploadUserImage(uid, uploadedImage)
      .then((url) => {
        _setProfImageUrl(url)
        _saveImageUrl(uid, url)
          .then(() => {
            currentData.prof_img_url = url;
            $box.find('#changeImgInput').attr('disabled', false);
            _loadingButtonOff()
          })
      })

  }

  function _setProfImageUrl(url) {
    $box.find('.prof-my-img').css('background-image', `url(${url})`);
    $box.find('.prof-my-img').attr('attr-img', url);
  }

  function _saveImageUrl(uid, url) {
    return new Promise((resolve) => {
      dbUserSett.saveUserImageUrl(uid, url);
      resolve();
    })
  }


})();