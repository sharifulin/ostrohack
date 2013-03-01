
  basis.require('basis.ui');
  basis.require('basis.ui.field');  
  basis.require('basis.ui.button');
  basis.require('basis.ui.popup');
  basis.require('basis.ui.calendar');
  basis.require('basis.event');
  basis.require('basis.l10n');
  basis.require('app.router');
  basis.require('app.type');

  var namespace = 'app.view.searchForm';


  //
  // definitions
  //

  var templates = basis.template.define(namespace, resource('template/index.js').fetch());
  basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

  basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
    submitButton: 'Search'
  });


  //
  // main part
  //

  var destinationField = new basis.ui.field.Text({
    event_fieldKeyup: function(event){
      if (event.key == event.KEY.ENTER)
        form.submit();
    }
  });

  var calendarPopup = new basis.ui.popup.Popup({
    dir: 'left bottom left top',
    autorotate: true,
    handler: {
      delegateChanged: function(){
        if (this.delegate)
          this.show(this.delegate.element);
        else
          this.hide();
      }
    },
    childNodes: [
      new basis.ui.calendar.Calendar({
        autoDelegate: true,
        handler: {
          change: function(){
            this.update({
              date: new Date(this.date.value)
            });
            this.parentNode.setDelegate();
          }
        }
      })
    ]
  });

  var DatePicker = basis.ui.Node.subclass({
    template: templates.DatePicker,
    binding: {
      date: {
        events: 'update',
        getter: function(node){
          return node.data.date.toFormat('%D/%M/%Y')
        }
      }
    },
    action: {
      open: function(){
        calendarPopup.setDelegate(this);
      }
    }
  });

  var arrivalField = new DatePicker({
    data: {
      date: (new Date).add('day', 1)
    }
  })

  var departureField = new DatePicker({
    data: {
      date: (new Date).add('day', 2)
    }
  });

  var submitButton = new basis.ui.button.Button({
    caption: basis.l10n.getToken(namespace, 'submitButton'),
    click: function(){
      form.submit();
    }
  });
  
  var form = new basis.ui.Node({
    template: resource('template/form.tmpl'),
    binding: {
      destinationField: destinationField,
      arrivalField: arrivalField,
      departureField: departureField,
      submitButton: submitButton
    },

    event_datasetChanged: basis.event.create('datasetChanged'),
    dataset: null,    
    setFilters: function(filters){
      this.filters = filters;
    },

    submit: function(){
      app.router.navigate('/search/?q={city}&dates={arrivalDate}-{departureDate}&guests={guests}'.format({
        city: 'Moscow',
        guests: 2,
        arrivalDate: '2013-04-19',
        departureDate: '2013-04-20'
      }));
    }
  });


  module.exports = form;