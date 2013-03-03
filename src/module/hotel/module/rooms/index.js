basis.require('app.ext');

var namespace = 'app.module.hotel.rooms';

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  template: templates.View,
  childClass: basis.ui.Node.subclass({
    visible: false,
    template: templates.Room,
    binding: {
      slider: 'satellite:',
      amenities: 'satellite:',
      name: 'data:',
      visible: 'visible',
      current_allotment: 'data:',
      size: 'data.room_type.data.size',
      description: 'data.room_type.data.description || ""',
      thumbnail: 'data.room_type.data.thumbnail',
      
      left: {
        events: 'update',
        getter: function(object){
          return object.data.current_allotment <= 2 ? 'one' : (object.data.current_allotment <= 5 ? 'few' : 'lot');
        }
      },
      leftCount: {
        events: 'update',
        getter: function(object){
          return object.data.current_allotment <=5 ? basis.l10n.getToken(namespace, 'room.left', 'left' + object.data.current_allotment) : '';
        }
      },
      total_rate: {
        events: 'update',
        getter: function(object){
          return object.data.total_rate.format(0, '\x0A', '', '', '.');
        }
      }
    },
    action: {
      toggle: function(){
        this.visible = !this.visible;
        this.updateBind('visible');
      }
    },
    satelliteConfig: {
      slider: {
        instanceOf: app.ext.Slider
      },
      amenities: {
        instanceOf: basis.ui.Node.subclass({
          childClass: {
            template: templates.RoomAmenity,
            binding: {
              title: 'title',
              value: 'value'
            }
          }
        })
      }
    },
    templateUpdate: function(){
      var images = (this.data.room_type && this.data.room_type.data.room_type_image_list || []).map(function(url){
        return basis.data({
          url: url
        });
      })
      
      this.satellite.slider.setChildNodes(images);

      // aminities
      var res = [];
      var amenities = (this.data.room_type && this.data.room_type.data.amenities);
      for (var key in amenities)
      {
        res.push({
          title: key,
          value: amenities[key].join(', ')
        });
      }
      this.satellite.amenities.setChildNodes(res);
    }
  })
});