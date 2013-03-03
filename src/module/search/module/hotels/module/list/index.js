basis.require('app.type');
basis.require('basis.ui');
basis.require('basis.ui.button');
basis.require('app.router');

var templates = basis.template.define('searchResult', resource('template/index.js').fetch());
basis.template.theme('mobile').define('searchResult', resource('template/theme-mobile/index.js').fetch());

var namespace = 'app.module.search.list';
basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
});

basis.l10n.createDictionary(namespace + '.amenity', __dirname + 'l10n', {
  wifi: 'wifi',
  internet: 'internet',
  breakfast: 'breakfast',
  parking: 'parking'
});

var amenityMap = {
  sport: 'breakfast',
  parkovka: 'parking'
};
var amenitiesSorting = {
  wifi: 1,
  internet: 2,
  breakfast: 3,
  parking: 4
}

var list = new basis.ui.Node({
  dataSource: app.search.output,
  active: true, 

  template: templates.list,

  selection: true,
  childClass: {
    template: templates.item,
    binding: {
      id: function(node){
        return node.data.uid.substr(1);
      },
      name: 'data:',
      price: 'data:',
      is_golden: 'data:is_golden ? "golden" : ""',
      address: 'data:',
      nights: 'data:',
      arrivalDate: 'data:',
      departureDate: 'data:',
      adults: 'data:',
      children: 'data:',
      locative_where: 'data:',
      distance: {
        events: 'update',
        getter: function(node){
          var distance = node.data.distance;
          if (distance)
            return distance.toFixed(1).replace(/\.0$/, '');
        }
      },
      thumbnail_url: {
        events: 'update',
        getter: function(node){
          if (node.data.thumbnail_tmpl)
            return node.data.thumbnail_tmpl.format({
              size: '170x154'
            });
          else
            return node.data.thumbnail_url;
        }
      },
      thumbnail_url_220: 'data:',
      rating: 'satellite:',
      star_rating: 'satellite:',
      amenities: 'satellite:'
    },
    satelliteConfig: {
      rating: {
        existsIf: function(owner){
          return owner.data.rating_verbose;
        },
        instanceOf: basis.ui.Node.subclass({
          autoDelegate: true,
          template: resource('template/rating.tmpl'),
          binding: {
            rating_verbose: 'data:',
            rating: 'data:rating'
          }
        })
      },
      star_rating: {
        existsIf: function(owner){
          return owner.data.star_rating;
        },
        instanceOf: basis.ui.Node.subclass({
          autoDelegate: true,
          template: resource('template/star_rating.tmpl'),
          binding: {
            star_rating: 'data:'
          }
        })
      },
      amenities: {
        existsIf: function(owner){
          return owner.data.amenities;
        },
        instanceOf: basis.ui.Node.subclass({
          autoDelegate: true,
          template: resource('template/amenities.tmpl'),
          init: function(){
            basis.ui.Node.prototype.init.call(this);
            this.setChildNodes(this.data.amenities.map(function(amenity){
              amenity = amenityMap[amenity] || amenity;
              return {
                name: amenity,
                hint: basis.l10n.token(namespace, 'amenity', amenity)
              }
            }));
          },
          sorting: function(child){
            return amenitiesSorting[child.name];
          },
          childClass: {
            template: resource('template/amenity.tmpl'),
            binding: {
              name: 'name',
              hint: 'hint'
            }
          }
        })
      }                
    }
  },

  setData: function(data){
    this.setDelegate(data);
    this.setDataSource(data);      
  }
});


module.exports = list;
