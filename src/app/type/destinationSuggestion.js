
/*var Destination = resource('Destination.js').fetch();
var Hotel = resource('Hotel.js').fetch();*/

var DestinationSuggestion = new basis.entity.EntityType({
  name: 'DestinationSuggestion',
  fields: {
    query: String,
    type: String,
    targetId: Number,
    pretty_slug: String,
    name: String
  }
});

DestinationSuggestion.byQuery = new basis.entity.Grouping({
  wrapper: DestinationSuggestion,  
  source: DestinationSuggestion.all, 
  rule: basis.fn.getter('data.query'),
  subsetClass: {
    syncAction: app.service['default'].createAction({
      url: '/api/site/multicomplete.json',
      poolHashGetter: function(requestData){
        return requestData.params.query;
      },
      request: function(){
        return {
          params: {
            query: this.data.id,
            locale: basis.l10n.getCulture().split('-').shift(),
            decode: 1
          }
        }
      },
      success: function(data){
        if (!data)
          return;

        var res = [];
        var query = this.data.id;


        for (var i = 0, hotel; hotel = data.hotels[i]; i++){
          res.push({
            query: this.data.id,
            type: 'hotel',
            targetId: hotel.hotel_uid.slice(1),
            name: hotel.hotel_name + ', ' + hotel.region_name
          })
        }

        for (var i = 0, region; region = data.regions[i]; i++){
          res.push({
            query: this.data.id,
            type: 'region',
            targetId: region.id,
            pretty_slug: region.pretty_slug,
            name: (region.country ? region.country + ', ' : '') + region.name
          })
        }   

        this.sync(res);
        this.setState(basis.data.STATE.READY);
      }
    })
  }
});

module.exports = DestinationSuggestion;