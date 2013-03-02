basis.require('basis.ui.scroller');
basis.require('basis.layout');


var templates = basis.template.define('app.module.hotel.slider', {
  imageList: resource('template/imageList.tmpl'),
  imageItem: resource('template/imageItem.tmpl')
});


module.exports = basis.ui.scroller.ScrollPanel.subclass({
  scrollX: true,
  scrollY: false,
  wheelDelta: 150,


  template: templates.imageList,

  action: {
    onwheel: function(){},
    scrollLeft: function(event){
      this.scroller.setPositionX(this.scroller.viewportTargetX - this.wheelDelta * 4, true);
      basis.dom.event.kill(event.event_);
    },
    scrollRight: function(event){
      this.scroller.setPositionX(this.scroller.viewportTargetX + this.wheelDelta * 4, true);
      basis.dom.event.kill(event.event_);
    }
  },

  childClass: {
    template: templates.imageItem,
    binding: {
      url: 'data:'
    }
  }  
});