
  basis.require('basis.ui');
  basis.require('app.ext');
  
  resource('settings/l10n.js').fetch();
  
  var namespace = 'app.module.morda';
  
  var templates = basis.template.define(namespace, resource('template/index.js').fetch());
  basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());
  
  module.exports = new basis.ui.Node({
    template: templates.view,
    binding: {
      form: new app.ext.SearchForm({}),
      content: resource('module/content/index.js').fetch()
    }
  });
