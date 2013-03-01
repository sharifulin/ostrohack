
  basis.require('app.type');
  basis.require('basis.ui');
  basis.require('basis.ui.button');
  basis.require('basis.data.dataset');

   var template = basis.template.define('searchResult', {
    list: resource('template/list.tmpl'),
    item: resource('template/item.tmpl')
  });

  basis.template.theme('mobile').define('searchResult', {
    list: resource('template/list.mobile.tmpl'),
    item: resource('template/item.mobile.tmpl')
  });

  var list = new basis.ui.Node({
    active: true, 

    template: template.list,

    selection: true,

    childClass: {
      template: template.item,
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
