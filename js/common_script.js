var FN = {}, UI = {power : true};

var set_val = {
  bright: 46,
  max_b: false,
  min_b: false,
  temp: 4820,
  max_t: false,
  min_t: false,
  dialog: '',
  defaults:{
    bright : [8,15,23,31,39,46,54,62,69,77,85,92,100],
    temp : [2700,3760,4820,5880,6940,8000],
    fade_out : [30, 60, 90, 120, 150, 180]
  },
  is_save : true,
  dimmed : false,
  main_dimmed : false
}

var user_define_process = () => {
  var UDM = sessionStorage.getItem('UDM');
  var items = null;
  if(UDM){
    items = JSON.parse(UDM)
  }else{
    items = [
      {name:'Normal',bright:46,temp:4820},
      {name:'Movie',bright:31,temp:3760},
      {name:'Reading',bright:77,temp:3760},
      {name:'Break',bright:15,temp:5880},
      {name:'Repair',bright:39,temp:6940}
    ];

    sessionStorage.setItem('UDM',JSON.stringify(items))
  }

  return items;
};

var user_define_sample = user_define_process();

FN.open_dialog = (target) => {
  var value_set = {}
  if(target=='bright'){
    value_set = {
      title : 'brightness',
      unit : '%',
      current : set_val.bright,
      target : target
    }
  }else if(target=='temp'){
    value_set = {
      title : 'color temperature',
      unit : 'K',
      current : set_val.temp,
      target : target
    }
  }

  UI.dialogBox(true, value_set);
}

FN.dialog_ctrl = (level) => {
  var current_val = parseInt($('#dialog .val').text());
  var item = set_val.defaults[UI.target];
  var idx = item.indexOf(current_val);

  // set min, max 
  if(level){
    if(idx >= item.length-2){
      UI.target == 'bright' ? set_val.max_b = true : UI.target == 'temp' ? set_val.max_t = true : null;
    }else{
      set_val.min_b = false;
      set_val.min_t = false;
      UI.target == 'bright' ? set_val.max_b = false : UI.target == 'temp' ? set_val.max_t = false : null;
    }
    $('#dialog .val').text(item[idx + 1])
  }else{
    if(idx <= 1){
      UI.target == 'bright' ? set_val.min_b = true : UI.target == 'temp' ? set_val.min_t = true : null;
    }else{
      set_val.max_b = false;
      set_val.max_t = false;
      UI.target == 'bright' ? set_val.min_b = false : UI.target == 'temp' ? set_val.min_t = false : null;
    }
    $('#dialog .val').text(item[idx - 1])
  }
}

FN.bright_slider = (value) => {
  set_val.min_b = false;
  set_val.max_b = false;

  switch(value){
    case 10 : set_val.bright = set_val.defaults.bright[0]; set_val.min_b = true; break;
    case 20 : set_val.bright = set_val.defaults.bright[1]; break;
    case 30 : set_val.bright = set_val.defaults.bright[2]; break;
    case 40 : set_val.bright = set_val.defaults.bright[3]; break;
    case 50 : set_val.bright = set_val.defaults.bright[4]; break;
    case 60 : set_val.bright = set_val.defaults.bright[5]; break;
    case 70 : set_val.bright = set_val.defaults.bright[6]; break;
    case 80 : set_val.bright = set_val.defaults.bright[7]; break;
    case 90 : set_val.bright = set_val.defaults.bright[8]; break;
    case 100 : set_val.bright = set_val.defaults.bright[9]; break;
    case 110 : set_val.bright = set_val.defaults.bright[10]; break;
    case 120 : set_val.bright = set_val.defaults.bright[11]; break;
    case 130 : set_val.bright = set_val.defaults.bright[12]; set_val.max_b = true; break;
    default : 
      set_val.bright = set_val.defaults.bright[5]; 
      value = 60;
      break;
  }

  UI.set.bright(set_val.bright);
}

