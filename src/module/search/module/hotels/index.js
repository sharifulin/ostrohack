basis.require('basis.data.dataset');
basis.require('basis.ui');

var templates = basis.template.define('app.module.search.hotels', resource('template/index.js').fetch());
basis.template.theme('mobile').define('app.module.search.hotels', resource('template/theme-mobile/index.js').fetch());

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
  template: templates.view,
  delegate: app.search.input,
  binding: {
    stared: stared,
    sorting: sorting,
    list: list
  }
});