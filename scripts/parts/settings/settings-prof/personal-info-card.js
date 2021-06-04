(function() {

  var uid;

  //cache dom
  var $box = $('#descriptionInfo');

  var $modifyContainer = $box.find('.modifyContainer');
  var $saveContainer = $box.find('.saveContainer');


  var currentData = {
    //prof_img_url = '',
    birth_date: '',
    description: '',
    prof_img_url: '',
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
    uid = await dbSett.getTheUid();
    $box.find('.inp-text').hide();
    $box.find('input, textarea, #changeImg').hide();
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
  }

  //hide input show text
  function _renderText() {
    $box.find('.inp-text').show();
    $box.find('input, textarea, #changeImg').hide();
  }

  function _getData() {
    return new Promise((resolve) => {
      dbSett.getProfProfileData(uid).then((data) => {
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
    _fillInput('#description', obj.description);
    _setProfImageUrl(obj.prof_img_url);
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
    var obj = {
        birth_date: $box.find('#birthDate').val(),
        description: $box.find('#description').val(),
        prof_img_url: $box.find('.prof-my-img').attr('attr-img'),
      }
      //compare if data is the same
    if (JSON.stringify(obj) === JSON.stringify(currentData)) {
      _changeToTextMode();
      return;
    } else {
      _loadingButtonOn();
      await dbSett.saveProfDescInfo(uid, obj);
      currentData = obj;
      _fillData(obj);
      _changeToTextMode();
      _loadingButtonOff();
      return;
    }
  }

  function _loadingButtonOn() {
    var $btn = $box.find('.saveBtnDesc');
    $btn.attr('disabled', true).css('opacity', .5);
    $btn.html('Salva...');
  }

  function _loadingButtonOff() {
    var $btn = $box.find('.saveBtnDesc');
    $btn.attr('disabled', false).css('opacity', 1);
    $btn.html('Salva');
  }

  function _changeImage() {
    $box.find('#changeImgInput').trigger('click');
  }

  async function _uploadImage() {
    $box.find('#changeImgInput').attr('disabled', true);
    _loadingButtonOn();
    var uploadedImage = this.files[0];
    dbSett.uploadProfImage(uid, uploadedImage)
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
      dbSett.saveProfImageUrl(uid, url);
      resolve();
    })
  }


})();