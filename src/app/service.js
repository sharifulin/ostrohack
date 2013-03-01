
  basis.require('basis.net.service');

  var searchService = new basis.net.service.Service({
    transportClass: function(super_){
      return {
        init: function(){
          this.url = '/api/v1/search/' + this.controller;
          basis.net.AjaxTransport.prototype.init.call(this);
        },
        requestClass: {
          getResponseData: function(){
            return this.data.responseText.toObject();
          }
        }
      };
    }
  });

  module.exports = {
    'search': searchService
  };