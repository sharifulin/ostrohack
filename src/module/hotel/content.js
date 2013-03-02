basis.require('basis.ui');
basis.require('app.type');  

// basis.l10n.createDictionary('app.module.hotel', __dirname + 'l10n', {

// });

var templates = basis.template.define('app.module.hotel', {
  View: resource('template/view.tmpl'),
  Room: resource('template/room.tmpl'),
  RoomAmenity: resource('template/roomAmenity.tmpl'),
  Rating: resource('template/rating.tmpl')
});

var Slider = resource('module/slider/index.js').fetch();

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
      slider: 'satellite:',
      amenities: 'satellite:',
      name: 'data:',
      visible: 'visible',
      current_allotment: 'data:',
      size: 'data.room_type.data.size',
      description: 'data.room_type.data.description || ""',
      total_rate: {
        events: 'update',
        getter: function(object){
          return object.data.total_rate.format(0, '\x0A', '', '', '.');
        }
      }
    },
    action: {
      toggle: function(){
        this.visible = !this.visible;
        this.updateBind('visible');
      }
    },
    satelliteConfig: {
      slider: {
        instanceOf: Slider
      },
      amenities: {
        instanceOf: basis.ui.Node.subclass({
          childClass: {
            template: templates.RoomAmenity,
            binding: {
              title: 'title',
              value: 'value'
            }
          }
        })
      }
    },
    templateUpdate: function(){
      var images = (this.data.room_type && this.data.room_type.data.room_type_image_list || []).map(function(url){
        return basis.data({
          url: url
        });
      })
      
      this.satellite.slider.setChildNodes(images);

      // aminities
      var res = [];
      var amenities = (this.data.room_type && this.data.room_type.data.amenities);
      for (var key in amenities)
      {
        res.push({
          title: key,
          value: amenities[key].join(', ')
        });
      }
      this.satellite.amenities.setChildNodes(res);
    }
  }
});

//
// rating
//
var rating = new basis.ui.Node({
  template: templates.Rating,
  
  binding: {
    count: 'data:count',
    total_verbose: 'data:total_verbose',
    total: {
      events: 'update',
      getter: function(object){
        return object.data.total && object.data.total.toFixed(1);
      }
    }
  }
});

//
// view
//
var hotelSlider = new Slider({
  autoDelegate: true,
  active: true,
  handler: {
    targetChanged: function(){
      this.setDataSource(this.target ? app.type.HotelImage.byHotel.getSubset(this.target.getId(), true) : null);
    }
  }  
});

var hotelView = new basis.ui.Node({
  template: templates.View,
  binding: {
    slider: hotelSlider,
    rating: rating,
    rooms: rooms,
    
    name: 'data:',
    address: 'data:',
    low_rate: {
      events: 'update',
      getter: function(object){
        return object.data.low_rate && object.data.low_rate.format(0, '\x0A', '', '', '.');
      }
    },
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