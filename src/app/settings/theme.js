basis.require('basis.template');
basis.require('basis.dom.event');

basis.template.define('app', resource('../template/index.js').fetch());
basis.template.theme('mobile').define('app', resource('../template/theme-mobile/index.js').fetch());


function checkTheme(){
  if (window.innerWidth <= 568)
    basis.template.setTheme('mobile');
  else
    basis.template.setTheme('base');
}

checkTheme();

// handle screen changes
basis.dom.event.addHandler(window, 'resize', checkTheme);