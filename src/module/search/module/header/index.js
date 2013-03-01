basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.header', __dirname + 'l10n', {
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
  },
  action: {
  }
});