GP.Controller = GP.Class.extend({
	includes: GP.Mixin.Events,
	initialize: function(options) {
	    this.options = {};
        GP.Util.setOptions(this,options);
        GP.events.on("fire event",this._getFireEvent,this);
	},
    _getFireEvent: function(data){
    }
});