basis.require('basis.l10n');
basis.require('basis.ui');
basis.require('app.ext');

var namespace = 'app.module.search.module.header';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  newSearch: 'New search',
  findLabelFake: 'Found some hotels in a region',
  forLabelFake: 'for adults and children from some date'
});

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');

module.exports = new basis.ui.Node({
  template: templates.view,
  binding: {
    settings: new app.ext.Settings({})
  },
  action: {
    newSearch: function(){
      searchFormPopup().setDelegate(this.root);
      searchFormPopup().open();
    }
  }
});