FN.temp_slider = (value) => {
  set_val.min_t = false;
  set_val.max_t = false;

  switch(value){
    case 1 : set_val.temp = set_val.defaults.temp[0]; set_val.min_t = true; break;
    case 2 : set_val.temp = set_val.defaults.temp[1]; break;
    case 3 : set_val.temp = set_val.defaults.temp[2]; break;
    case 4 : set_val.temp = set_val.defaults.temp[3]; break;
    case 5 : set_val.temp = set_val.defaults.temp[4]; break;
    case 6 : set_val.temp = set_val.defaults.temp[5]; set_val.max_t = true; break;
    default : 
      set_val.temp = set_val.defaults.temp[2]; 
      value = 3; 
      break;
  }

  UI.set.temp(set_val.temp);
}

UI.loading = (act) => {
  if(act){
    $('#loading').fadeIn();
  }else{
    $('#loading').fadeOut();
  }
}

UI.closeBox = () => {
  $('#mode_btn img').attr('src','asset/arrow_down.svg');

  UI.dialogBox(false,{is_save:false})
  UI.selectBox(false,1)
  UI.optionBox(false)
}

UI.dialogBox = (act,param) => {
  if(set_val.dimmed) return;


  if(act==true){
    UI.loading(true);
    UI.target = param.target;
    $('#dialogBox').html(UI._dialogTpl(param));

    setTimeout(()=>{
      $('body').addClass('scroll_fix');
      $('.overlay').show();
      $('#dialog').fadeIn(()=>{
        UI._setDialogAction();
      });
      UI.loading(false);
    },200)
  }else{
    if(param.is_save){
      var v = parseInt($('#dialog .val').text());
      if(UI.target=='bright'){
        UI.set.bright(v);
      }else if(UI.target=='temp'){
        UI.set.temp(v);
      }
      $('#mode_btn > .text').text('NORMAL');
    }
    $('body').removeClass('scroll_fix');
    $('#dialog').fadeOut(() => {
      $('.overlay').hide();
      $('#dialogBox').html("");
    });
  }
}

UI.selectBox = (act,param) => {
  if(set_val.dimmed) return;

  if(act==true){
    var top = -40;
    if(param.type != 'fade_out'){
      top = 360;
      $('#mode_btn img').attr('src','asset/arrow_up.svg');
    }
    if(set_val.main_dimmed) return;

    $('#selectBox').html(UI._selectTpl(param));

    $('body').addClass('scroll_fix');
    $('.overlay').show();
    $('#select_box').animate({
      top: top
    },300,() => {

    });
  }else{
    $('body').removeClass('scroll_fix');
    $('#select_box').animate({
      top:3000
    },300,() => {
      $('.overlay').hide();
      $('#selectBox').html("");
    });
  }
}

UI.set = {
  main_light : (value) => {
    if(set_val.dimmed) return;

    var ml_status = document.getElementById(value.id).checked;
    if(ml_status){
      $('#main_light_fn .sub_text').css('color','#3695dd').html('On')
    }else{
      $('#main_light_fn .sub_text').css('color','#979797').html('Off')
    }
    set_val.main_dimmed = !ml_status;
    UI._setMainLightDimmed(set_val.main_dimmed);
  },
  mood_lamp : (value) => {
    if(set_val.dimmed) return;
    var ml_status = document.getElementById(value.id).checked;
    if(ml_status){
      $('#mood_lamp_fn .sub_text').css('color','#3695dd').html('On')
    }else{
      $('#mood_lamp_fn .sub_text').css('color','#979797').html('Off')
    }
  },
  bright : (value) => {
    if(set_val.dimmed) return;

    set_val.bright = value;
    $('#bright').slider('setValue',parseInt(130/100*value));
    $('#bright-i').html(value + '%');
  },
  temp : (value) => {
    if(set_val.dimmed) return;

    set_val.temp = value;
    $('#temp').slider('setValue',set_val.defaults.temp.indexOf(value)+1);
    $('#temp-i').html(value + 'K');
  },
  option : () => {

    set_val.is_save = set_val.is_save ? false : true;

    if(set_val.is_save){
      $('#option_save').attr('src','asset/check_on.svg');
    }else{
      $('#option_save').attr('src','asset/check_off.svg');
    }
  },
  fade_out : (value) => {
    if(set_val.dimmed) return;

    $(value).css('color','#3695dd');

  // it could be off, 30, 60, 90....
    var val = $(value).text().split(' ')[0];

    val = parseInt(val)? val + ' minutes' : val;
    $('#timer .sub_text').text(val);

    UI.closeBox();
  },
  mode : (value) => {
    if(set_val.dimmed) return;

    $($('.card .list')[value]).css('color','#3695dd');
    var item = user_define_sample[value];
    UI.set.bright(item.bright);
    UI.set.temp(item.temp);

    $('#mode_btn .text').text(item.name.toUpperCase())
    UI.closeBox();
  }
}

