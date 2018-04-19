var OCF = {
  className: 'OCF maltani',
  device : null,
  parameter : {
    power : false,
    primary : false,
    mood : false,
    dim : 0,
    ct : 0,
    ft : 0,
    preference : false
  },
  init : function(){
    scplugin.manager.getOCFDevices(function(devices){
      console.log("getOCFDeviceCB : " + devices.length);
      
      for (var i in devices) {
        console.log("deviceHandle: " + devices[i].deviceHandle);
        console.log("deviceName: " + devices[i].deviceName);
        console.log("deviceType: " + devices[i].deviceType);
        console.log("metadata: " + devices[i].metadata);
      }
      OCF._setDevice(devices[0]);
      if(!sub_html || sub_html == 'index'){
        OCF._setListener();
        OCF.getAll();
      }else{
        OCF.loading(false);
      }
    });
  },
  close : function(){
    scplugin.manager.close();
  },
  loading :function(on){
    if(on){
      $('#bg-mask').fadeIn();
    }else{
      $('#bg-mask').fadeOut();
    }
  },
  getPower : function(){
    OCF.device.getRemoteRepresentation("/capability/switch/main/0", OCF._onResponseCallback);
  },
  setPower : function(param){
    var power = 'off';
    OCF.parameter.power = param;

    if(param){
      power = 'on';
    }
    OCF.device.setRemoteRepresentation("/capability/switch/main/0", {power:power}, OCF._onResponseCallback);
  },
  getPrimaryPower : function(){
    OCF.device.getRemoteRepresentation("/capability/switch/primary/0", OCF._onResponseCallback);
  },
  setPrimaryPower : function(param){
    var primary = 'off';
    OCF.parameter.primary = param;

    if(param){
      primary = 'on';
    }
    OCF.device.setRemoteRepresentation("/capability/switch/primary/0", {power:primary}, OCF._onResponseCallback);
  },
  getMoodPower : function(){
    OCF.device.getRemoteRepresentation("/capability/switch/mood/0", OCF._onResponseCallback);
  },
  setMoodPower : function(param){
    var mood = 'off';
    OCF.parameter.mood = param;

    if(param){
      mood = 'on';
    }
    OCF.device.setRemoteRepresentation("/capability/switch/mood/0", {power:mood}, OCF._onResponseCallback);
  },
  getDim : function(){
    OCF.device.getRemoteRepresentation("/capability/switchLevel/main/0", OCF._onResponseCallback);
  },
  setDim : function(param){
    OCF.parameter.dim = param - 1;
    OCF.device.setRemoteRepresentation("/capability/switchLevel/main/0", {dimmingSetting:OCF.parameter.dim}, OCF._onResponseCallback);
  },
  getCT : function(){
    OCF.device.getRemoteRepresentation("/capability/colorTemperature/main/0", OCF._onResponseCallback);
  },
  setCT : function(param){
    OCF.parameter.ct = param - 1;
    OCF.device.setRemoteRepresentation("/capability/colorTemperature/main/0", {ct:OCF.parameter.ct}, OCF._onResponseCallback);
  },
  getFT : function(){
    OCF.device.getRemoteRepresentation("/capability/powerMeter/main/0", OCF._onResponseCallback);
  },
  setFT : function(param){
    OCF.parameter.ft = param - 1;
    OCF.device.setRemoteRepresentation("/capability/powerMeter/main/0", {power:OCF.parameter.ft}, OCF._onResponseCallback);
  },
  getPreference : function(){
    OCF.device.getRemoteRepresentation("/capability/valve/main/0", OCF._onResponseCallback);
  },
  setPreference : function(param){
    OCF.parameter.preference = param;
    OCF.device.setRemoteRepresentation("/capability/valve/main/0", {valve:OCF.parameter.preference}, OCF._onResponseCallback);
  },
  getAlarm : function(){
    OCF.device.getRemoteRepresentation("/capability/alarm/main/0", OCF._onResponseCallback);
  },
  setAlarm : function(param){
    OCF.device.setRemoteRepresentation("/capability/alarm/main/0", {alarm:param}, OCF._onResponseCallback);
  },
  getUDM : function(){
    OCF.device.getRemoteRepresentation("/capability/tvChannel/main/0", OCF._onResponseCallback);
  },
  setUDM : function(param){
    var udmstring = JSON.stringify(param);
    OCF.device.setRemoteRepresentation("/capability/tvChannel/main/0", {tvChannel:udmstring}, OCF._onResponseCallback);
  },
  getAll : function(){
    OCF.device.getRemoteRepresentation("/capability/tvChannel/allState/0", OCF._onResponseCallback);
  },
  _setDevice : function(device){
    scplugin.log.debug(OCF.className, arguments.callee.name, "set ocf device : " + device.deviceName);

    OCF.device = device;
    console.log('Device set successfuly');
  },
  _setListener : function(){
    OCF.device.subscribe(OCF._onResponseCallback);
  },
  _onResponseCallback : function(result,deviceHandle,uri,jsonStr){
    scplugin.log.debug(OCF.className, arguments.callee.name, result);
    scplugin.log.debug(OCF.className, arguments.callee.name, uri);

    if(result == "OCF_OK" || result == "OCF_RESOURCE_CHANGED" || result == "OCF_RES_ALREADY_SUBSCRIBED"){
      switch(uri){
        case '/capability/switch/main/0' :
          OCF._refreshPower(jsonStr['power']);
          break;
        case '/capability/switch/primary/0' :
          OCF._refreshPrimaryPower(jsonStr['power']);
          break;
        case '/capability/switch/mood/0' :
          OCF._refreshMoodPower(jsonStr['power']);
          break;
        case '/capability/switchLevel/main/0' :
          OCF.parameter.dim = parseInt(jsonStr['dimmingSetting'])? parseInt(jsonStr['dimmingSetting'])+1 : 1;
          OCF._refreshDim();
          break;
        case '/capability/colorTemperature/main/0' :
          OCF.parameter.ct = parseInt(jsonStr['ct'])? parseInt(jsonStr['ct'])+1 : 1;
          OCF._refreshCT();
          break;
        case '/capability/powerMeter/main/0' :
          OCF.parameter.ft = parseInt(jsonStr['power'])? parseInt(jsonStr['power']) : 0;
          OCF._refreshFT();
          break;
        case '/capability/valve/main/0' :
          OCF.parameter.preference = jsonStr['valve'];
          OCF._refreshPreference();
          break;
        case '/capability/alarm/main/0' :
          var alarm = jsonStr['alarm'];
          if(alarm){
            OCF._refreshAlarm(alarm);
          }
          break;
        case '/capability/tvChannel/main/0' :
          var udm = {};
          if(jsonStr['tvChannel'] && jsonStr['tvChannel'] !=''){
            sessionStorage.setItem('setting',jsonStr['tvChannel']);
            udm = JSON.parse(jsonStr['tvChannel']);
          }else{
            udm = JSON.parse(sessionStorage.getItem('setting'));
          }
          OCF._refreshUDM(udm);
          break;
        case '/capability/tvChannel/allState/0' :
          if(jsonStr['tvChannel'] && jsonStr['tvChannel'] !=''){
            var all = JSON.parse(jsonStr['tvChannel']);
            OCF._refreshAll(all);
          }
          break;
      }
    }
  },
  _refreshPower : function(param){
    OCF.parameter.power = param == 'on' ? true : false;
    power_btn_change(OCF.parameter.power);
    OCF.loading(false);
  },
  _refreshPrimaryPower : function(param){
    OCF.parameter.primary = param == 'on' ? true : false;
    document.getElementById("cmn-toggle-2").checked = OCF.parameter.primary;
    OCF.loading(false);
  },
  _refreshMoodPower : function(param){
    OCF.parameter.mood = power == 'on' ? true : false;
    document.getElementById("cmn-toggle-3").checked = OCF.parameter.mood;
    OCF.loading(false);
  },
  _refreshDim : function(){
    document.getElementById("ex1SliderVal").innerHTML = OCF.parameter.dim;
    $('#ex1').slider('setValue', OCF.parameter.dim);
    OCF.loading(false);
  },
  _refreshCT : function(){
    document.getElementById("ex2SliderVal").innerHTML = OCF.parameter.ct;
    $('#ex2').slider('setValue', OCF.parameter.ct);
    OCF.loading(false);
  },
  _refreshFT : function(){
    document.getElementById("ex3SliderVal").innerHTML = OCF.parameter.ft;
    $('#ex3').slider('setValue', OCF.parameter.ft);
    OCF.loading(false);
  },
  _refreshAlarm : function(alarm){
    if(alarm == 'off'){
      $('#alarmModal').modal('hide');
    }else{
      $('#alarmModal').modal('show');
    }
    OCF.loading(false);
  },
  _refreshUDM : function(arr){
    if(!sub_html || sub_html == 'index'){
      set_custom_setting(arr.custom);
    }else{
      clear_lib();
    }
    OCF.loading(false);
  },
  _refreshPreference : function(){
    document.getElementById('modal-toggle').checked = OCF.parameter.preference;
    OCF.loading(false);
  },
  _refreshAll : function(arr){
    var subloaded = sessionStorage.getItem('sub_loaded');
    if(subloaded != '1'){
      set_init(arr);
      OCF.loading(false);
    }else{
      OCF.getPower();
      OCF.getPrimaryPower();
      OCF.getMoodPower();
      OCF.getDim();
      OCF.getCT();
      OCF.getFT();
      OCF.getPreference();
      OCF.getAlarm();

      //inserted by leon
      OCF.getUDM();

      setTimeout(function(){
        $('#content').css('visibility','visible');
      },100);
    }
  }
};
