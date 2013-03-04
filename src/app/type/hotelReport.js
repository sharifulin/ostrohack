  
  basis.require('basis.entity');
  basis.require('app.service');

  var Hotel = resource('hotel.js').fetch();
  var Room = resource('room.js').fetch();

  var RoomList = new basis.entity.EntitySetType(Room);

  var HotelReport = new basis.entity.EntityType({
    name: 'HotelReport',
    fields: {
      id: basis.entity.IntId,
      hotelId: Number,
      type: String,
      arrivalDate: basis.fn.$self,
      departureDate: basis.fn.$self,
      room1_numberOfAdults: Number,
      room1_numberOfChildren: Number,
      childrenAge: String,
      viewallText: String,
      viewallHref: String,
      hotel: Hotel,
      rooms: RoomList
    }
  });

  HotelReport.entityType.entityClass.extend({
    state: basis.data.STATE.UNDEFINED,
    syncAction: app.service['default'].createAction({
      url: '/eapi/',
      method: 'GET',
      request: function(){
        var params = {
          hotelId: this.data.hotelId,
          arrivalDate: this.data.arrivalDate.toFormat('%D-%M-%Y'),
          departureDate: this.data.departureDate.toFormat('%D-%M-%Y'),
          room1_numberOfAdults: this.data.room1_numberOfAdults,
          room1_numberOfChildren: this.data.room1_numberOfChildren,
          lang: basis.l10n.getCulture().split('-').shift(),
          grouped: true
        }

        if (this.data.room1_numberOfChildren)
        {
          var ages = this.data.childrenAge.split('.');
          for (var i = 1; i <= this.data.room1_numberOfChildren; i++)
            params['room_child' + i + 'Age'] = ages[i - 1];
        }
        
        return {
          params: params,
          routerParams: {
            hotelId: this.data.hotelId
          }
        }
      },
      success: function(data){
        var hotel = data.hotel;

        if (data.hotel)
        {
          var rooms = [];
          for (var i = 0, room_type; room_type = hotel.rooms[i]; i++) 
            rooms = rooms.concat(room_type.rooms);
          
          data.hotel.id = this.data.hotelId;
          data.hotel.low_rate = data._hotelpage && data._hotelpage.lowRate || 0;
          data.hotel.stars = data._hotelpage && data._hotelpage.stars;
          data.hotel.nights = data._meta && data._meta.nights;
          data.hotel.rating.stars = data.hotel.stars;
          
          this.update({
            viewallText: data._viewall && data._viewall.text,
            viewallHref: data._viewall && data._viewall.href,
            hotel: Hotel.reader(data.hotel),
            rooms: rooms.map(Room.reader)
          });
        }

        this.setState(basis.data.STATE.READY);
      }
    })
  });

  module.exports = HotelReport;