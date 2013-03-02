basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.hotels.stared';
basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
    count: basis.data.index.count()
  },
  action: {
  }
});