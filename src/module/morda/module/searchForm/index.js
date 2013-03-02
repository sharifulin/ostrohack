
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
    title: 'Find Hotels',
    labelQuestion: 'Where would you like to go?',
    labelExample: 'for example',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    labelAdults: 'Adults',
    labelAnd: 'and',
    labelChildren: 'Children',
    placeholder: 'City or hotel name',
    submitButton: 'Search',
    example: 'Moscow'
  });
  basis.l10n.createDictionary(namespace + '.suggestionGroup', __dirname + 'l10n', {
    hotel: 'Hotels',
    region: 'Regions'
  });


  var DestinationSuggestion = app.type.DestinationSuggestion;

  //
  // main part
  //

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
              date: new Date(this.selectedDate.value)
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

  var Suggestions = basis.ui.Node.subclass({
    visible: false,
    active: true,
    selection: {},
    template: templates.Suggestions,
    binding: {
      visible: 'visible'
    },
    grouping: {
      groupGetter: basis.fn.getter('data.type'),
      sorting: function(object){
        return object.data.id == 'hotel' ? 1 : 0;
      }
    },
    childClass: {
      template: templates.SuggestionItem,
      binding: {
        name: 'data.name',
        typeTitle: {
          events: 'update',
          getter: function(object){
            return basis.l10n.getToken(namespace, 'suggestionGroup', object.data.type);
          }
        }
      },
      action: {
        select: function(){
          this.select();
          var form = this.parentNode.owner;
          form.satellite.destinationField.setValue(this.data.name);
        }
      }
    },
    event_childNodesModified: function(){
      basis.ui.Node.prototype.event_childNodesModified.apply(this, arguments);
      if (this.firstChild)
        this.firstChild.select();
    }
  });

 
  var Form = basis.ui.Node.subclass({
    template: resource('template/form.tmpl'),
    binding: {
      suggestions: 'satellite:',
      destinationField: 'satellite:',
      arrivalField: 'satellite:',
      departureField: 'satellite:',
      submitButton: 'satellite:',
      guestsField: 'satellite:',
    },
    action: {
      kill: function(event){
        event.preventDefault();
      },
      setExample: function(){
        this.satellite.destinationField.setValue(basis.l10n.getToken(namespace, 'example'));
      }
    },

    satelliteConfig: {
      suggestions: {
        instanceOf: Suggestions
      },
      destinationField: {
        instanceOf: basis.ui.field.Text.subclass({
          template: templates.DestinationField,
          binding: {
            hidden: {
              events: 'change',
              getter: function(object){
                return !object.getValue();
              }
            }
          },
          action: {
            clear: function(){
              this.setValue();
            }
          },
          placeholder: basis.l10n.token(namespace + '.placeholder'),
          handler: {
            change: function(){
              var value = this.getValue();
              var source = value ? DestinationSuggestion.byQuery.getSubset(value, true) : null
              this.setDelegate(source);
              this.owner.satellite.suggestions.setDataSource(source);
            },
            fieldKeyup: function(object, event){
              var value = this.getValue();  
              var suggestions = this.owner.satellite.suggestions;
              
              var cur = suggestions.selection.pick();

              switch (event.key){
                case event.KEY.DOWN:
                  cur = cur || suggestions.firstChild;
                  cur = cur && basis.dom.axis(cur, basis.dom.AXIS_FOLLOWING_SIBLING).search(false, 'disabled');
                break;

                case event.KEY.UP: 
                  cur = cur ? basis.dom.axis(cur, basis.dom.AXIS_PRECEDING_SIBLING).search(false, 'disabled') : suggestions.firstChild;
                break;
              }

              if (cur)
              {
                cur.select();
                basis.dom.focus(this.tmpl.field);

                if (event.key == event.KEY.ENTER)
                {
                  if (suggestions.visible)
                    this.setValue(cur.data.name);
                  else
                    this.owner.submit();

                  suggestions.visible = false;
                }
                else
                  suggestions.visible = true;
              }
              
              suggestions.updateBind('visible');
            },
            fieldFocus: function(){
              this.owner.satellite.suggestions.visible = true;
              this.owner.satellite.suggestions.updateBind('visible');
            },
            fieldBlur: function(){
              this.owner.satellite.suggestions.visible = false;
              this.owner.satellite.suggestions.updateBind('visible');
            }
          }
        }) 
      },
      arrivalField: {
        instanceOf: DatePicker,
        config: {
          data: {
            date: (new Date).add('day', 1)
          }
        }
      },
      departureField: {
        instanceOf: DatePicker,
        config: {
          data: {
            date: (new Date).add('day', 2)
          }
        }        
      },
      guestsField: {
        instanceOf: basis.ui.field.Text.subclass({  
          template: templates.GuestsField,
          value: 2
        })
      },
      submitButton: {
        instanceOf: basis.ui.button.Button.subclass({
          template: resource('template/submitButton.tmpl'),
          caption: basis.l10n.getToken(namespace, 'submitButton'),
          click: function(){
            this.owner.submit();
          }          
        })
      }
    },

    event_datasetChanged: basis.event.create('datasetChanged'),
    dataset: null,    
    setFilters: function(filters){
      this.filters = filters;
    },

    submit: function(){
      var suggestion = this.satellite.suggestions.selection.pick();

      if (suggestion)
      {
        var guests = this.satellite.guestsField.getValue();
        var arrivalDate = this.satellite.arrivalField.data.date;
        var departureDate = this.satellite.departureField.data.date;

        if (suggestion.data.type == 'region')
        {
          app.router.navigate('/search/?q={city}&dates={arrivalDate}-{departureDate}&guests={guests}'.format({
            city: suggestion.data.pretty_slug,
            guests: guests,
            arrivalDate: arrivalDate.toFormat('%D.%M.%Y'),
            departureDate: departureDate.toFormat('%D.%M.%Y')
          }));
        }
        else
        {
          app.router.navigate('/hotel?hotelId={hotelId}&arrivalDate={arrivalDate}&departureDate={departureDate}&room1_numberOfAdults=2={guests}'.format({
            hotelId: suggestion.data.targetId,
            guests: guests,
            arrivalDate: arrivalDate.toISODateString(),
            departureDate: departureDate.toISODateString()
          }));
        }
      }
    }
  });


  module.exports = Form;