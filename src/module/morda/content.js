
  basis.require('basis.ui');
  basis.require('app.ext');
  
  var namespace = 'app.module.morda.banners';
  
  basis.l10n.createDictionary(namespace + '.b1', __dirname + 'l10n', {
    title: 'Easy to use iPhone app',
    info: 'Book hotels wherever you are via your iPhone',
    tip: 'type ostrovok'
  });

  basis.l10n.createDictionary(namespace + '.b2', __dirname + 'l10n', {
    title: 'Title',
    label1: 'Customer Support',
    label2: 'Service',
    info: 'Info'
  });
  
  module.exports = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      form: new app.ext.SearchForm({}),
      content: resource('module/content/index.js').fetch()
    }
  });
