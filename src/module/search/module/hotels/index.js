basis.require('basis.data.dataset');
basis.require('basis.ui');

var sorting = resource('module/sorting/index.js').fetch();
var stared = resource('module/stared/index.js').fetch();
var list = resource('module/list/index.js').fetch();

var staredHotels = new basis.data.dataset.Subset({
  source: app.search.input
});

sorting.addHandler({
  sortChanged: function(){
    list.setSorting(sorting.sortFn, sorting.sortOrderDesc);
  }
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  delegate: app.search.input,
  binding: {
    stared: stared,
    sorting: sorting,
    list: list
  }
});