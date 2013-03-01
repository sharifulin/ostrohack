basis.require('basis.ui.scroller');
basis.require('basis.layout');


var templates = basis.template.define('app.module.hotel.slider', {
  imageList: resource('template/imageList.tmpl'),
  imageItem: resource('template/imageItem.tmpl')
});


module.exports = new basis.ui.scroller.ScrollPanel({
  scrollX: true,
  scrollY: false,
  wheelDelta: 100,

  autoDelegate: true,
  active: true,

  template: templates.imageList,

  childClass: {
    template: templates.imageItem,
    binding: {
      url: 'data:'
    }
  },
  
  handler: {
    targetChanged: function(){
      this.setDataSource(this.target ? app.type.HotelImage.byHotel.getSubset(this.target.getId(), true) : null);
    }
  }  
});