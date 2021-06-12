var sortDropdown = (function() {


  //cache dom
  var $sortCont = $('#sort-prof');
  var $sort = $sortCont.find('select');


  //bind events
  $(document).on('load', _loadSort());
  $sort.on('change', _sortList);

  //init
  function _loadSort() {
    _initializeSelect();
  }

  //functions
  function _sortList() {
    //set url
    //RENDER LIST
  }


  function _initializeSelect(callback) {
    $sort.select2({
      minimumResultsForSearch: -1,
    });
  }




  return {

  }

})();