basis.require('basis.ui.window');
basis.require('app.ext');

module.exports = new basis.ui.window.Window({
  modal: true,
  autocenter: true,
  moveable: false,

  template: resource('template/popup.tmpl'),

  childNodes: new app.ext.SearchForm({
    autoDelegate: true,
    handler: {
      rootChanged: function(){
        var destination = this.data.destination;

        if (destination)
        {
          var destinationName = (destination.data.country ? destination.data.country + ', ' : '') + destination.data.name;
          app.type.DestinationSuggestion({
            type: 'region',
            query: destinationName,
            pretty_slug: destination.data.pretty_slug
          });
        }

        this.loadData({
          destination: destinationName,
          arrivalDate: this.data.arrivalDate,
          departureDate: this.data.departureDate,
          adultsCount: this.data.room1_numberOfAdults,
          childrenCount: this.data.room1_numberOfChildren,
          childrenAge: this.data.childrenAge
        });
      }
    },
    submit: function(){
      app.ext.SearchForm.prototype.submit.apply(this, arguments);
      module.exports.close();
    }
  })
});