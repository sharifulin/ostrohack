
  basis.require('basis.l10n');
  ;;;basis.require('basis.devpanel');
  basis.require('basis.ui');
  basis.require('basis.ui.popup');
  basis.require('app.router');
  basis.require('app.utils');  

  resource('app/settings/l10n.js').fetch();
  resource('app/settings/theme.js').fetch();

  basis.ready(function(){
    var pages = new basis.ui.Node({
      template: basis.template.get('app.pages'),

      selection: true,
      childClass: {
        template: basis.template.get('app.page'),
        handler: {
          select: function(){
            if (typeof this.lazyContent == 'function')
            {
              this.setChildNodes(this.lazyContent());
              this.lazyContent = null;
            }
          }
        }
      },
      childNodes: [
        resource('module/morda/index.js').fetch(),
        resource('module/search/index.js').fetch(),
        resource('module/hotel/index.js').fetch()
      ]
    });

    app.router.start();

    // if no selected page - select first one
    if (!pages.selection.pick())
      pages.firstChild.select();

    var langPopup = new basis.ui.popup.Popup({
      dir: 'left top left top',
      template: basis.template.get('app.l10npopup'),
      childClass: {
        template: basis.template.get('app.l10nitem'),
        action: {
          click: function(){
            basis.l10n.setCulture(this.culture);
            this.parentNode.hide();
          }
        },
        binding: {
          caption: 'title'
        }
      },
      childNodes: basis.l10n.getCultureList().map(function(culture){
        return {
          culture: culture,
          title: app.l10n.cultureTitle[culture]
        }
      })
    });

    var layout = new basis.ui.Node({
      container: document.body,
      template: basis.template.get('app.layout'),
      binding: {
        pages: pages
      },
      action: {
        chooseLang: function(event){
          langPopup.show(this.tmpl.l10nAnchor || event.sender);
        }
      }
    });
  });
