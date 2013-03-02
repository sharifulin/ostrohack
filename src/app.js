
  basis.require('basis.l10n');
  ;;;basis.require('basis.devpanel');
  basis.require('basis.ui');
  basis.require('basis.ui.tabs');
  basis.require('app.router');
  basis.require('app.utils');  

  // settings for l10n
  basis.l10n.setCultureList('ru-RU en-US');
  basis.l10n.setCulture('ru-RU');

  // handle screen changes
  basis.dom.event.addHandler(window, 'resize', function(){
    if (document.body.offsetWidth < 400)
      basis.template.setTheme('mobile');
    else
      basis.template.setTheme('base');
  });

  basis.ready(function(){
    var pages = new basis.ui.tabs.PageControl({
      template: resource('app/template/pages.tmpl'),

      autoSelectChild: false,
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
        //resource('module/room/index.js').fetch()
      ]
    });

    app.router.start();

    // if no selected page - select first one
    if (!pages.selection.pick())
      pages.firstChild.select();
     
    // TODO: remove
    window.pages = pages;

    var layout = new basis.ui.Node({
      container: document.body,
      template: resource('app/template/layout.tmpl'),
      binding: {
        pages: pages
      }
    });

  });
