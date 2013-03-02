
  basis.require('basis.router');
  basis.require('basis.ui');

  var _postInit = basis.ui.Node.prototype.postInit;

  basis.ui.Node.prototype.postInit = function(){
    _postInit.call(this);

    if (this.router)
      basis.router.add(this.router, this.routerCallback, this);
  };

  basis.ui.Node.prototype.routerCallback = function(){
    this.select();
  };

  module.exports = basis.router.exports;