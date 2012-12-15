GP.Widget = GP.Class.extend({
    includes: GP.Mixin.Events,

    initialize: function(options,mainElement) {
        this.options = {};
        this._mainElement = undefined;
        GP.Util.setOptions(this,options);
       // console.log(mainElement);
        if (typeof mainElement == "string") {
            this._mainElement = $(mainElement);
        } else if (typeof mainElement == "object") {
            this._mainElement = mainElement;
        }
        GP.application.on('window.resized', this._onResize, this);
        GP.events.on("fire event",this._getFireEvent,this);
        this._createWidget();

    },
    _createWidget: function(){

    },

    findElem: function(selector) {
        return this._mainElement.find(selector);
    },

    draw: function() {

    },

    _createWidget: function(store) {

    },
    _destroyWidget: function() {

    },

    _bind: function(elem,event,data,fn){
        var bindElem;
        if (typeof elem == "string"){
            bindElem = $(elem);
        }else if (typeof elem == "object") {
            bindElem = elem;
        };
        bindElem.bind(event,data,fn);
        if(event == "click" && GP.Browser.touch)
            bindElem.bind("touchDown",data,fn);
    },

    _live: function(elem,event,data,fn){
        var bindElem;
        if (typeof elem == "string"){
            bindElem = $(elem);
        }else if (typeof elem == "object") {
            bindElem = elem;
        };
        bindElem.live(event,data,fn);
    },

    _setHeight: function() {

    },

    _onResize: function() {
    },
    _getFireEvent: function(data){
    }

});
