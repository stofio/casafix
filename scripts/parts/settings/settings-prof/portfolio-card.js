(function() {

  var uid;
  var limitImageSize = 2097152; // 2 MiB for bytes.

  //cache dom
  var $box = $('#portfolio');
  var $popup = $('#add-new-work-img');


  //bind events
  $(document).on('load', _loadCard());
  $box.find('.newPortfItem').on('click', _popupNewImg);
  $(document).on('click', '.port-del', _deletePortImg);
  $(document).on('click', '.port-mod', _editPortImg);

  $popup.find('#newWorkImage').on('click', _newImg);
  $popup.find('#newWorkImageInput').on('change', _uploadImage);
  $popup.find('.cancBtnNewWork').on('click', _cancelUploadImage);
  $popup.find('.saveBtnNewWork').on('click', _saveImage);




  //init 
  async function _loadCard() {
    _disableSaveBtn();
    uid = await dbSett.getTheUid();
    _getData()
      .then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            _addToPortfolio(doc.id, doc.data().img_url, doc.data().img_title);
            console.log(doc)
          });
        }
      })
  }

  // $('h2').on('click', () => {
  //   $('.slide-images').append(`
  //           <img src="/images/test/1.jpg">
  //           <img src="/images/test/2.jpg">
  //           <img src="/images/test/3.jpg">
  // `);
  //   $('.slide-images').fotorama()
  // })


  //function
  function _popupNewImg() {
    popup.showPopup('#add-new-work-img');
  }


  function _disableSaveBtn() {
    var $btn = $popup.find('.saveBtnNewWork');
    $btn.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
  }

  function _enableSaveBtn() {
    var $btn = $popup.find('.saveBtnNewWork');
    $btn.attr('disabled', false).css('opacity', 1).css("pointer-events", "auto");
  }


  function _loadingButtonOn() {
    var $btn = $popup.find('.saveBtnNewWork');
    $btn.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
    $btn.html('Salva...');
  }

  function _loadingButtonOff() {
    var $btn = $popup.find('.saveBtnNewWork');
    $btn.attr('disabled', false).css('opacity', 1).css("pointer-events", "auto");
    $btn.html('Salva');
  }

  function _newImg() {
    $popup.find('#newWorkImageInput').trigger('click');
  }

  function _uploadImage() {
    var uploadedImage = this.files[0];
    if (uploadedImage == null) {
      _disableSaveBtn();
      $popup.find('.preview-work-image').css('background', ``)
      $popup.find('.preview-work-image').hide();
      $popup.find('#newWorkImage').html('Seleziona');
      return;
    }
    _enableSaveBtn();
    var fileType = uploadedImage["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
      alert('Puoi caricare solo immagini, riprova!');
      return;
    }
    if (uploadedImage.size > limitImageSize) {
      alert("La dimensione dell'immagine deve essere inferiore a 2MiB, riprova!");
      return;
    }
    var prevUrl = URL.createObjectURL(uploadedImage)
    $popup.find('.preview-work-image').css('background', `url(${prevUrl})`)
    $popup.find('.preview-work-image').show();
    $popup.find('#newWorkImage').html('Cambia');
  }

  function _cancelUploadImage() {
    $popup.find('.preview-work-image').css('background', ``)
    $popup.find('.preview-work-image').hide();
    $popup.find('#newWorkImage').html('Seleziona');
    $popup.find('#newWorkImageInput').val(null).trigger('change');
    $popup.find('#workImgTitle').val('');
    popup.hidePopup();
  }

  function _saveImage() {
    $popup.find('#newWorkImageInput').attr('disabled', true);
    $popup.find('#workImgTitle').attr('disabled', true);
    var image = $popup.find('#newWorkImageInput').prop('files')[0];
    var title = $popup.find('#workImgTitle').val();
    if (image == null) return;
    _loadingButtonOn()
    dbSett.uploadWorkImg(uid, image)
      .then((url) => {
        _saveImageDb(uid, url, title)
          .then((docId) => {
            _loadingButtonOff();
            _addToPortfolio(docId, url, title);
            _cancelUploadImage();
            $popup.find('#newWorkImageInput').attr('disabled', false);
            $popup.find('#workImgTitle').attr('disabled', false);
          })
      })
  }

  function _saveImageDb(uid, url, title) {
    return new Promise((resolve) => {
      dbSett.saveWorkImageDb(uid, url, title).then(docId => {
        resolve(docId);
      });
    })
  }

  function _addToPortfolio(docId, url, title) {
    var tmp = `<div class="col-md-4 col-6  portfolio-item">
                  <div class="portfolio-front-img" data-imgid=${docId} style="background-image:url(${url})">
                    <div class="mod-port-item">
                      <div class="port-mod"></div>
                      <div class="port-del"></div>
                    </div>
                  </div>
                  <strong>${title}</strong>
              </div>`
    $box.find('.portfolio-list').append(tmp);
  }

  function _getData() {
    return new Promise((resolve) => {
      dbSett.getPortfolioData(uid).then((querySnapshot) => {
        resolve(querySnapshot);
      });
    })
  }

  function _deletePortImg() {
    var imgTitle = $(this).closest('.portfolio-item').find('strong').html();
    popup.yesNoPopup(`Vuoi eliminare l'immagine ${imgTitle}?`, () => {
      var imgId = $(this).closest('.portfolio-front-img').attr('data-imgid');
      var imgUrl = $(this).closest('.portfolio-front-img').css('background-image').slice(4, -1).replace(/"/g, "");
      dbSett.deleteImage(imgUrl)
        .then(() => {
          dbSett.deleteImgId(imgId, uid)
            .then(() => {
              $(this).closest('.portfolio-item').remove();
            })
        });
    });
  }

  function _editPortImg() {
    var imgTitle = $(this).closest('.portfolio-item').find('strong');
    popup.inputPopup('Modifica titolo', imgTitle.html(), (newTitle) => {
      var imgId = $(this).closest('.portfolio-front-img').attr('data-imgid');
      dbSett.modifyTitlePortImg(uid, imgId, newTitle)
        .then(() => {
          imgTitle.html(newTitle);
        })
    })
  }








})();