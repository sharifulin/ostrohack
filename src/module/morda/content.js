
  basis.require('basis.ui');

  var SearchForm = resource('module/searchForm/index.js').fetch();

  module.exports = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      form: new SearchForm({})
    }
  });
