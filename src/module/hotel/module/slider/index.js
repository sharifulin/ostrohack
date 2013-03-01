
var templates = basis.template.define('app.module.hotel.slider', {
  imageList: resource('template/imageList.tmpl'),
  imageItem: resource('template/imageItem.tmpl'),  
  previewList: resource('template/previewList.tmpl'),
  previewItem: resource('template/previewItem.tmpl'),  
  slider: resource('template/slider.tmpl')
});


var images = new basis.ui.Node({
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

var previews = new basis.ui.Node({
  autoDelegate: true,
  active: true,

  template: templates.previewList,

  childClass: {
    template: templates.previewItem,
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

var slider = new basis.ui.Node({
  autoDelegate: true,

  template: templates.slider,

  binding: {
    images: images,
    previews: previews
  }
});

module.exports = slider;