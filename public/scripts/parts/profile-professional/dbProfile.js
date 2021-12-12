var dbProfile = (function() {

  var database = firebase.firestore();

  function getPortfolioImg(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).collection('portfolio').orderBy('created', "desc").get()
        .then((querySnapshot) => {
          // querySnapshot.forEach(doc => {
          //   console.log(doc.id, " => ", doc.data());
          // });
          // const data = doc.data();
          resolve(querySnapshot);
        });
    })
  }


  function getProfProfileData(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        });
    })
  }


  //return array of reviews
  function getReviewsData(uid) {
    return new Promise((resolve) => {
      database.collection('professionals').doc(uid).collection('reviews_taken').orderBy('created', "desc").get()
        .then(snapshot => {
          resolve(snapshot.docs.map(doc => doc.data()));
        });
    })
  }

  //return img url
  function getUserProfileImageAndName(uid) {
    return new Promise((resolve, reject) => {
      _getCurrentUserRole(uid)
        .then(userRole => {
          database.collection(userRole + 's').doc(uid).get()
            .then((doc) => {
              const data = doc.data();
              var obj = {
                imgUrl: data.profile.prof_img_url,
                name: data.profile.name + ' ' + data.profile.surname
              }
              resolve(obj);
            });
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  function _getCurrentUserRole(uid) {
    return new Promise((resolve, reject) => {
      database.collection('registered_accounts').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data._role);
        })
        .catch(e => {
          console.log(e)
        })
    })
  }


  function addToFavourite(uid) {
    return new Promise((resolve, reject) => {
      var currentUid = firebase.auth().currentUser.uid;

      var myFavourite = database.collection('favourites').doc(currentUid).collection('my_favourites');
      myFavourite.doc(uid).set({});


      var iAmFavourite = database.collection('favourites').doc(uid).collection('i_am_favourite');
      iAmFavourite.doc(currentUid).set({})
        .then(resolve());
    })
  }

  function removeFromFavourite(uid) {
    return new Promise((resolve, reject) => {
      var currentUid = firebase.auth().currentUser.uid;


      var myFavourite = database.collection('favourites').doc(currentUid).collection('my_favourites');
      myFavourite.doc(uid).delete();


      var iAmFavourite = database.collection('favourites').doc(uid).collection('i_am_favourite');
      iAmFavourite.doc(currentUid).delete()
        .then(resolve());
    })
  }

  function isMyFavourite(uid) {
    return new Promise((resolve, reject) => {
      console.log(firebase.auth().currentUser)
      if (firebase.auth().currentUser == null) {
        //hide hearth
        $('.save-to-favorite').hide(0);
        //change contact button
        $('.sendMessage').prepend('Accedi & ');
        resolve(false);
        return;
      }
      var currentUid = firebase.auth().currentUser.uid;
      var myFavourite = database.collection('favourites').doc(currentUid).collection('my_favourites');
      myFavourite.doc(uid).get()
        .then(doc => {
          var favourite = doc.exists ? true : false;
          resolve(favourite);
        })
    })
  }







  return {
    getPortfolioImg: getPortfolioImg,
    getProfProfileData: getProfProfileData,
    getReviewsData: getReviewsData,
    getUserProfileImageAndName: getUserProfileImageAndName,
    addToFavourite: addToFavourite,
    removeFromFavourite: removeFromFavourite,
    isMyFavourite: isMyFavourite
  }

})();