var selectBox = (value) => {
  var param = {};
  if(value=='fade_out'){
    param = {
      type : 'fade_out',
      title : 'FADE OUT TIMER',
      items : set_val.defaults.fade_out
    }
  }else if(value=='mode'){
    param = {
      type : 'mode',
      title : 'MODE',
      items : user_define_sample
    }
  }

  UI.selectBox(true,param);
}

$('#bright').slider();
$('#temp').slider();

$("#bright").on("slideStop", function(slideEvt) {
    // UI.loading(true);
    FN.bright_slider(parseInt(slideEvt.value));
    $('#mode_btn > .text').text('NORMAL');
    // slide_val = parseInt(slide_val) ? parseInt(slide_val) : 1;
    // OCF.setDim(slide_val);
});

$("#temp").on("slideStop", function(slideEvt) {
    // UI.loading(true);
    FN.temp_slider(parseInt(slideEvt.value));
    $('#mode_btn > .text').text('NORMAL');
    // OCF.setDim(slide_val);
});

