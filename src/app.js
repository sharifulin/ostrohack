
  basis.require('basis.l10n');
  ;;;basis.require('basis.devpanel');
  basis.require('basis.ui');
  basis.require('app.theme');
  basis.require('app.router');
  basis.require('app.utils');  

  resource('app/settings/l10n.js').fetch();
  resource('app/settings/theme.js').fetch();

  basis.ready(function(){
    var pages = new basis.ui.Node({
      template: resource('app/template/pages.tmpl'),

      selection: true,
      childClass: {
        template: resource('app/template/page.tmpl'),
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

    var layout = new basis.ui.Node({
      container: document.body,
      template: resource('app/template/layout.tmpl'),
      binding: {
        pages: pages
      }
    });
  });
