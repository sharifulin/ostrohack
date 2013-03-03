basis.require('basis.l10n');
basis.require('basis.ui');

//basis.l10n.createDictionary('app.module.search.header', __dirname + 'l10n', {
//});
var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  action: {
    newSearch: function(){
      searchFormPopup().open();
    }
  }
});