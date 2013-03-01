
  var list = resource('module/list/index.js').fetch();
  var filters = resource('module/filters/index.js').fetch();
  var toolbar = resource('module/toolbar/index.js').fetch();
  var header = resource('module/header/index.js').fetch();

  module.exports = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      list: list,
      filters: filters,
      toolbar: toolbar,
      header: header
    }
  });
