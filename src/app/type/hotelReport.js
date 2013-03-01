  
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
      arrivalDate: String,
      departureDate: String,
      room1_numberOfAdults: Number,
      room1_numberOfChildren: Number,
      hotel: Hotel,
      rooms: RoomList
    }
  });

  HotelReport.entityType.entityClass.extend({
    state: basis.data.STATE.UNDEFINED,
    syncAction: app.service.default.createAction({
      url: '/api/v1/rooms/x:hotelId/',
      method: 'GET',
      request: function(){
        return {
          params: {
            arrivalDate: this.data.arrivalDate,
            hotelId: this.data.hotelId,
            departureDate: this.data.departureDate,
            room1_numberOfAdults: this.data.room1_numberOfAdults,
            room1_numberOfChildren: this.data.room1_numberOfChildren,
            lang: basis.l10n.getCulture().split('-').shift(),
            grouped: true
          },
          routerParams: {
            hotelId: this.data.hotelId
          }
        }
      },
      success: function(data){
        var hotel = data.hotel;

        var rooms = [];
        for (var i = 0, room_type; room_type = hotel.rooms[i]; i++) 
          rooms = rooms.concat(room_type.rooms);

        this.update({
          hotel: Hotel.reader(data.hotel),
          rooms: rooms.map(Room.reader)
        })

        this.setState(basis.data.STATE.READY);
      }
    })
  });

  module.exports = HotelReport;