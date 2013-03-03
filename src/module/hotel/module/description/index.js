var namespace = 'app.module.hotel.description';

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  autoDelegate: true,
  template: templates.View,
  binding: {
    descr: 'data:description'
  }
});