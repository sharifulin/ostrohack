
  basis.require('basis.ui');

  module.exports = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      form: resource('module/searchForm/index.js').fetch()
    }
  });
