var dbReview = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();

  function checkIfProfessionalExist(uid) {
    return new Promise((resolve, reject) => {
      database.collection('professionals').doc(uid).get()
        .then((doc) => {
          if (doc.exists) {
            resolve(true);
          } else {
            resolve(false);
          }
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

  function getCurrentUserData() {
    return new Promise((resolve, reject) => {
      var currUserId = firebase.auth().currentUser.uid;
      _getCurrentUserRole(currUserId)
        .then(userRole => {
          database.collection(userRole).doc(currUserId).get()
            .then((doc) => {
              const data = doc.data();
              data.uid = currUserId;
              resolve(data);
            });
        })

    })
  }

  function _getCurrentUserRole(uid) {
    return new Promise((resolve, reject) => {
      database.collection('registered_accounts').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data._role + 's');
        });
    })
  }


  function uploadReviewImages(uid, images) {
    return new Promise((resolve, reject) => {
      let fileUrls = [];

      $.each(images, (i, img) => {
        c = 0;
        storage.ref('users/' + uid + '/images/reviews/' + uuidv4()).put(img)
          .then((snapshot) => {
            return snapshot.ref.getDownloadURL()
          })
          .then(url => {
            fileUrls.push(url);
            c++;
            console.log(c)
            if (c == images.length) {
              resolve(fileUrls);
            }
          })
      })
    })
  }


  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function saveReview(reviewObj) {
    return new Promise((resolve, reject) => {
      console.log('save to prof')
      _saveUserGivedReview(reviewObj.fromUid, reviewObj.toUid);
      _saveReviewToProfessional(reviewObj)
        .then(() => {
          console.log('save to reviewr')
          _saveReviewToRewier(reviewObj)
            .then(() => {
              console.log('save stars and reviews')
              _updateProfessionalStarsAndReviews(reviewObj)
                .then(resolve());
            });

        });
    });
  }

  function _saveReviewToProfessional(reviewObj) {
    return new Promise((resolve) => {
      $.each(reviewObj.images, (i, img) => {})
      database.collection('professionals').doc(reviewObj.toUid).collection('reviews_taken').add({
        "review": reviewObj.review,
        "stars": reviewObj.stars,
        "images": reviewObj.images,
        "from_uid": reviewObj.fromUid,
        "created": reviewObj.created
      }).then((snapshot) => {
        resolve(snapshot.id);
      })
    })
  }

  function _saveReviewToRewier(reviewObj) {
    return new Promise((resolve) => {
      _getCurrentUserRole(reviewObj.fromUid)
        .then(userRole => {
          console.log(userRole)
          database.collection(userRole).doc(reviewObj.fromUid).collection('reviews_given').add({
            "review": reviewObj.review,
            "stars": reviewObj.stars,
            "images": reviewObj.images,
            "to_uid": reviewObj.toUid,
            "created": reviewObj.created
          }).then((snapshot) => {
            resolve(snapshot.id);
          })
        })
    })
  }

  function _saveUserGivedReview(from, to) {
    return new Promise((resolve) => {
      database.collection('users').doc(from).update({
        "last_review_to": to,
        "last_review_time": Date.now()
      });
    });
  }

  function _updateProfessionalStarsAndReviews(reviewObj) {
    return new Promise((resolve) => {
      //get all reviews
      getAllReviews(reviewObj.toUid)
        .then(reviews => {
          var totalStars = 0;
          $.each(reviews, (i, review) => {
            totalStars = totalStars + review.stars;
          })
          var totalReviews = reviews.length;
          //round to 0 or .5
          var avarageStars = Math.round((totalStars / totalReviews) * 2) / 2;
          database.collection('professionals').doc(reviewObj.toUid).update({
            reviews: totalReviews,
            stars: avarageStars
          }).then(() => {
            resolve();
          })

        })
    })
  }

  //return array of reviews
  function getAllReviews(uid) {
    return new Promise((resolve) => {
      database.collection('professionals').doc(uid).collection('reviews_taken').get()
        .then(snapshot => {
          resolve(snapshot.docs.map(doc => doc.data()));
        });
    })
  }


  function isLastReviewMoreThenLimitedTime(limit) {
    return new Promise((resolve) => {
      var currentUid = firebase.auth().currentUser.uid;
      database.collection('users').doc(currentUid).get()
        .then(doc => {
          var lastReview = doc.data().last_review_time;
          var timeNow = Date.now();

          //calculate how much is passed since last review
          var timePassedSinceLastReview = timeNow - lastReview;

          if (timePassedSinceLastReview > limit || lastReview == undefined) {
            //last review was long enough
            resolve(true);
          } else {
            resolve(false);
          }
        });
    })
  }

  function isPhoneVerified() {
    return new Promise((resolve) => {
      var currentUid = firebase.auth().currentUser.uid;
      database.collection('registered_accounts').doc(currentUid).get()
        .then(doc => {

          if (doc.data().phoneVerified == undefined) resolve(false);

          var phoneVerified = doc.data().phoneVerified;
          if (phoneVerified == 1) {
            //last review was long enough
            resolve(true);
          }
        });
    })
  }







  return {
    getProfProfileData: getProfProfileData,
    getCurrentUserData: getCurrentUserData,
    uploadReviewImages: uploadReviewImages,
    saveReview: saveReview,
    getAllReviews: getAllReviews,
    checkIfProfessionalExist: checkIfProfessionalExist,
    isLastReviewMoreThenLimitedTime: isLastReviewMoreThenLimitedTime,
    isPhoneVerified: isPhoneVerified
  }

})();