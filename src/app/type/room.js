basis.require('basis.entity');

var RoomType = new basis.entity.EntityType({
  name: 'RoomType',
  fields: {
    id: basis.entity.IntId,
    name: String,
    description: String,
    size: Number,
    thumbnail: String,
    amenities: basis.fn.$self,
    room_type_image_list: basis.fn.$self
  },
  aliases: {
    room_type_id: 'id'
  }
});

var Room = new basis.entity.EntityType({
  name: 'Room',
  fields: {
    id: basis.entity.IntId,
    name: String,
    room_type: RoomType,
    currency: String,
    current_allotment: Number,
    total_rate: Number,
    size: Number
  }
});

module.exports = Room;