// (function() {

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // User is signed in.
//       //header.loadSignedHeader();
//       //searchBar.load
//     } else {
//       // No user is signed in.
//       //header.loadDefHeader();
//     }
//   });


// })()

var personInfo = {
  name: "Name Surname",
  imgLink: "/images/placeholder-prof-img.png"
};

header.getHeader('user', personInfo);

(function() {

  var home = {

    names: ['deja', 'para', 'joni'],

    init: function() {
      this.cacheDom();
      this.bindEvents();
      this.render();
    },
    cacheDom: function() {
      this.$list = $('#listProf');
      this.tmplist = this.$list.find('#tmpList').html();
      console.log(this.tmplist)
    },
    bindEvents: function() {},
    render: function() {
      var data = {
        professinal: this.names,
      };
      this.$list.html(Mustache.render(this.tmplist, data));
    },
  }

  // home.init();

})();