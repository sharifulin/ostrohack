
  basis.require('basis.ui');
  basis.require('basis.l10n');
  basis.require('basis.devpanel');

  basis.l10n.setCultureList('ru-RU en-US');
  basis.l10n.setCulture('ru-RU');

  basis.dom.event.addHandler(window, 'resize', function(){
    if (document.body.offsetWidth < 400)
      basis.template.setTheme('mobile');
    else
      basis.template.setTheme('base');
  });

  basis.ready(function(){
    var form = resource('module/searchForm/index.js').fetch();
    var list = resource('module/searchResult/index.js').fetch();

    form.addHandler({
      datasetChanged: function(sender){
        list.setData(sender.dataset);
      }
    });

    var layout = new basis.ui.Node({
      container: document.body,
      template: resource('app/template/layout.tmpl'),
      binding: {
        form: form,
        list: list
      }
    });
  });
