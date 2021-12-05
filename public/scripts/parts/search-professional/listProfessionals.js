var listProfessionals = (function() {


      //cache dom
      var $profList = $('#listProf');

      //event
      $(document).on('click', '.prof-box', _goToUserProfile);

      //functions
      function renderList(dataFilter) {
        return new Promise((resolve, reject) => {
          $profList.empty();
          $profList.append(_loadingList());
          _getFilteredProfessionals(dataFilter)
            .then(profObj => {
              if (profObj.length !== 0) {
                $profList.empty();
                var sort = dataFilter.sort;
                if (dataFilter.location.place == 'Italia') sort = 'stars';
                _sortProfessionals(profObj, sort)
                  .then(sorted => {
                    sorted.forEach(prof => $profList.append(getTemplate(prof)));
                    listProfessionals.hideDistanceOnProfessionals();
                  })
              } else {
                $profList.empty();
                $profList.append('<h4 class="no-results">La ricerca non ha dato nessun risultato.<br/> Prova a cambiare filtri, zona o raggio di ricerca.</h4>')
              }
              resolve();
            })
        })
      }

      //the sortType can be string -> distance, reviews, stars, created
      function _sortProfessionals(profObj, sortType) {
        return new Promise((resolve, reject) => {
          if (sortType == 'created') {
            var sortedCreated = profObj.sort(SortByCreated);
            resolve(sortedCreated);
          }
          if (sortType == 'reviews') {
            var sortedCreated = profObj.sort(SortByReviews);
            resolve(sortedCreated);
          }
          if (sortType == 'stars') {
            var sortedCreated = profObj.sort(SortByStars);
            resolve(sortedCreated);
          }
          if (sortType == 'distance') {
            var sortedCreated = profObj.sort(SortByDistance);
            resolve(sortedCreated);
          }
        });
      }

      function SortByCreated(a, b) {
        var aName = a.created;
        var bName = b.created;
        return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
      }

      function SortByReviews(a, b) {
        var aName = a.reviews;
        var bName = b.reviews;
        return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
      }

      function SortByStars(a, b) {
        var aName = a.stars;
        var bName = b.stars;
        return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
      }

      function SortByDistance(a, b) {
        var aName = a.distance;
        var bName = b.distance;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
      }




      function _getFilteredProfessionals(dataFilter) {
        return new Promise((resolve, reject) => {
          dbSearch.getFilteredProfessionals(dataFilter)
            .then(data => {
              resolve(data);
            })
            .catch(e => {
              console.log(e)
              reject(e);
            })
        })
      }

      function getTemplate(profObj) {
        let tmpCont = document.createElement('div');
        tmpCont.classList.add('prof-box');
        let tmp = `
        <input class="profuid" type="text" value="${profObj.uid}" hidden />
        <div class="prof-box-img">
          <div class="prof-img-bg" style="background: url(${profObj.profile.prof_img_url})"></div>
        </div>
        <div class="prof-and-stars">
          <div class="prof-professions">
            ${ profObj.professions.objProfService.map(prof => `<span>${prof._prof_name}</span>`).join("- &nbsp;") }
          </div>
          <div class="prof-prof-stars">
            <span>${profObj.reviews}</span>
            <div class="number-stars"></div>
          </div>
        </div>
        <div class="prof-info">
          <p>${profObj.profile.name} ${profObj.profile.surname}</p>
          <p>${profObj.profile.location.region}</p>
          <p class="intro">${profObj.profile.description}</p>
        </div>
        <div class="distance-and-button">
          <span class="distance">⇄ ${profObj.distance.toFixed(2)} km da te</span>
          <a href="${lnk.pgProfiloProf}?uid=${profObj.uid}">
            <button class="def-btn goToProfile">Profilo</button>
          </a>
        </div>
        `;

        let linkWrap = document.createElement('a');
        linkWrap.setAttribute('href', `${lnk.pgProfiloProf}?uid=${profObj.uid}`);

        $(linkWrap).html($(tmpCont).append(tmp));

        $(tmpCont).find('.number-stars').rateYo({
          rating: profObj.stars,
          starWidth: "18px",
          spacing: "1px",
          readOnly: true,
          ratedFill: "#FBBB3E",
          normalFill: "#cdcdcd"
        });

      //`<a href="${lnk.pgProfiloProf}?uid=${profObj.uid}">`

      return (linkWrap);
    }

  function _goToUserProfile() {
    var uid = $(this).find('.profuid').val();
    console.log(uid)
    
  }

  function _loadingList() {
        let tmp = `
          <div class="load-placeholder"></div>
          <div class="load-placeholder"></div>
          <div class="load-placeholder"></div>
            <div class="load-placeholder"></div>`;
      return tmp;
  }

  function hideDistanceOnProfessionals() {
    $('.distance-and-button .distance').css('display', 'none');
  }





  return {
    renderList: renderList,
    hideDistanceOnProfessionals:hideDistanceOnProfessionals
  }

})();