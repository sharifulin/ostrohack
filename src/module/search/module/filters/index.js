
  basis.require('basis.ui');

  var filters = new basis.ui.Node({
    template: resource('template/filters.tmpl'),
    binding: {
      hotelExtra: resource('module/hotelExtra/index.js').fetch(),
      hotelType: resource('module/hotelType/index.js').fetch(),
      hotelCities: resource('module/hotelCities/index.js').fetch()
    }
  });

  module.exports = filters;