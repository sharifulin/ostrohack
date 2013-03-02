basis.require('basis.ui');

var sorting = resource('module/sorting/index.js').fetch();
var list = resource('module/list/index.js').fetch();

sorting.addHandler({
  sortChanged: function(){
    list.setSorting(sorting.sortFn, sorting.sortOrderDesc);
  }
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
    sorting: sorting,
    list: list
  }
});