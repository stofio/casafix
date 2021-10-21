var profProfReviews = (function() {

  //var professionalUid = 'QXH2GMtvtSOpk1qAaDjVuMriQtS2';
  var professionalUid;
  var currentUserUid;

  var limitImageSize = 2097152; // 2 MiB for bytes
  var arrayPhotos = [];

  var professionalData;
  var currentUserData;

  //cache dom
  $section = $('#leave-review');
  $currUserName = $section.find('.reviewer p');
  $currUserImg = $section.find('.reviewer-img');
  $reviewerName = $section.find('.review-box-head a');

  $stars = $section.find('.review-rating-stars');
  $starsLabel = $section.find('.review-stars-label span');
  $starsNum = $section.find('.rating-num');
  $text = $section.find('#review-comment');

  $imagesContainer = $section.find('.prew-imgs');
  $newImage = $section.find('#newReviewImage');
  $newImageInput = $section.find('#newReviewImageInput');

  $confirm = $section.find('#confirm-review');

  //bind events
  $(document).on('load', _init());
  $newImage.on('click', _triggerUploadImage);
  $newImageInput.on('change', _uploadImage);
  $(document).on('click', '.rev-imgs span', _removeImg);
  $confirm.on('click', _sendReview);

  //init
  async function _init(data) {
    var url_string = window.location.href
    var url = new URL(url_string);
    professionalUid = url.searchParams.get("uid");
    await dbReview.getProfProfileData(professionalUid)
      .then(data => {
        professionalData = data;
        _setProfName(data.profile);
      })
    await dbReview.getCurrentUserData()
      .then(data => {
        currentUserData = data;
        currentUserUid = data.uid;
        _setReviewerNameAndImg(currentUserData);
      })
    initStars();
  }

  //functions
  function _setReviewerNameAndImg(profile) {
    $currUserName.html(profile.profile.name + ' ' + profile.profile.surname)
    $currUserImg.css('background', `url(${profile.profile.prof_img_url})`);
  }

  function _setProfName(data) {
    console.log(data)
    var name = data.name + ' ' + data.surname;
    $reviewerName.html(name);
    $reviewerName.attr('href', lnk.pgProfiloProf + '?uid=' + professionalUid);
    $starsLabel.html(name);
  }

  function initStars() {
    $stars.rateYo({
      halfStar: true,
      starWidth: "28px",
      spacing: "3px",
      ratedFill: "#FBBB3E",
      normalFill: "#cdcdcd",
      onChange: function(rating, rateYoInstance) {
        $starsNum.text(rating.toFixed(1));
      }
    });
  }

  function _triggerUploadImage() {
    $newImageInput.trigger('click');
  }

  function _uploadImage() {
    var validImageTypes = ["image/jpeg", "image/png"];
    if (parseInt(this.files.length) > 4) {
      alert("Puoi caricare al massimo 4 immagini! Riprova");
      return;
    }

    $.each(this.files, (i, file) => {
      var fileType = file["type"];


      //checking type and size
      if ($.inArray(fileType, validImageTypes) < 0) {
        alert('Puoi caricare solo immagini, riprova!');
        return;
      }
      if (file.size > limitImageSize) {
        alert("La dimensione dell'immagine deve essere inferiore a 2MiB, riprova!");
        return;
      }

      //appending preview
      var imgTmp = `<div class="rev-imgs">
        <span>✖</span>
        <img class="rev-img-prev" src="${URL.createObjectURL(file)}" />
        </div>`;
      $imagesContainer.append(imgTmp);
      arrayPhotos.push(file);
    });

  }

  function _removeImg() {
    var arrayInd = $(this).parent().index();
    $(this).parent().remove();
    arrayPhotos.splice(arrayInd, 1)
  }

  function _blockInputs() {
    $stars.css('pointer-events', 'none');
    $text.attr('disabled', true);
    $section.find('p').css('pointer-events', 'none');
    $section.find('a').css('pointer-events', 'none');
    $newImage.css('pointer-events', 'none');
  }

  function _loadingButtonOn() {
    $confirm.attr('disabled', true).css('opacity', .5).css("pointer-events", "none");
    $confirm.html('Caricamento...');
  }



  function _sendReview() {
    //check if all filed
    if ($text.val().length < 10) {
      alert('Recensione troppo corta. Aggiungi qualche parola in più e riprova.');
      return;
    }
    if ($starsNum.html() * 1 < 0.5 || $starsNum.html() == '') {
      alert('Il voto minimo è di 0.5 stelle. Riprova.');
      return;
    }

    _blockInputs();
    _loadingButtonOn();

    //upload images
    dbReview.uploadReviewImages(professionalUid, arrayPhotos)
      .then(urls => {
        //upload review
        var reviewObj = {
          review: $text.val(),
          stars: $starsNum.html() * 1,
          images: urls,
          toUid: professionalUid,
          fromUid: currentUserUid,
          created: $.now()
        }
        console.log(reviewObj.images)
        dbReview.saveReview(reviewObj)
          .then(() => {
            console.log('Save revuew')
            _showSuccess();
            console.log('Done')
          });
      })
  }

  function _showSuccess() {
    var successTmp = `<section class="top-sec" id="review-success">
        <div class="container">
        <div class="review-box-body">
            <h2>Recensione inviata con successo!</h2>
            <p>Visita il <a href="${lnk.pgProfiloProf + '?uid=' + professionalUid}"> profilo del professionista.</a></p>
            <p>Oppure vai alla <a href="${lnk.pgHome}">pagina principale</a> di casafix.</p>
        </div>
        </div>
    </section>`;


    $section.fadeOut(() => {
      $('body').append(successTmp).fadeIn(200);
    });
  }

})();