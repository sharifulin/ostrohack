basis.require('basis.template');
basis.require('basis.dom.event');

// handle screen changes
basis.dom.event.addHandler(window, 'resize', function(){
  if (window.innerWidth <= 480)
    basis.template.setTheme('mobile');
  else
    basis.template.setTheme('base');
});