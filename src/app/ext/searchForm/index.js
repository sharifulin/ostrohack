
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

  basis.l10n.createDictionary(namespace + '.errorPopup', __dirname + 'l10n', {  
    text: 'error'
  });

  var templates = basis.template.define(namespace, resource('template/index.js').fetch());
  basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

  var DestinationSuggestion = app.type.DestinationSuggestion;
  

  //
  // errorPopup
  //

  var errorPopup = basis.fn.lazyInit(function(){
    return new basis.ui.popup.Balloon({
      dir: 'right center left center',
      autorotate: ['left bottom left top'],
      orientation: 'horizontal',
      template: templates.ErrorPopup,
      hideOnKey: basis.fn.$true
    });
  });

  //
  // date picker
  //

  var calendarPopup = new basis.ui.popup.Popup({
    dir: 'center top center top',
    template: templates.DatePickerPopup,
    autorotate: false,
    handler: {
      delegateChanged: function(object, oldDelegate){
        if (this.delegate)
        {
          this.delegate.opened = true;
          this.delegate.updateBind('opened');
          this.show(this.delegate.element);

          this.firstChild.selectedDate.set(this.delegate.getValue());
          this.realign();
        }
        else
          this.hide();

        if (oldDelegate)       
        {
          oldDelegate.opened = false;
          oldDelegate.updateBind('opened');
        }
      },
      hide: function(){
        this.setDelegate();
      }
    },
    childNodes: [
      new basis.ui.calendar.Calendar({
        autoDelegate: true,
        minDate: new Date,
        handler: {
          change: function(){
            this.parentNode.delegate.setValue(this.selectedDate.value);
            this.parentNode.setDelegate();
          }
        }
      })
    ]
  });  

  var DatePicker = basis.ui.field.Text.subclass({
    opened: false,
    template: templates.DatePicker,
    readFieldValue_: function(){
      return this.getValue();
    },
    binding: {
      opened: 'opened',
      value: {
        events: 'change',
        getter: function(node){
          var value = node.getValue();
          return value && value.toFormat('%D/%M/%Y') || '';
        }
      }
    },
    action: {
      open: function(){
        calendarPopup.setDelegate(this);
      }
    }
  });

  //
  // suggestions popup
  //

  var Suggestions = basis.ui.Node.subclass({
    visible: false,
    selection: {},
    template: templates.Suggestions,
    binding: {
      visible: 'visible'
    },
    grouping: {
      groupGetter: basis.fn.getter('data.type'),
      sorting: function(object){
        return object.data.id == 'hotel' ? 1 : 0;
      },
      childClass: {
        template: templates.SuggestionGroup,
        binding: {
          typeTitle: {
            events: 'update',
            getter: function(object){
              return basis.l10n.getToken(namespace, 'suggestionGroup', object.data.id);
            }
          }
        }
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



  //
  // guests Field
  //
  var guestsPopup = basis.fn.lazyInit(function(){
    var popup = new basis.ui.popup.Popup({
      template: templates.GuestsFieldPopup,
      dir: 'left bottom left top',
      childNodes: new basis.ui.Node({
        autoDelegate: true,
        selection: {},
        childClass: {
          autoDelegate: true,
          template: templates.GuestsFieldListItem,
          binding: {
            title: 'value'
          },
          action: {
            select: function(){
              this.select();
              popup.delegate.setValue(this.value);
              popup.hide();
            }
          }
        },
        handler: {
          rootChanged: function(){
            var root = this.root;
            var childNodes = root && basis.array.create(root.itemCountTo - root.itemCountFrom + 1, function(index){
              return {
                value: root.itemCountFrom + index,
                selected: root.getValue() == root.itemCountFrom + index
              }
            });
            
            this.setChildNodes(childNodes || []);
          }
        }
      }),
      handler: {
        delegateChanged: function(){
          if (this.delegate)
            this.show(this.delegate.tmpl.field);
          else 
            this.hide();
        },
        hide: function(){
          this.setDelegate();
        }
      }
    })

    return popup;
  });

  var GuestsField = basis.ui.field.Text.subclass({
    readOnly: true,
    template: templates.GuestsField,
    action: {
      open: function(){
        guestsPopup().setDelegate(this);
      }
    }
  });

  //
  // children age field
  //

  var ChildrenAgeField = basis.ui.Node.subclass({
    template: templates.ChildrenAgeField,
    getValue: function(){
      return this.childNodes.map(function(field){ 
        return field.tmpl.field.value; 
      }).join('.');
    },
    setValue: function(value){
      var items = value && value.split('.') || [];
      this.setChildNodes(items.map(function(val){
        return {
          value: val
        }
      }));
    },
    childClass: {
      template: templates.ChildrenAgeFieldItem,
      binding: {
        value: 'value'
      }
    }
  });


  //
  // main part
  //

  var FORM_FIELDS = [
    'destinationField',
    'arrivalField',
    'departureField',
    'adultsField',
    'childrenField',
    'childrenAgeField' 
  ];

  var Form = basis.ui.Node.subclass({
    template: templates.form,
    binding: {
      suggestions: 'satellite:',
      destinationField: 'satellite:',
      arrivalField: 'satellite:',
      departureField: 'satellite:',
      submitButton: 'satellite:',
      adultsField: 'satellite:',
      childrenField: 'satellite:',
      childrenAgeField: 'satellite:'
    },
    action: {
      kill: function(event){
        event.preventDefault();
      },
      setExample: function(){
        this.satellite.destinationField.setValue(basis.l10n.getToken(namespace, 'example'));
        DestinationSuggestion({
          query: basis.l10n.getToken(namespace, 'example').value,
          type: 'region',
          pretty_slug: 'Moscow'
        });
      }
    },

    satelliteConfig: {
      suggestions: {
        instanceOf: Suggestions
      },
      destinationField: {
        instanceOf: basis.ui.field.Text.subclass({
          name: 'destination',
          template: templates.DestinationField,
          autocomplete: 'off',
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
              this.setActive(true);
            },
            fieldBlur: function(){
              this.owner.satellite.suggestions.visible = false;
              this.owner.satellite.suggestions.updateBind('visible');
              this.setActive(false);
            }
          }
        }) 
      },
      arrivalField: {
        instanceOf: DatePicker,
        config: {
          name: 'arrivalDate',          
          value: (new Date).add('day', 1),
          readOnly: true,
          handler: {
            change: function(){
              var arrival = this.getValue();
              var departure = this.owner.satellite.departureField.getValue();
              if (arrival > departure)
                this.owner.satellite.departureField.setValue((new Date(arrival)).add('day', 1));
            }
          }
        }
      },
      departureField: {
        instanceOf: DatePicker,
        config: {
          name: 'departureDate',
          value: (new Date).add('day', 2),
          readOnly: true,
          handler: {
            change: function(){
              var departure = this.getValue();
              var arrival = this.owner.satellite.arrivalField.getValue();
              if (arrival > departure)
                this.owner.satellite.arrivalField.setValue((new Date(departure)).add('day', -1));
            }
          }
        }        
      },
      adultsField: {
        instanceOf: GuestsField,
        config: {  
          name: 'adultsCount',
          itemCountFrom: 1,
          itemCountTo: 6,
          value: 2
        }
      },
      childrenField: {
        instanceOf: GuestsField,
        config: {  
          name: 'childrenCount',
          itemCountFrom: 0,
          itemCountTo: 4,
          value: 0,
          disabled: true,
          handler: {
            change: function(){
              var value = this.getValue();
              this.owner.satellite.childrenAgeField.setValue(basis.array.create(value, 7).join('.'));
              if (value > 0)
                this.enable();
              else
                this.disable();
            }
          }
        }
      },
      childrenAgeField: {
        instanceOf: ChildrenAgeField,
        config: {
          name: 'childrenAge'
        }
      },
      submitButton: {
        instanceOf: basis.ui.button.Button.subclass({
          template: templates.submitButton,
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

    serialize: function(){
      var data = {};
      FORM_FIELDS.forEach(function(fieldName){
        data[this.satellite[fieldName].name] = this.satellite[fieldName].getValue();
      }, this);
      return data;
    },

    submit: function(){
      var suggestion = this.satellite.suggestions.selection.pick();

      if (suggestion)
      {
        var data = this.serialize();

        if (suggestion.data.type == 'region')
        {
          app.router.navigate('/hotels/?q={city}&dates={arrivalDate}-{departureDate}&guests={guests}'.format({
            city: suggestion.data.pretty_slug,
            guests: data.adultsCount + (data.childrenCount ? 'and' + data.childrenAge : ''),
            arrivalDate: data.arrivalDate.toFormat('%D.%M.%Y'),
            departureDate: data.departureDate.toFormat('%D.%M.%Y')
          }));
        }
        else
        {
          debugger;
          app.router.navigate('/hotel/' + suggestion.data.kind + '/rooms?hotelId={hotelId}&arrivalDate={arrivalDate}&departureDate={departureDate}&room1_numberOfAdults={guests}&room1_numberOfChildren={childrenCount}&childrenAge={childrenAge}'.format({
            hotelId: suggestion.data.targetId,
            guests: data.adultsCount,
            childrenCount: data.childrenCount,
            childrenAge: data.childrenAge,
            arrivalDate: data.arrivalDate.toFormat('%D-%M-%Y'),
            departureDate: data.departureDate.toFormat('%D-%M-%Y')
          }));
        }
      }
      else
      {
        errorPopup().show(this.satellite.destinationField.tmpl.field);
        errorPopup().realign();
        this.satellite.destinationField.focus();
      } 
    },
    loadData: function(data){
      FORM_FIELDS.forEach(function(fieldName){
      var key = this.satellite[fieldName].name;
        if (data[key])
          this.satellite[fieldName].setValue(data[key]);
      }, this);  
    }
  });

  module.exports = Form;
  