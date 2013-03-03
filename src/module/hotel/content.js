basis.require('basis.ui');
basis.require('app.type');  
basis.require('app.ext');  

var namespace = 'app.module.hotel';
basis.require('basis.date');

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  loading: 'Loading...',
  book: 'Book now',
  garant: 'Garant Label',
  garantInfo: 'Garant Info',
  photos: 'Photos',
  map: 'Map',
  reviews: 'Reviews',
  availableRooms: 'All available rooms',
  'viewAll': 'Show all hotels',
  'change': 'change',
  from: 'from'
});

basis.l10n.createDictionary(namespace + '.room.left', __dirname + 'l10n', {
  left1: 'Only 1 left',
  left2: 'Only 2 rooms left',
  left3: '3 rooms left',
  left4: '4 rooms left',
  left5: '5 rooms left'
});

basis.l10n.createDictionary(namespace + '.night', __dirname + 'l10n', {
  'for': 'for',
  night1: 'night',
  night2: 'nights',
  night3: 'nights'
});


var templates = basis.template.define(namespace, {
  View: resource('template/view.tmpl'),
  Room: resource('template/room.tmpl'),
  RoomAmenity: resource('template/roomAmenity.tmpl'),
  Rating: resource('template/rating.tmpl'),
  Header: resource('template/header.tmpl'),
  Settings: resource('template/settings.tmpl')
});


/*basis.template.theme('mobile').define({
  View: resource('template/module/view.tmpl'),
  Hotel: resource('template/mobile/hotel.tmpl'),
  Room: resource('template/mobile/room.tmpl')
});*/

var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');
var Slider = resource('module/slider/index.js').fetch();

var hotelObject = new basis.data.DataObject({
  active: true,  
  handler: {
    update: function(){
      rooms.setDataSource(this.data.rooms);
      hotelView.setDelegate(this.data.hotel);
      rating.update(this.data.hotel && this.data.hotel.data.rating);
    },
    stateChanged: function(){
      hotelView.setState(this.state);
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
      thumbnail: 'data.room_type.data.thumbnail',
      
      left: {
        events: 'update',
        getter: function(object){
          return object.data.current_allotment <= 2 ? 'one' : (object.data.current_allotment <= 5 ? 'few' : 'lot');
        }
      },
      leftCount: {
        events: 'update',
        getter: function(object){
          return object.data.current_allotment <=5 ? basis.l10n.getToken(namespace, 'room.left', 'left' + object.data.current_allotment) : '';
        }
      },
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
// slider
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



//
// header
//
var hotelHeader = new basis.ui.Node({
  delegate: hotelObject,
  template: templates.Header,
  binding: {
    settings: new app.ext.Settings({}),
    viewallText: 'data:',
    viewallHref: 'data:'
  },
  action: {
    changeSettings: function(){
      searchFormPopup().setDelegate(this.root);
      searchFormPopup().open();
    }
  }
});

//
// view
//
var hotelView = new basis.ui.Node({
  template: templates.View,
  binding: {
    slider: hotelSlider,
    rating: rating,
    rooms: rooms,
    header: hotelHeader,
    settings: new app.ext.Settings({
      autoDelegate: false,
      delegate: hotelObject
    }),
    
    name: 'data:',
    address: 'data:',
    stars: 'data:',
    
    nights: 'data:',
    nightsText: {
      events: 'update',
      getter: function(object){
        return basis.l10n.getToken('app.module.hotel.night', 'night' + app.utils.plural(object.data.nights));
      }
    },
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

  var dateParts = hotelData.arrivalDate.split('-');
  hotelData.arrivalDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

  dateParts = hotelData.departureDate.split('-');
  hotelData.departureDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

  hotelObject.setDelegate(app.type.HotelReport(app.type.HotelReport.reader(hotelData)));
});

//
// exports
//
module.exports = hotelView;