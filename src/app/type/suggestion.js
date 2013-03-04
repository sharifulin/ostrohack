
  basis.require('basis.entity');
  basis.require('app.service');

  var Hotel = resource('hotel.js').fetch();

  var Suggestion = new basis.entity.EntityType({
    fields: {
      id: basis.entity.IntId,
      name: String,
      price: Number,
      kind: String,
      thumbnail_url: String,
      thumbnail_tmpl: String,
      thumbnail_url_220: String,
      address: String,
      hotel: Hotel,
      rating: Number,
      rating_verbose: String,
      city: String,
      amenities: function(value){
        return value && value.length ? value : null;
      },
      uid: String,
      star_rating: Number,

      longitude: Number,
      latitude: Number,
      distance: Number,

      locative_where_ru: String,
      locative_where_en: String,
      locative_where: String,

      nights: Number,
      arrivalDate: String,
      departureDate: String,
      adults: Number,
      children: Number
    },
    aliases: {
      ostrovok_id: 'id',
      hotel_amenities: 'amenities'
    }
  });

  function distance(lat1, lon1, lat2, lon2){
    function toRad(num){
       return num * Math.PI / 180;
    }
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  var fieldNameList = 'region_id destination room1_numberOfAdults arrivalDate departureDate'.qw();
  var SuggestionList = new basis.data.Dataset.subclass({
    syncAction: app.service.search.createAction({
      controller: 'page/:page',
      request: function(){
        return {
          routerParams: {
            page: this.filters.page,
          },
          params: basis.object.slice(this.filters, fieldNameList)
        }
      },
      success: function(data){
        var nights = data._meta.nights;
        var region = data._meta.region;
        var center = region.center;
        var rates = data._meta.rates;
        var locative_where_ru = region.locative_where_ru;
        var locative_where_en = region.locative_where_en;
        var arrivalDate = this.filters.arrivalDate;
        var departureDate = this.filters.departureDate;
        var adults = this.filters.room1_numberOfAdults;
        var children = this.filters.room1_numberOfChildren || 0;

        this.update({
          nights: nights,
          center: center,
          region: region,
          resultCount: data._hotels_cnt
        });

        this.set((data && data.hotels).map(function(raw){
          var data = Suggestion.reader(raw);

          data.price = raw.rooms[0].total_rate * rates[raw.rooms[0].currency];

          if (data.latitude && data.longitude && center)
            data.distance = distance(center.lat, center.lng, data.latitude, data.longitude);

          data.locative_where_en = locative_where_en;
          data.locative_where_ru = locative_where_ru;
          data.locative_where = locative_where_ru;

          data.nights = nights;

          data.arrivalDate = arrivalDate;
          data.departureDate = departureDate;
          data.adults = adults;
          data.children = children;

          var rating = data.rating;
          delete data.rating;          
          if (rating && rating.total_verbose)
          {
            data.rating_verbose = rating.total_verbose;
            data.rating = rating.total;
          }

          return Suggestion(data);
        }, this));
        this.setState(basis.data.STATE.READY);
      }
    })
  });

  var searchResultCache = {};
  Suggestion.getSearchResult = function(params){
    var data = basis.object.slice(params, fieldNameList);
    data.page = params.page || 1;

    var resultId = fieldNameList.map(function(name){
      return this[name];
    }, data).join('_') + '_' + data.page;
    var dataset = searchResultCache[resultId];

    if (!dataset)
    {
      dataset = new SuggestionList({
        filters: data,
        data: data
      });
      searchResultCache[resultId] = dataset;
    }

    return dataset;
  }

  module.exports = Suggestion;
