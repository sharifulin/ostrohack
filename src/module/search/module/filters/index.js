
  basis.require('basis.ui');

  var filters = new basis.ui.Node({
    autoDelegate: true,
    
    template: resource('template/filters.tmpl'),
    binding: {
      price: resource('module/price/index.js').fetch(),
      stars: resource('module/stars/index.js').fetch(),
      rating: resource('module/rating/index.js').fetch(),
      location: resource('module/location/index.js').fetch(),
      amenities: resource('module/amenities/index.js').fetch(),
      type: resource('module/type/index.js').fetch(),
      name: resource('module/name/index.js').fetch(),
      cities: resource('module/cities/index.js').fetch(),
      discounts: resource('module/discounts/index.js').fetch()
    }
  });

  module.exports = filters;