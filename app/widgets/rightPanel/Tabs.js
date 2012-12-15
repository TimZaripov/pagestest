GP.Widget.Tabs = GP.Widget.extend({
    /*
     options{
        layerGroups
     }
    */
    statics: {
        PANEL_MARGIN_TOP: 10,
        PANEL_PADDING_TOP: 6,
        PANEL_PADDING_BOTTOM: 6,
        PANEL_SHADOW_HEIGHT: 10,
        PANEL_BOTTOM_HEIGHT: 30,

        CLOSE_PANEL_PADDING_TOP: 1,
        CLOSE_PANEL_PADDING_BOTTOM: 1,
        CLOSE_PANEL_MARGIN_TOP: 1,

        UL_PADDING_TOP: 2,
        DIV_BORDER: 1,
        DIV_PADDING_TOP: 7,
        DIV_PADDING_BOTTOM: 2


    },
    _layerObject: {
        "id":0,
        "name":"Слои",
        "image": GP.imagesPath+'/icons/layers.png',
        "imageWhite": GP.imagesPath+'/icons/layers-white.png',
        "divId":"layers-block"
    },
    _layerLegendObject: {
        "id":1,
        "name":"Легенда",
        "image": GP.imagesPath+'/icons/legend.png',
        "imageWhite": GP.imagesPath+'/icons/legend-white.png',
        "divId":"layerLegend-block"
    },
    _tab: undefined,
    _view: true,
    _height: 0,
    _windowResized: false,
	_createWidget: function(){
        this._clearAll();
        if(this.options.layerGroups == undefined || this.options.layerGroups.length == 0)
	        return;
        GP.stores.tabs = new GP.Store.Tabs();
        GP.stores.tabs.setReady();
        GP.stores.layerGroups = new GP.Store.LayerGroups();
        GP.stores.layerGroups.setReady();
        GP.stores.layers = new GP.Store.Layers();
        GP.stores.layers.setReady();

		this._mainElement.prepend('<div id="layers-tabs"/>');
        this._tab = this._mainElement.children("#layers-tabs");
        this._tab.append("<ul/>");

        this._tab.children("ul").append('<li title="'+this._layerObject.name+'"><a href="#'+this._layerObject.divId+'"><img src="'+this._layerObject.image+'" alt="" /></a></li>' +
                                        '<li title="'+this._layerLegendObject.name+'"><a href="#'+this._layerLegendObject.divId+'"><img src="'+this._layerLegendObject.imageWhite+'" alt="" /></a></li>');
        this._tab.append('<div id="'+this._layerObject.divId+'"/><div id="'+this._layerLegendObject.divId+'"/>');
        GP.stores.tabs.addObj(this._layerObject,false);
        GP.stores.tabs.addObj(this._layerLegendObject,false);
        this._mainElement.show();
        this._tab.tabs({
            select: GP.Util.bind(this._tabSelect,this)
        });
        this._setHeight();
        GP.widgets.LayerAccordion = new GP.Widget.LayerAccordion({data:this.options.layerGroups,accordionId:"groups-accordion"},this._tab.children('#layers-block'));

        this._bind(this._mainElement.children(".right-panel-hider"),"click",{},GP.Util.bind(this._sliderTab,this));
        GP.widgets.LayerLegends = new GP.Widget.LayerLegends({},this._tab.children("#"+this._layerLegendObject.divId));

	},
    _sliderTab: function(){
        if(this._view){
            this._mainElement.children("#layers-tabs").slideUp('fast');
            this._mainElement.css("opacity",0.5);
            this._mainElement.children(".right-panel-hider").find(".arrow").css("background-position","0 20px");
            this._mainElement.height(20);
            this._view = false;
        }
        else{
            this._mainElement.children("#layers-tabs").slideDown('fast', GP.Util.bind(function(){
                if(this._windowResized){
                    this._setHeight();
                    GP.events.addEvent("tab resize",{});
                    this._windowResized = false;
                }else{
                    this._mainElement.height(this._height);
                }
            },this));
            this._mainElement.css("opacity",1);
            this._mainElement.children(".right-panel-hider").find(".arrow").css("background-position","0 0");
            this._view = true;
        }
    },
    _tabSelect: function(event, ui){
        var model;
        if(GP.stores.tabs != undefined && this._tab != undefined){
            this._tab.children("ul").find("img").each(GP.Util.bind(function(key,elem){
                model = GP.stores.tabs.getById(key);
                $(elem).attr("src",model.get("imageWhite"));
            },this));
            model = GP.stores.tabs.getById(ui.index);
            $(ui.tab).children("img").attr("src",model.get("image"));
        }
    },

    _setHeight: function(){
        var window_height, panelHeight,tabHeight, accordionHeight;
        window_height = window.innerHeight;
        panelHeight = window_height - ($("#header").height() + GP.Widget.Tabs.PANEL_MARGIN_TOP + GP.Widget.Tabs.PANEL_PADDING_TOP +
            GP.Widget.Tabs.PANEL_PADDING_BOTTOM + GP.Widget.Tabs.PANEL_SHADOW_HEIGHT + GP.Widget.Tabs.PANEL_BOTTOM_HEIGHT);

        this._height = panelHeight;
        this._mainElement.height(panelHeight);
        tabHeight = panelHeight - (this._mainElement.children(".right-panel-hider").height() + GP.Widget.Tabs.CLOSE_PANEL_PADDING_TOP +
            GP.Widget.Tabs.CLOSE_PANEL_PADDING_BOTTOM + GP.Widget.Tabs.CLOSE_PANEL_MARGIN_TOP);
        this._tab.height(tabHeight);
        accordionHeight = tabHeight - (this._tab.children("ul").height() + GP.Widget.Tabs.UL_PADDING_TOP + GP.Widget.Tabs.DIV_BORDER * 2
            + GP.Widget.Tabs.DIV_PADDING_TOP + GP.Widget.Tabs.DIV_PADDING_BOTTOM)-1;
        this._tab.children('#layers-block').height(accordionHeight);
        this._tab.children('#layerLegend-block').height(accordionHeight);
    },

    _clearAll: function(){
        this._mainElement.hide();
        this._mainElement.children("#layers-tabs").remove();
        this._mainElement.height(0);
        delete GP.stores.tabs;
        delete GP.stores.layerGroups;
        delete GP.stores.layers;
        this._tab = undefined;
        delete GP.widgets.LayerAccordion;
    },
    _onResize: function() {
        if(this._view){
            this._setHeight();
            GP.events.addEvent("tab resize",{});
        }else
            this._windowResized = true;

    }



});
GP.register("tabs", GP.Widget.Tabs);