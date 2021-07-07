var dbProfile = (function() {

  var database = firebase.firestore();

  function getPortfolioImg(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).collection('portfolio').orderBy('created', "asc").get()
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
      database.collection('professionals').doc(uid).collection('reviews_taken').orderBy('created', "asc").get()
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
          database.collection(userRole).doc(uid).get()
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









  return {
    getPortfolioImg: getPortfolioImg,
    getProfProfileData: getProfProfileData,
    getReviewsData: getReviewsData,
    getUserProfileImageAndName: getUserProfileImageAndName
  }

})();