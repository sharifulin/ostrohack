basis.require('basis.ui.scroller');
basis.require('basis.layout');


var templates = basis.template.define('app.module.hotel.slider', {
  imageList: resource('template/imageList.tmpl'),
  imageItem: resource('template/imageItem.tmpl')
});


module.exports = basis.ui.scroller.ScrollPanel.subclass({
  scrollX: true,
  scrollY: false,
  wheelDelta: 100,

  template: templates.imageList,

  childClass: {
    template: templates.imageItem,
    binding: {
      url: 'data:'
    }
  }  
});