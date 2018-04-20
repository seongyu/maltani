set_val.name = '';
set_val.bright = 46;
set_val.temp = 4820;

var idx = sessionStorage.getItem('itemIdx');

if(idx){
  idx = parseInt(idx)
  var item = user_define_sample[idx];
  set_val.name = item.name;
  set_val.bright = item.bright;
  set_val.temp = item.temp;

  $('#name').val(set_val.name);
  if(idx>3){
    $('.delete_btn').css('display','block')
  }
}

var page_move = (wh) => {
  if(wh=='back'){
    location.href='list.html'
  }else if(wh=='save'){
    var name = $('#name').val();
    if(!name||name==''){
      UI.toast('Mode name not defined\nSet mode name and try again, please')
      return null;
    };

    var item = {
      name : name,
      bright : set_val.bright,
      temp : set_val.temp
    };

    if(idx||idx==0){
      user_define_sample[idx] = item
    }else{
      user_define_sample.push(item)
    }
    
    sessionStorage.setItem('UDM',JSON.stringify(user_define_sample));
    UI.toast('Successfully saved!',() => {
      location.href = 'list.html';
    })
  }else if(wh=='del'){
    user_define_sample.splice(idx,1);

    sessionStorage.setItem('UDM',JSON.stringify(user_define_sample));
    UI.toast('Successfully deleted!',() => {
      location.href = 'list.html';
    })
  }
}

$('#bright').slider();

$("#bright").on("slideStop", function(slideEvt) {
    FN.bright_slider(parseInt(slideEvt.value));
});

$('#temp').slider();

$("#temp").on("slideStop", function(slideEvt) {
    FN.temp_slider(parseInt(slideEvt.value));
});

UI.set.bright(set_val.bright);
UI.set.temp(set_val.temp);


