  
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
      arrivalDate: Number,
      departureDate: Number,
      adultsCount: Number,
      childrenCount: Number,
      hotel: Hotel,
      rooms: RoomList
    }
  });

  HotelReport.entityType.entityClass.extend({
    state: basis.data.STATE.UNDEFINED,
    syncAction: app.service.default.createAction({
      url: '/data/hotel.json',
      method: 'GET',
      request: function(){
        return {
          params: {
            arrivalDate: this.data.arrivalDate,
            hotelId: this.data.hotelId,
            departureDate: this.data.departureDate,
            adultsCount: this.data.adultsCount
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