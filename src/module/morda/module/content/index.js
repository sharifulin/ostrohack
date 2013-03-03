basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.morda.content';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Recently viewed',
  back: 'Go back',
  more: 'More hotel',
  labelViewed: 'Is now being viewed by',
  labelPeople: 'people',
  labelPriceFrom: 'from'
});

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  template: templates.list,
  binding: {
    countMore: 'data:'
  },
  data: {
    countMore: 1
  },
  
  childClass: {
    template: templates.item,
    binding: {
      title: 'data:',
      img: 'data:',
      url: 'data:',
      price: 'data:',
      dateAt: 'data:',
      watchers: 'data:',
      star_rating: 'data:'
    }
  },
  
  childNodes: basis.data([
    {
      title: 'Гостиница Парк отель',
      img: 'http://ostrovok-st.ngenix.net/t/100x100/extranet/media/23474d8113c84e75a47f62340edfc907.jpg',
      url: '/hotels/special/info/108669933/',
      price: 1950,
      dateAt: 'сегодня в 04:03',
      watchers: 1,
      star_rating: 0
    },
    {
      title: 'Хостел на Чистых Прудах',
      img: 'http://ostrovok-st.ngenix.net/t/100x100/extranet/media/f09d530fdce34fa29b2d162732bdabbe.JPG',
      url: '/hotels/special/info/945938918/',
      price: 1500,
      dateAt: 'сегодня в 23:10',
      watchers: 5,
      star_rating: 0
    },
    {
      title: 'Кассадо Плаза',
      img: 'http://ostrovok-st.ngenix.net/t/100x100/extranet/media/7d27c667c2b8444c9103dc247aaeee0c.jpg',
      url: '/hotels/special/info/513215875/',
      price: 4675,
      dateAt: 'сегодня в 22:46',
      watchers: 4,
      star_rating: 40
    },
    {
      title: 'Отель Шерстон',
      img: 'http://ostrovok-st.ngenix.net/t/100x100/extranet/media/a0664957591741508f7c579bc33493d9.jpg',
      url: '/hotels/special/info/172123382/',
      price: 2630,
      dateAt: 'сегодня в 02:04',
      watchers: 7,
      star_rating: 30
    },
    {
      title: 'Stayokay Hostel Amsterdam Vondelpark',
      img: 'http://ostrovok-st.ngenix.net/t/100x100/mec/hotels/5000000/4730000/4728300/4728278/4728278_12_b.jpg',
      url: '/hotels/global/info/396260/',
      price: 1097,
      dateAt: 'вчера в 21:21',
      star_rating: 20
    }
  ])
});
