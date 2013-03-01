
  basis.require('basis.ui');
  basis.require('basis.template');
  basis.require('basis.l10n');  

  var Button = basis.ui.Node.subclass({
    className: 'debug.Button',
    template: resource('template/button.tmpl'),
  });

  module.exports = new basis.ui.Node({
    template: resource('template/panel.tmpl'),
    childClass: {
      className: 'debug.ButtonGroup',
      childClass: Button
    },
    childNodes: [
      {
        selection: true,        
        childNodes: basis.template.getThemeList().map(function(name){
          return {
            selected: basis.template.currentTheme().name == name,
            theme: name
          }
        }),
        childClass: {
          binding: {
            name: 'theme'
          },
          action: {
            set: function(){
              basis.template.theme(this.theme).apply();
              this.select();
            }
          }
        }
      },
      {
        selection: true,        
        childNodes: basis.l10n.getCultureList().map(function(culture){
          return {
            selected: basis.l10n.getCulture() == culture,
            culture: culture
          }
        }),
        childClass: {
          binding: {
            name: 'culture'
          },
          action: {
            set: function(){
              basis.l10n.setCulture(this.culture);
              this.select();
            }
          }
        }
      }
    ]
  });