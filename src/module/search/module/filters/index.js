
  basis.require('basis.ui');

  var filters = new basis.ui.Node({
    template: resource('template/filters.tmpl')
  });

  module.exports = filters;