GP.Widget.FeaturesBox = GP.Widget.extend({
    _createWidget: function(){
        this._mainElement.append('<div id="features-div"/>');
        this._featureBlock = this._mainElement.children("#features-div");
        this._setHeight();
        this._featureBlock.append('<div id="features-container"/>');
        this._featureBlock.append('<div id="close-feature-button"/>');
        GP.events.addEvent("show features block",{width:this._featureBlock.width()});
        this._bind(this._featureBlock.children("#close-feature-button"),"click",{},GP.Util.bind(this._close,this));
        dustRender(this.options.template,this.options.dustObject,this._dustRender,this);

    },
    _dustRender: function(out){
        this._featureBlock.children("#features-container").html(out);
        this._featureBlock.children("#features-container").mCustomScrollbar({
                advanced:{
                    updateOnBrowserResize:true,
                    updateOnContentResize:true
                }
            }
        );
        this._bind(this._featureBlock.find(".clicked-title"),"click",{me: this},this._featureClick);
    },
    _featureClick: function(event){

    },
    _close: function(){
        this._featureBlock.remove("");
        GP.events.addEvent("close features block",{});
    },

    _setHeight: function(){
        var window_height = window.innerHeight,
            panelHeight = window_height - $("#header").height();

        this._featureBlock.height(panelHeight);
    },
    _onResize: function() {
        this._setHeight();
        this._featureBlock.children("#features-container").mCustomScrollbar("update");
    },
    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "wmsLayersClicked":
                    this._close();
                    break;
                case "geosearch no found data":
                    this._close();
                    break;
            }
        }
    },

    reload: function(template,dustObject){
        this.options.template = template;
        dustRender(template,dustObject,this._dustRender,this);
    }

});
