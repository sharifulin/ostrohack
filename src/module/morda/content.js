basis.require('basis.ui');
basis.require('app.ext');

var namespace = 'app.module.morda';
  
basis.l10n.createDictionary(namespace + '.banners.b1', __dirname + 'l10n', {
  title: 'Easy to use iPhone app',
  info: 'Book hotels wherever you are via your iPhone',
  tip: 'type ostrovok'
});

basis.l10n.createDictionary(namespace + '.banners.b2', __dirname + 'l10n', {
  title: 'Title',
  label1: 'Customer Support',
  label2: 'Service',
  info: 'Info'
});


var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  template: templates.view,
  binding: {
    form: new app.ext.SearchForm({}),
    content: resource('module/content/index.js').fetch()
  }
});
