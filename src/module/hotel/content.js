basis.require('basis.ui');
basis.require('app.type');  

// basis.l10n.createDictionary('app.module.hotel', __dirname + 'l10n', {

// });

var templates = basis.template.define('app.module.hotel', {
  View: resource('template/view.tmpl'),
  Room: resource('template/room.tmpl')
});

/*basis.template.theme('mobile').define({
  View: resource('template/module/view.tmpl'),
  Hotel: resource('template/mobile/hotel.tmpl'),
  Room: resource('template/mobile/room.tmpl')
});*/

var hotelObject = new basis.data.DataObject({
  active: true,  
  handler: {
    update: function(){
      rooms.setDataSource(this.data.rooms);
      hotelView.setDelegate(this.data.hotel);
    } 
  }
})

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
  template: templates.View,
  binding: {
    slider: resource('module/slider/index.js').fetch(),
    rooms: rooms,
    name: 'data:',
    address: 'data:'
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

  hotelObject.setDelegate(app.type.HotelReport(app.type.HotelReport.reader(hotelData)));
});

//
// exports
//
module.exports = hotelView;