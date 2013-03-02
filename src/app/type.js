
  basis.require('basis.entity');
  basis.require('app.service');

  module.exports = {
    Hotel: resource('type/hotel.js').fetch(),
    Suggestion: resource('type/suggestion.js').fetch(),
    Room: resource('type/room.js').fetch(),
    HotelReport: resource('type/hotelReport.js').fetch(),
    HotelImage: resource('type/hotelImage.js').fetch(),
    Destination: resource('type/destination.js').fetch()
  };