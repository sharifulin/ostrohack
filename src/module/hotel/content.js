basis.require('basis.ui');
basis.require('app.type');  

// basis.l10n.createDictionary('app.module.hotel', __dirname + 'l10n', {

// });

var templates = basis.template.define('app.module.hotel', {
  View: resource('template/view.tmpl'),
  Room: resource('template/room.tmpl'),
  Rating: resource('template/rating.tmpl')
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
      rating.update(this.data.hotel && this.data.hotel.data.rating);
    } 
  }
});

//
// rooms
//
var rooms = new basis.ui.Node({
  childClass: {
    visible: false,
    template: templates.Room,
    binding: {
      name: 'data:',
      current_allotment: 'data:',
      description: 'data:',
      size: 'data.room_type.data.size',
      total_rate: {
        events: 'update',
        getter: function(object){
          return object.data.total_rate.format(0, '\x0A', '', '', '.');

        }
      },
      visible: function(object){
        return object.visible ? 'b-hotel-room-details_state_visible' : '';
      }
    },
    action: {
      toggle: function(){
        this.visible = !this.visible;
        this.updateBind('visible');
      }
    }
  }
});

//
// rating
//
var rating = new basis.ui.Node({
  template: templates.Rating,
  
  binding: {
    total_verbose: 'data:total_verbose',
    total: 'data:total',
    count: 'data:count'
  }
});

//
// view
//
var hotelView = new basis.ui.Node({
  template: templates.View,
  binding: {
    slider: resource('module/slider/index.js').fetch(),
    rating: rating,
    rooms: rooms,
    
    name: 'data:',
    address: 'data:',
    low_rate: 'data:low_rate || 0',
    descr: 'data:description',
    has_rating: {
      events: 'update',
      getter: function(object){
        return object.data.rating && object.data.rating.exists;
      }
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

  hotelObject.setDelegate(app.type.HotelReport(app.type.HotelReport.reader(hotelData)));
});

//
// exports
//
module.exports = hotelView;