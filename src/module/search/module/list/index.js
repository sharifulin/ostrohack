
  basis.require('app.type');
  basis.require('basis.ui');
  basis.require('basis.ui.button');
  basis.require('app.router');

  var templates = basis.template.define('searchResult', resource('template/index.js').fetch());
  basis.template.theme('mobile').define('searchResult', resource('template/theme-mobile/index.js').fetch());

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
        star_rating: 'satellite:'
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
        }
        
      }
    },

    setData: function(data){
      this.setDelegate(data);
      this.setDataSource(data);      
    }
  });


  module.exports = list;