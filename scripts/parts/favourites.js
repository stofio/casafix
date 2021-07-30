var favourites = (function() {

      var current_uid;

      //cache dom
      var $favouritesList = $('#list-favourites');

      //event
      $(document).on('load', _init());
      // $(document).on('click', '.prof-box', _goToUserProfile);


      function _init() {
        firebase.auth().onAuthStateChanged((loggedUser) => {
          if (loggedUser) {
            current_uid = loggedUser.uid;
            _listFavourites(current_uid)
          }
        })
      }


      async function _listFavourites(current_uid) {
        var myFavourites = await _getMyFavourites(current_uid);
        console.log(myFavourites)
        $.each(myFavourites, (i, uid) => {
          _getUserData(uid)
            .then(data => {
              console.log(data)
              var tmp = _getTemplate(data, uid);
              $favouritesList.append(tmp);

            })
        });
      }



      function _getMyFavourites(current_uid) {
        return new Promise((resolve, reject) => {
          var myFavourite = firebase.firestore().collection('favourites').doc(current_uid).collection('my_favourites');
          myFavourite.get()
            .then(snapshot => {
              var myFavArr = snapshot.docs.map(doc => doc.id);
              resolve(myFavArr)
            })
        })
      }

      async function _getUserData(uid) {
        var role = await _getRole(uid);
        return new Promise((resolve, reject) => {
          var user = firebase.firestore().collection(role).doc(uid).get()
            .then(snapshot => {
              resolve(snapshot.data());
            })
        })
      }

      function _getRole(uid) {
        return new Promise((resolve, reject) => {
          firebase.firestore().collection('registered_accounts').doc(uid).get()
            .then((doc) => {
              const data = doc.data();
              resolve(data._role);
            })
            .catch(e => {
              console.log(e)
            })
        })
      }



      function _getTemplate(profObj, uid) {
        let tmpCont = document.createElement('div');
        tmpCont.classList.add('prof-box-full');
        var tmp = `
          <input class="profuid" type="text" value="${profObj.uid}" hidden="">
          <div class="prof-box-img">
            <div class="prof-img-bg" style="background: url(${profObj.profile.prof_img_url})"></div>
          </div>
          <div class="prof-professions">
           ${ profObj.professions.objProfService.map(prof => `<span>${prof._prof_name}</span>`).join(" - &nbsp;") }
          </div>
          <div class="prof-prof-stars">
            <button class="def-btn sendMessage">Profilo <div class="msg-icon" style="content: url(images/contact-arrow.svg); width: 20px; height: 20px;"></div></button>
            <div class="save-to-favorite">
              <i></i>
              <span>Preferiti</span>
            </div>
          </div><br>
          <div class="prof-info">
            <p class="prof-name">${profObj.profile.name} ${profObj.profile.surname}</p>
            <p class="prof-location">${profObj.profile.location.region}</p>
          </div>
          <div class="rating-full">
          </div>
          <div class="full-description">
          </div>
      `;

      var fav = $(tmpCont).append(tmp);

      $(fav).find('.sendMessage').on('click', () => {
        window.location.href = lnk.pgProfiloProf + `?uid=${uid}`;
      })

  
        $(fav).find('i').addClass('press');

        $(fav).find('i').on('click', () => {
          _removeFromFavourite(uid)
          $(fav).slideUp().remove();
        })


      return (fav);
  }

  function _removeFromFavourite(uid) {
    return new Promise((resolve, reject) => {
      var currentUid = firebase.auth().currentUser.uid;

      var myFavourite = firebase.firestore().collection('favourites').doc(currentUid).collection('my_favourites');
      myFavourite.doc(uid).delete();

      var iAmFavourite = firebase.firestore().collection('favourites').doc(uid).collection('i_am_favourite');
      iAmFavourite.doc(currentUid).delete()
        .then(resolve());
    })
  }




})();