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

  $('html').append(bar);



  document.onreadystatechange = function(e) {
    if (document.readyState == "interactive") {
      var all = document.getElementsByTagName("*");
      for (var i = 0, max = all.length; i < max; i++) {
        set_ele(all[i]);
      }
      $('body').css('opacity', 1);
      $('body').fadeOut().fadeIn();
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
        var bar_width = document.getElementById("bar1").style.width
        bar_num = bar_width.replace('%', '');
        if (bar_num > 99) {
          console.log('asdsa')
          $(".progress-page-bar").fadeOut("slow");
          $('.progress-bar-container').fadeOut();
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

//loadThePage