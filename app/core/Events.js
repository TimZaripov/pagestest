/*
 * MC.Mixin.Events adds custom events functionality to MC classes
 */

GP.Mixin = {};

GP.Mixin.Events = {
	addEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._mapcube_events = this._mapcube_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
		});
		return this;
	},
	
	hasEventListeners: function(/*String*/ type) /*-> Boolean*/ {
		var k = '_mapcube_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},
	
	removeEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) { return this; }
		
		for (var i = 0, events = this._mapcube_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) && 
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},
	
	fireEvent: function(/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) { return this; }
		var event = GP.Util.extend({
			type: type,
			target: this
		}, data);
		
		var listeners = this._mapcube_events[type].slice();
		
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}
		
		return this;
	}
};

GP.Mixin.Events.on = GP.Mixin.Events.addEventListener;
GP.Mixin.Events.off = GP.Mixin.Events.removeEventListener;
GP.Mixin.Events.fire = GP.Mixin.Events.fireEvent;