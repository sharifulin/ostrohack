basis.require('basis.entity');

var nullString = function(value){
  return value == null ? null : String(value);
}

var Destination = new basis.entity.EntityType({
  name: 'Destination',
  fields: {
    pretty_slug: basis.entity.StringId,
    country: nullString,
    country_code: nullString,
    id: Number,
    name: String,
    slug: nullString,
    target: String,
    type: String
  }
});

module.exports = Destination;