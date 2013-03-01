
  basis.require('basis.entity');
  basis.require('app.service');

  module.exports = {
    Hotel: resource('type/hotel.js').fetch(),
    Suggestion: resource('type/suggestion.js').fetch()
  };