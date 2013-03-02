
  basis.require('basis.ui');

  var filters = new basis.ui.Node({
    template: resource('template/filters.tmpl'),
    binding: {
      hotelExtra: resource('module/amenities/index.js').fetch(),
      hotelType: resource('module/type/index.js').fetch(),
      hotelCities: resource('module/cities/index.js').fetch()
    }
  });

  module.exports = filters;