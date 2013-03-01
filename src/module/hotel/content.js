basis.require('basis.ui');
basis.require('app.type');  

// basis.l10n.createDictionary('app.module.hotel', __dirname + 'l10n', {

// });

var templates = basis.template.define('app.module.hotel', {
  View: resource('template/view.tmpl'),
  Hotel: resource('template/hotel.tmpl'),
  Room: resource('template/room.tmpl')
});

/*basis.template.theme('mobile').define({
  View: resource('template/module/view.tmpl'),
  Hotel: resource('template/mobile/hotel.tmpl'),
  Room: resource('template/mobile/room.tmpl')
});*/


//
// hotel images
//


//
// hotel 
//
var hotel = new basis.ui.Node({
  template: templates.Hotel,

  binding: {
    slider: resource('module/slider/index.js').fetch(),
    name: 'data:',
    address: 'data:',
    low_rate: 'data:'
  }
});

//
// rooms
//
var rooms = new basis.ui.Node({
  childClass: {
    template: templates.Room,
    binding: {
      name: 'data:',
      current_allotment: 'data:',
      description: 'data:',
      total_rate: 'data:',
      size: 'data.room_type.data.size'
    }
  }
});

//
// view
//
var hotelView = new basis.ui.Node({
  active: true,
  template: templates.View,
  binding: {
    hotel: hotel,
    rooms: rooms
  },

  handler: {
    update: function(){
      if (this.data.hotel)
        this.satellite.hotel.setDelegate(this.data.hotel);
      
      if (this.data.rooms)
        this.satellite.rooms.setDataSource(this.data.rooms);
    }
  }
});

basis.router.add('/hotel?*params', function(params){
  var params_pares = params.split('&');
  var hotelData = {};

  for (var i = 0; i < params_pares.length; i++)
  {
    var pare = params_pares[i].split('=');
    hotelData[pare[0]] = pare[1];
  }

  hotelView.setDelegate(app.type.HotelReport(app.type.HotelReport.reader(hotelData)));
});

//
// exports
//
module.exports = hotelView;