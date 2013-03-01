
  basis.require('basis.entity');
  basis.require('app.service');

  var Hotel = resource('hotel.js').fetch();

  var Suggestion = new basis.entity.EntityType({
    fields: {
      id: basis.entity.IntId,
      name: String,
      price: function(value){
        return parseInt(value, 10);
      },
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
      }
    },
    aliases: {
      ostrovok_id: 'id',
      hotel_amenities: 'amenities'
    }
  });

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
        this.set((data && data.hotels).map(function(raw){
          var data = Suggestion.reader(raw);
          data.price = raw.rooms[0].total_rate;

          var rating = data.rating;
          delete data.rating;          
          if (rating && rating.total_verbose)
          {
            data.rating_verbose = rating.total_verbose;
            data.rating = rating.total;
          }

          return Suggestion(data);
        }));
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
        filters: data
      });
      searchResultCache[resultId] = dataset;
    }

    return dataset;
  }

  module.exports = Suggestion;
