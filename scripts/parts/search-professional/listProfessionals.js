var listProfessionals = (function() {


      //cache dom
      var $profList = $('#listProf');

      //event
      $(document).on('click', '.prof-box', _goToUserProfile);

      //functions
      async function renderList(dataFilter) {
        var profObj = await _getFilteredProfessionals(dataFilter);
        $profList.empty();
        profObj.forEach(prof => $profList.append(getTemplate(prof)));
      }


      function _getFilteredProfessionals(dataFilter) {
        return new Promise((resolve, reject) => {
          dbSearch.getFilteredProfessionals(dataFilter)
            .then(data => {
              console.log(data)
              resolve(data);
            })
            .catch(e => {
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
              <span>32</span>
              <div class="number-stars"></div>
            </div>
          </div>
          <div class="prof-info">
            <p>${profObj.profile.name} ${profObj.profile.surname}</p>
            <p>${profObj.profile.location.region}</p>
            <p class="intro">${profObj.profile.description}</p>
          </div>
          <div class="distance-and-button">
            <span class="distance">⇄ 1.2 km</span>
            <button class="def-btn goToProfile">Profilo</button>
          </div>
        `;

    $(tmpCont).append(tmp);

    $(tmpCont).find('.number-stars').rateYo({
      rating: Math.floor(Math.random() * 5) + 1,
      starWidth: "18px",
      spacing: "1px",
      readOnly: true,
      ratedFill: "#FBBB3E",
      normalFill: "#cdcdcd"
    });

    return tmpCont;
  }

  function _goToUserProfile() {
    var uid = $(this).find('.profuid').val();
    console.log(uid)
  }





  return {
    renderList: renderList
  }

})();