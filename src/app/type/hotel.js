
  basis.require('basis.entity');

  var Hotel = new basis.entity.EntityType({
    fields: {
      id: basis.entity.IntId,
      name: String
    }
  });

  module.exports = Hotel;