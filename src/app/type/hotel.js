
  basis.require('basis.entity');
  basis.require('app.service');

  var Hotel = new basis.entity.EntityType({
    name: 'Hotel',
    fields: {
      id: basis.entity.IntId,
      name: String,
      city: String,
      address: String,
      description: String,
      description_short: String,
      thumbnail_url: String,
      low_rate: Number,
      rating: basis.fn.$self,
      hotel_amenities: basis.array.from
    }
  });

  module.exports = Hotel;