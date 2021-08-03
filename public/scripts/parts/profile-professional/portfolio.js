var profProfPortfolio = (function() {

  //var uid = 'QXH2GMtvtSOpk1qAaDjVuMriQtS2';
  var uid;
  var fullscreenSwiper;

  //cache dom
  $porfolioCont = $('.full-portfolio');

  //bind events
  $(document).on('load', _loadPortfolio());
  $('.gallery-portfolio').on('click', '.portfolio-item', _openSlider)


  //init
  function _loadPortfolio() {
    var url_string = window.location.href
    var url = new URL(url_string);
    uid = url.searchParams.get("uid");
    _getData()
      .then((querySnapshot) => {
        if (querySnapshot) {
          i = 1;
          querySnapshot.forEach(doc => {
            _addToPortfolio(doc.id, doc.data().img_url, doc.data().img_title, i);
            i++;
          });
        }
      })
  }

  //functions
  function _openSlider(e) {
    var slideId = $(this).attr('id');
    openFullscreenSwiper(slideId);
  }

  function _getData() {
    return new Promise((resolve) => {
      dbProfile.getPortfolioImg(uid)
        .then((querySnapshot) => {
          resolve(querySnapshot);
        });
    })
  }

  function _addToPortfolio(docId, url, title, orderId) {
    var tmp = `<div class="col-md-4 col-6 portfolio-item swiper-slide" id="${orderId}">
                  <div class="portfolio-front-img" data-imgid=${docId} style="background-image:url(${url})">
                  </div>
                  <strong>${title.slice(0, 30)}</strong>
              </div>`;
    var swiperItem = `<div class="swiper-slide">
                        <img src="${url}" />  
                        <p>${title}</p>
                      </div>`;
    $porfolioCont.find('.gallery-portfolio').append(tmp);
    $('#fullscreen-swiper-port .swiper-wrapper').append(swiperItem);
  }

  function openFullscreenSwiper(initialSlideNumber) {
    fullscreenSwiper = new Swiper('#fullscreen-swiper-port', {
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
      initialSlide: initialSlideNumber - 1
    })
    $('#fullscreen-swiper-port').fadeIn();
    $('#fullscreen-swiper-backdrop').fadeIn();
    //$('body, html').addClass('no-scroll');

    $('#fullscreen-swiper-close-port').on('click', function() {
      $('#fullscreen-swiper-port').hide()
      $('#fullscreen-swiper-port .swiper-wrapper');
      $('#fullscreen-swiper-backdrop').fadeOut();
      // $('body, html').removeClass('no-scroll');
    });

  }


})();