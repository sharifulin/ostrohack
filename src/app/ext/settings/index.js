
var namespace = 'app.ext.settings';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  'for': 'for',
  'and': 'and',
  from: 'from',
  till: 'till',
  adult1: 'adult',
  adult2: 'adults',
  adult3: 'adults',
  child1: 'child',
  child2: 'childs',
  child3: 'childs',
  month1: 'January',
  month2: 'February',  
  month3: 'March',  
  month4: 'April',  
  month5: 'May',  
  month6: 'June',  
  month7: 'July',  
  month8: 'August',    
  month9: 'September',    
  month10: 'October',
  month11: 'November',  
  month12: 'December',
  change: 'Change'
});

var templates = basis.template.define(namespace, resource('template/index.js').fetch());

var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');

module.exports = basis.ui.Node.subclass({
  autoDelegate: true,
  template: templates.View,
  binding: {
    adultsCount: 'data:room1_numberOfAdults',
    childrenCount: 'data:room1_numberOfChildren',
    adultsText: {
      events: 'update',
      getter: function(object){
        return basis.l10n.getToken(namespace, 'adult' + app.utils.plural(object.data.room1_numberOfAdults));
      }
    },
    childrenText: {
      events: 'update',
      getter: function(object){
        return basis.l10n.getToken(namespace, 'child' + app.utils.plural(object.data.room1_numberOfChildren));
      }
    },    
    hasChildren: {
      events: 'update',
      getter: function(object){
        return object.data.room1_numberOfChildren > 0;
      }
    },
    arrivalDate: {
      events: 'update',
      getter: function(object){
        return object.data.arrivalDate && object.data.arrivalDate.getDate();
      }
    },
    departureDate: {
      events: 'update',
      getter: function(object){
        return object.data.departureDate && object.data.departureDate.getDate();
      }
    },
    arrivalMonth: {
      events: 'update',
      getter: function(object){
        if (object.data.arrivalDate){
          var arrivalMonth = object.data.arrivalDate.getMonth();
          var departureMonth = object.data.departureDate.getMonth();
          return arrivalMonth != departureMonth ? basis.l10n.getToken(namespace, 'month' + (arrivalMonth + 1)) : '';
        }
      }
    },
    departureMonth: {
      events: 'update',
      getter: function(object){
        if (object.data.departureDate){
          var departureMonth = object.data.departureDate.getMonth();
          return basis.l10n.getToken(namespace, 'month' + (departureMonth + 1));
        }
      }
    }
  }
});