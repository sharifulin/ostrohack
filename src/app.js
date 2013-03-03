
  basis.require('basis.l10n');
  ;;;basis.require('basis.devpanel');
  basis.require('basis.ui');
  basis.require('app.router');
  basis.require('app.utils');  

  // settings for l10n
  basis.l10n.setCultureList('ru-RU en-US');
  basis.l10n.setCulture('ru-RU');
  
  basis.l10n.createDictionary('app.currency.name', __dirname + 'l10n', {
    rub: 'RUB',
    usd: 'USD'
  });
  basis.l10n.createDictionary('app.currency.label', __dirname + 'l10n', {
    rub: 'rub.',
    usd: '$'
  });
  
  basis.l10n.createDictionary('app.menu', __dirname + 'l10n', {
    faq: 'FAQ',
    about: 'About Us',
    contact: 'Contact Us',
    login: 'Sign in',
    signup: 'Sign up',
    press: 'Press',
    jobs: 'Jobs',
    company: 'Company',
    contacts: 'Contact Us',
    feedback: 'Feedback',
    partners: 'Partnership',
    popular: 'Popular destionations',
    mobile: 'Mobile',
    wesocial: 'Find us in Social Networks'
  });
  
  // handle screen changes
  basis.dom.event.addHandler(window, 'resize', function(){
    if (document.body.offsetWidth < 400)
      basis.template.setTheme('mobile');
    else
      basis.template.setTheme('base');
  });

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
