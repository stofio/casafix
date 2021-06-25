var sortDropdown = (function() {


  //cache dom
  var $sortCont = $('#sort-prof');
  var $sort = $sortCont.find('select');



  //bind events
  $sort.on('change', _sortList);
  $(document).on('load', _loadSort());

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

  function blockSortDropdown() {
    $sort.attr("disabled", "disabled").css('pointer-events', 'none');
  }

  function unblockSortDropdown() {
    $sort.removeAttr('disabled').css('pointer-events', 'auto');
  }


  return {
    blockSortDropdown: blockSortDropdown,
    unblockSortDropdown: unblockSortDropdown
  }

})();