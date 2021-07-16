(function() {

  var bar = `
    <div class="progress-bar-container">
        <div class='progress-page-bar' id="progress_div">
            <div class='bar' id='bar1'></div>
            <div class='percent' id='percent1'></div>
        </div>  
        <input type="hidden" id="progress_width" value="0">
    </div>
    `;

  $('body').append(bar);



  document.onreadystatechange = function(e) {
    if (document.readyState == "interactive") {
      var all = document.getElementsByTagName("*");
      for (var i = 0, max = all.length; i < max; i++) {
        set_ele(all[i]);
      }
    }
  }

  function check_element(ele) {
    var all = document.getElementsByTagName("*");
    var totalele = all.length;
    var per_inc = 100 / all.length;

    if ($(ele).on()) {
      var prog_width = per_inc + Number(document.getElementById("progress_width").value);
      document.getElementById("progress_width").value = prog_width;
      $("#bar1").animate({ width: prog_width + "%" }, 10, function() {
        if (document.getElementById("bar1").style.width == "100%") {
          $(".progress-page-bar").fadeOut("slow");
        }
      });
    } else {
      set_ele(ele);
    }
  }

  function set_ele(set_element) {
    check_element(set_element);
  }






})();