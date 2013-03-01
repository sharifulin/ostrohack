var HotelImage = new basis.entity.EntityType({
  name: 'HotelImage',
  fields: {
    hotelId: String,
    url: String
  }    
});

HotelImage.byHotel = new basis.entity.Grouping({
  wrapper: HotelImage,
  source: HotelImage.all, 
  rule: Function.getter('data.hotelId'),
  subsetClass: {
    state: basis.data.STATE.UNDEFINED,
    syncAction: app.service.default.createAction({
      url: '/api/v1/hotelimages/x:hotelId/',
      request: function(){
        return {
          routerParams: {
            hotelId: this.data.id
          }
        }
      },
      success: function(data, request){
        var hotelId = this.data.id;

        this.sync(data.photos.map(function(url){
          return {
            hotelId: hotelId,
            url: url
          }
        }));

        this.setState(basis.data.STATE.READY);
      }
    })
  }
});

module.exports = HotelImage;