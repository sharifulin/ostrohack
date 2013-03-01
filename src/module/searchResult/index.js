
  basis.require('app.type');
  basis.require('basis.ui');
  basis.require('basis.ui.button');
  basis.require('basis.data.dataset');

  var templates = basis.template.define('searchResult', resource('template/index.js'));
  basis.template.theme('mobile').define('searchResult', resource('template/theme-mobile/index.js'));

  var list = new basis.ui.Node({
    active: true, 

    template: templates.list,

    selection: true,

    childClass: {
      template: templates.item,
      binding: {
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
  
  module.exports = list;
