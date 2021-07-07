var profProfReviews = (function() {

  var uid;

  //cache dom
  $section = $('#reviews-sec');
  $leaveRevBtn = $('#reviews-sec');

  //bind events
  $(document).on('load', _loadReviews());
  $leaveRevBtn.on('click', _goToLeaveReview);

  //init
  function _loadReviews() {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");
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
    console.log(review)
    var tmp = `<div class="review col-md-12">
                <div class="reviewer">
                  <div class="reviewer-img"></div>
                  <div class="flex-column align-items-center">
                    <p class="reviwer-name"></p>
                    <div class="review-star"></div>
                  </div>
                </div>
                <div class="review-date">
                  <p>Gennaio 13, 2021</p>
                </div>
                <div class="review-desc">
                  <p>${review.review}</p>
                </div>
                <div class="review-images"></div>
              </div>`;

    var $currentReview = $section.find('.reviews-list').append(tmp);

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



})();