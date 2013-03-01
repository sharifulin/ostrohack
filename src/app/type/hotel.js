
  basis.require('basis.entity');

  var Hotel = new basis.entity.EntityType({
    fields: {
      id: basis.entity.IntId,
      name: String,
      city: String,
      address: String,
      description: String,
      description_short: String,
      thumbnail_url: String,
      low_rate: Number,
      hotel_amenities: basis.array.from
    }
  });

  module.exports = Hotel;