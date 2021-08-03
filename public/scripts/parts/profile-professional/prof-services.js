var profProfServices = (function() {

  //cache dom
  $sectionProf = $('#prof-professions-sec');

  //bind events


  //init
  function init(data) {
    _fillData(data);
  }

  //functions
  function _fillData(data) {
    var professions = data.professions.objProfService;
    $.each(professions, (i, prof) => {

      var box = document.createElement('div');
      box.className = 'prof-box-full full-profile';

      var ttl = document.createElement('h3');
      ttl.innerHTML = prof._prof_name;
      box.append(ttl);

      var srvCont = document.createElement('div');
      srvCont.className = 'full-services';
      box.append(srvCont);

      var allServ = [...prof.other_serv, ...prof.sel_serv];
      $.each(allServ, (i, serv) => {
        var singlServ = document.createElement('div');
        singlServ.className = 'service-item';
        singlServ.innerHTML = serv;
        $(box).find('.full-services').append(singlServ);
      })
      $sectionProf.append(box);
    })
  }

  return {
    init: init
  }


})();