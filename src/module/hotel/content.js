basis.require('basis.ui');
basis.require('basis.ui.tabs');
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
  from: 'from',
  description: 'Description',
  rooms: 'Rooms',
  descriptionPageTitle: 'Description',
  roomsPageTitle: 'Rooms'
});

basis.l10n.createDictionary(namespace + '.night', __dirname + 'l10n', {
  'for': 'for',
  night1: 'night',
  night2: 'nights',
  night3: 'nights'
});


var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/mobile/index.js').fetch());

var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');

var rooms = resource('module/rooms/index.js').fetch();
var description = resource('module/description/index.js').fetch();

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
// hotel info page control
//

var infoPages = new basis.ui.tabs.PageControl({
  autoDelegate: true,
  autoSelectChild: false,
  
  template: templates.InfoPages,

  childClass: {
    template: templates.InfoPage,
    binding: {
      title: 'title'
    },
    action: {
      back: function(){
        this.unselect();
      }
    }
  },
  childNodes: [
    {
      name: 'rooms',
      title: basis.l10n.getToken(namespace, 'roomsPageTitle'),
      childNodes: rooms
    },
    {
      autoDelegate: true,
      name: 'description',
      title: basis.l10n.getToken(namespace, 'descriptionPageTitle'),
      childNodes: description
    }
  ],
  selection: {
    handler: {
      datasetChanged: function(){
        hotelView.pageSelected = !!this.pick();
        hotelView.updateBind('pageSelected');
      }
    }
  }
});

//
// hotel menu
//
var hotelMenu = new basis.ui.Node({
  autoDelegate: true,
  template: templates.Menu,
  binding: {
    address: 'data:'
  },
  action: {
    rooms: function(){
      infoPages.item('rooms').select();
    },
    description: function(){
      infoPages.item('description').select();
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
    stars: 'data:',
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
var hotelSlider = new app.ext.Slider({
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
    viewallHref: 'data:',
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
  pageSelected: false,

  template: templates.View,
  binding: {
    header: hotelHeader,
    slider: hotelSlider,
    rating: rating,
    
    menu: hotelMenu,
    infoPages: infoPages,

    settings: new app.ext.Settings({
      autoDelegate: false,
      delegate: hotelObject
    }),

    pageSelected: 'pageSelected',
    
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
    has_rating: {
      events: 'update',
      getter: function(object){
        return object.data.rating && object.data.rating.exists;
      }
    }
  }
});

basis.router.add('/hotel/:type/rooms?*params', function(type, params){
  var params_pares = params.split('&');
  var hotelData = {
    type: type
  };

  for (var i = 0; i < params_pares.length; i++)
  {
    var pare = params_pares[i].split('=');
    hotelData[pare[0]] = pare[1];
  }

  var dateParts;

  if (!hotelData.arrivalDate)
    hotelData.arrivalDate = (new Date()).add('day', 2).toFormat('%D-%M-%Y');
  
  dateParts = hotelData.arrivalDate.split('-');
  hotelData.arrivalDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

  if (!hotelData.departureDate)
    hotelData.departureDate = (new Date()).add('day', 3).toFormat('%D-%M-%Y');

  dateParts = hotelData.departureDate.split('-');
  hotelData.departureDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

  if (!hotelData.room1_numberOfAdults)
    hotelData.room1_numberOfAdults = 2;

  hotelObject.setDelegate(app.type.HotelReport(app.type.HotelReport.reader(hotelData)));
});

//
// exports
//
module.exports = hotelView;