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
      targetChanged: function(){
        this.loadData({
          arrivalDate: this.data.arrivalDate,
          departureDate: this.data.departureDate,
          adultsCount: this.data.room1_numberOfAdults,
          childrenCount: this.data.room1_numberOfChildren
        });
      }
    },
    submit: function(){
      app.ext.SearchForm.prototype.submit.apply(this, arguments);
      module.exports.close();
    }
  })
});