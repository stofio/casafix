var profProfReviews = (function() {

  var uid;

  //cache dom
  $section = $('#reviews-sec');
  $leaveRevBtn = $('#give-review');
  $reviewSwiper = $('#fullscreen-swiper-rew');
  $reviewSwiperWrapper = $('#fullscreen-swiper-rew .swiper-wrapper');

  //bind events
  $(document).on('load', _loadReviews());
  $leaveRevBtn.on('click', _goToLeaveReview);
  $(document).on('click', '.review img', _openFullScreenImages);

  //init
  function _loadReviews() {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");

    var lasciaRecUrl = lnk.pgGiveReview + `?uid=` + uid;
    $leaveRevBtn.find('a').attr('href', lasciaRecUrl);

    _getReviews()
      .then((reviews) => {
        if (reviews) {
          reviews.forEach(review => {
            _addReview(review);
          });
        }
      })
  }

  //functions
  function _getReviews() {
    return new Promise((resolve) => {
      dbProfile.getReviewsData(uid)
        .then((querySnapshot) => {
          resolve(querySnapshot);
        });
    })
  }

  function _addReview(review) {
    var dateOptions = { 'month': 'long', 'day': 'numeric', 'year': 'numeric' };
    var date = new Date(review.created).toLocaleString('it-IT', dateOptions);
    var tmp = `<div class="reviewer">
                  <div class="reviewer-img"></div>
                  <div class="flex-column align-items-center">
                    <p class="reviwer-name"></p>
                    <div class="review-star"></div>
                  </div>
                </div>
                <div class="review-date">
                  <p>${date}</p>
                </div>
                <div class="review-desc">
                  <p>${review.review}</p>
                </div>
                <div class="review-images"></div>
              `;

    var singleRew = document.createElement('div');
    singleRew.className = 'review col-md-12';
    $(singleRew).html(tmp);

    $section.find('.reviews-list').append(singleRew);

    var $currentReview = $(singleRew);

    dbProfile.getUserProfileImageAndName(review.from_uid)
      .then(obj => {
        $currentReview.find('.reviewer-img').css('background', `url(${obj.imgUrl})`);
        $currentReview.find('.reviwer-name').html(obj.name);
      })

    //give stars
    $currentReview.find('.review-star').rateYo({
      rating: review.stars,
      starWidth: "18px",
      spacing: "1px",
      readOnly: true,
      ratedFill: "#FBBB3E",
      normalFill: "#cdcdcd"
    });

    //appent images
    $.each(review.images, (i, img) => {
      $currentReview.find('.review-images').append(` <img src="${img}"/> `)
    })
  }


  function _goToLeaveReview() {
    window.location.replace(lnk.pgGiveReview + `?uid=` + uid);
  }


  function _openFullScreenImages() {
    $reviewSwiperWrapper.empty();

    var imgClickedIndex = $(this).index();

    var imges = $(this).parent().find('img');
    $.each(imges, (i, imgEl) => {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      $(slide).html($(imgEl).clone());
      $reviewSwiperWrapper.append(slide);
    })

    fullscreenSwiper = new Swiper('#fullscreen-swiper-rew', {
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      slidesPerView: 1,
      centeredSlides: true,
      paginationClickable: true,
      spaceBetween: 10,
      loop: true,
      initialSlide: imgClickedIndex
    })

    $reviewSwiper.fadeIn();
    $('#fullscreen-swiper-backdrop').fadeIn();
    //$('body, html').addClass('no-scroll');

    $('#fullscreen-swiper-close-rew').on('click', function() {
      $('#fullscreen-swiper-rew').hide()
      $('#fullscreen-swiper-backdrop').fadeOut();
      // $('body, html').removeClass('no-scroll');
    });

  }



})();