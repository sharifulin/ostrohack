basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.hotelCities', __dirname + 'l10n', {
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),
  
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      title: 'data:',
      count: 'data:'
    }
  },

  childNodes: basis.array.create(5, function(idx){
    return {
      data: {
        title: 'Название города ' + idx,
        count: parseInt(Math.random()*(idx+100))
      }
    }
  })
});