UI.optionBox = (act) => {
  if(act==true){
    $('#optionBox').html(UI._optionTpl);
    $('.overlay-white').show();
    $('#option_box').show();
  }else{
    $('#option_box').hide();
    $('.overlay-white').hide();
  }
}

UI.powerCtrl = () => {
  UI.power = UI.power ? false : true;
  if(UI.power==true){
    set_val.dimmed = false;
    $('#power_btn').removeClass('power_off').addClass('power_on');
    $('#power_btn .btn').attr('src','asset/power_on.png');
    $('#power_btn .text').html('On')
  }else{
    set_val.dimmed = true;
    $('#power_btn').removeClass('power_on').addClass('power_off');
    $('#power_btn .btn').attr('src','asset/power_off.png');
    $('#power_btn .text').html('Off')
  }

  UI._setPowerDimmed(set_val.dimmed);
}

UI._setPowerDimmed = (value) => {
  if(value){
    document.getElementById("main_light").checked = false;
    document.getElementById("mood_lamp").checked = false;

    $('#main_light').attr('disabled',true);
    $('#mood_lamp').attr('disabled',true);
    $('.dimmed-overlay').css('display','block');

    $('#mode_btn').addClass('dimmed-btn');
    $('#main_light_fn').addClass('dimmed');
    $('#brightness').addClass('dimmed');
    $('#color_temperature').addClass('dimmed');
    $('#timer').addClass('dimmed');
    $('#mood_lamp_fn').addClass('dimmed');
  }else{
    document.getElementById("main_light").checked = true;

    $('#main_light').attr('disabled',false);
    $('#mood_lamp').attr('disabled',false);
    $('.dimmed-overlay').css('display','none');

    $('#mode_btn').removeClass('dimmed-btn');
    $('#main_light_fn').removeClass('dimmed');
    $('#brightness').removeClass('dimmed');
    $('#color_temperature').removeClass('dimmed');
    $('#timer').removeClass('dimmed');
    $('#mood_lamp_fn').removeClass('dimmed');
  }
}

UI._setMainLightDimmed = (value) => {
  if(value){
    $('.dimmed-overlay').css('display','block');

    $('#brightness').addClass('dimmed');
    $('#color_temperature').addClass('dimmed');
    $('#timer').addClass('dimmed');
  }else{
    $('.dimmed-overlay').css('display','none');

    $('#brightness').removeClass('dimmed');
    $('#color_temperature').removeClass('dimmed');
    $('#timer').removeClass('dimmed');
  }
}

// dialog box area
UI._dialogTpl = (tpl_param) => {
  var max_src = '';
  var min_src = '';
  if(tpl_param.target[0]=='b'){
    max_src = set_val.max_b ? 'asset/set_plus_dim.png' : 'asset/set_plus_normal.png';
    min_src = set_val.min_b ? 'asset/set_plus_dim.png' : 'asset/set_minus_normal.png';
  }else{
    max_src = set_val.max_b ? 'asset/set_plus_dim.png' : 'asset/set_plus_normal.png';
    min_src = set_val.min_b ? 'asset/set_plus_dim.png' : 'asset/set_minus_normal.png';
  }

  return [
    '<div id="dialog" class="dialog_box">',
      '<img class="plus act_btn" src="',
      max_src
      ,'" onclick="FN.dialog_ctrl(true)">',
      '<div class="title">', tpl_param.title ,'</div>',
      '<div>',
       ' <span class="val">',tpl_param.current,'</span>',
        '<span class="unit">',tpl_param.unit,'</span>',
      '</div>',
      '<img class="minus act_btn" src="',
      min_src
      ,'" onclick="FN.dialog_ctrl(false)">',
      '<div class="footer">',
        '<div onclick="UI.dialogBox(false,{is_save:true})">DONE</div>',
        '<div onclick="UI.dialogBox(false,{is_save:false})">CANCEL</div>',
      '</div>',
    '</div>'
  ].join("")
};

