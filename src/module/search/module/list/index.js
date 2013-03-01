
  basis.require('app.type');
  basis.require('basis.ui');
  basis.require('basis.ui.button');
  basis.require('app.router');

  var templates = basis.template.define('searchResult', resource('template/index.js').fetch());
  basis.template.theme('mobile').define('searchResult', resource('template/theme-mobile/index.js').fetch());

  var list = new basis.ui.Node({
    active: true, 

    template: templates.list,

    selection: true,

    childClass: {
      template: templates.item,
      binding: {
        id: 'data:',
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
        rating: 'satellite:'
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
        }
      }
    },

    setData: function(data){
      this.setDelegate(data);
      this.setDataSource(data);      
    }
  });

  app.router.add(/search\/\?(.*)/, function(query){
    var params = {};

    var parts = query.split('&');
    for (var i = 0, part; part = parts[i]; i++)
    {
      var p = part.split('=');
      params[p[0]] = p.slice(1).join('=');
    }
    console.log(params);

    // set convertation to params -> filters
    var dataset = app.type.Suggestion.getSearchResult({
      region_id: 2395,
      //destination: destinationField.getValue(),
      room1_numberOfAdults: 2,
      arrivalDate: '2013-04-19',
      departureDate: '2013-04-20'
    });

    list.setDataSource(dataset);
  });

  module.exports = list;
