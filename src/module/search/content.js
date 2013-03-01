
  basis.require('app.type');
  basis.require('basis.ui');
  basis.require('basis.ui.button');
  basis.require('app.router');

  var templates = basis.template.define('searchResult', resource('template/index.js').fetch());
  basis.template.theme('mobile').define('searchResult', resource('template/theme-mobile/index.js').fetch());

  var form = resource('module/searchForm/index.js');

  var list = new basis.ui.Node({
    active: true, 

    template: templates.list,
    binding: {
      form: form()
    },

    selection: true,

    childClass: {
      template: templates.item,
      binding: {
        id: 'data:',
        name: 'data:',
        price: 'data:',
        is_golden: 'data:is_golden ? "golden" : ""',
        address: 'data:',
        thumbnail_url: 'data:',
        thumbnail_url_220: 'data:'
      }
    },

    setData: function(data){
      this.setDelegate(data);
      this.setDataSource(data);      
    }
  });

  form().addHandler({
    datasetChanged: function(sender){
      list.setData(sender.dataset);
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