// option area
UI._optionTpl = () => {
  var chk = set_val.is_save ? 'check_on.svg' : 'check_off.svg';

  return [
      '<div id="option_box" class="option_box">',
        '<div class="text roboto-ragular">Save Last State</div>',
        '<img id="option_save" src="asset/',chk,'" class="save" onclick="UI.set.option()"/>',
        '<div class="text roboto-ragular" onclick="javascript:location.href=\'info.html\'">Information</div>',
      '</div>'
      ].join("")
};

UI._listTpl = (tpl) => {
  var template = '';

  for(i in tpl){
    var piece = [
      '<div class="list">',
      '<img class="right_btn" src="asset/next_blk.svg" onclick="page_move(',
      i,
      ')"/>',
      '<div class="main_text">',
      tpl[i].name,
      ' mode</div>',
      '<div class="sub_text">Brightness : ',
      tpl[i].bright,
      ' %, Color Temp : ',
      tpl[i].temp,
      ' K</div>',
      '</div>'
    ].join("");
    
    template = template + piece;
  }

  $('.card').append(template);
}

// select box area
UI._selectTpl = (tpl_param) => {

  if(tpl_param.type=="fade_out"){
    var itemlist = '<div class="card list" onclick="UI.set.fade_out(this)">Off</div>';

    for(i in tpl_param.items){
      var vl = tpl_param.items[i];
      itemlist = itemlist + '<div class="card list" onclick="UI.set.fade_out(this)">'+ vl +' minutes</div>';
    }
  }else if(tpl_param.type=="mode"){
    var itemlist = '';
    for(i in tpl_param.items){
      var vl = tpl_param.items[i];
      itemlist = itemlist + '<div class="card list" onclick="UI.set.mode('+i+')">'+ vl.name +'</div>';
    }
  }

  var tpl = [
  '<div id="select_box" class="select_box">',
    '<div class="card list top">',
    tpl_param.title,
    '</div>',
    '<div class="card lists ',
    tpl_param.type,
    '">',
      itemlist,
    '</div>',
    '<div class="card list footer" onclick="UI.closeBox(false)">CANCEL</div>',
  '</div>'
  ].join("");
  return tpl;
};


// dialog action button controller
UI._setDialogAction = () => {
  $('#dialog .act_btn').on('click',(e)=>{
    var type = {
      mx : e.target.parentElement.children[1].innerText[0] == 'b' ? set_val.max_b : set_val.max_t,
      mn : e.target.parentElement.children[1].innerText[0] == 'b' ? set_val.min_b : set_val.min_t
    };
    var btn = e.target.className.split(' ')[0];
    var plus_src = '';
    var minus_src = '';
    switch(btn){
      case 'plus' : 
        plus_src = 'asset/set_plus_focus.png';
        minus_src = 'asset/set_minus_normal.png';
        break;
      case 'minus' : 
        plus_src = 'asset/set_plus_normal.png';
        minus_src = 'asset/set_minus_focus.png';
        break;
    }
    $('.plus')[0].src = type.mx ? 'asset/set_plus_dim.png' : plus_src;
    $('.minus')[0].src = type.mn ? 'asset/set_plus_dim.png' : minus_src;
  });
}

UI.toast = (msg,fn) => {
  var toastTpl = ['<div class="toast">',msg,'</div>'].join("");
  $('body').append(toastTpl);
  $('.toast').fadeIn();
  setTimeout(()=>{
    $('.toast').fadeOut(()=>{
      $('.toast').remove();
    })
    if(fn){
      fn();
    }
  },1500)
}

window.onload = () => {
  $('body').css('visibility','visible')
}


