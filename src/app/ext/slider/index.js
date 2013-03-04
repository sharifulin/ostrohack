basis.require('basis.ui.scroller');
basis.require('basis.layout');

var namespace = 'app.ext.slider'

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());


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

