GP.Controller.Application = GP.Controller.extend({
    _loaded: false,
    initialize: function() {
        GP.events.addEvent("start load application",{});
        GP.Controller.prototype.initialize.call(this,{});
        GP.models.currentUser = null;
        GP.models.currentMapExtent = null;
        GP.models.currentMapExtent = null;
        GP.widgets.userPanel = new GP.Widget.UserPanel({},".login-info");
        GP.mainMap = new GP.Widget.Map({mapContainerId: "map"},"#content");
        GP.widgets.zoomControl = new GP.Widget.ZoomControl({},".zoom-control");
        GP.widgets.actions = [new GP.Widget.Distance({first: true}),new GP.Widget.Print(),new GP.Widget.Reports()];

        this._getBaseData();
        this.on("load base data for system",this._loadedBaseData,this);
    },

    _getBaseData: function(){
        if(this._loaded)
            return;
        jsonGET("http://geoportal.prochar.ru/baseLayers", {}, GP.Util.bind(function(data){
            if(data == null)
                alert("При инициализации системы произошла ошибка!");
            var baseLayers = new Array(),
                turned = false, object = {}, len = data.schemas.length, i, id=1;
            if(len > 0){
                for(i=0; i<len; i++){
                    var turn = false;
                    if(i == 0){
                        turn = true;
                    }   turned = true;
                    object = {
                        id: id,
                        name: data.schemas[i].name,
                        className:  data.schemas[i].className,
                        type: "schema",
                        turnOn: turn
                    }
                    id++;
                    baseLayers.push(object);
                }
            }
            if(data.spaces.length > 0){
                len = data.spaces.length;
                for(i=0; i<len; i++){
                    var turn = false;
                    if(i == 0 && !turned)
                        turn = true;
                    object = {
                        name: data.spaces[i].name,
                        className:  data.spaces[i].className,
                        type: "space",
                        turnOn: turn
                    }
                    id++;
                    baseLayers.push(object);
                }
            }
            GP.stores.baseLayers = new GP.Store.BaseLayers(baseLayers);
            if(GP.stores.baseLayers.length() > 0){
                var currentBaseLayer = GP.stores.baseLayers.getFirst();
                GP.mainMap.setBaseLayer(currentBaseLayer.get("className"));
            }
            jsonGET("http://geoportal.prochar.ru/currentUser ", {}, GP.Util.bind(function(data){
                if(data == undefined)
                    alert("При инициализации системы произошла ошибка!");
                if(data.user == null)
                    GP.models.currentUser = null;
                else
                    GP.models.currentUser = new GP.Model.User(data.user);
                //GP.widgets.userPanel.reloadPanel(data.user);
                this.fire("load base data for system");
            },this));

        },this));
    },

    _loadedBaseData: function(){
        if(this._loaded)
            return;
        this._loaded = true;
        this.off("load base data for system",this._loadedBaseData);
        GP.widgets.baseLayerSelector = new GP.Widget.BaseLayerSelector({},$("#baseLayer-selector-container").children(".baselayers"));
        GP.widgets.geoSearch = new GP.Widget.GeoSearch({},$("#baseLayer-selector-container").children(".geosearch"));
        GP.events.addEvent("load user",{});
        this._getLayerGroups();
    },

    _getLayerGroups: function(){
        jsonGET("http://geoportal.prochar.ru/layers", {}, GP.Util.bind(function(data){
            if(data == null || data.groups == undefined || data.mapExtent == undefined)
                alert("При инициализации слоев произошла ошибка!");
            GP.events.addEvent("layers loaded",{groups:data.groups,mapExtent:data.mapExtent});
        },this));
    },

    _createApplication: function(data){
        var layerGroups = data.groups,
            mapExtent = data.mapExtent;
        if(mapExtent != null){
            GP.models.currentMapExtent = new GP.Model.MapExtent(mapExtent);
            GP.mainMap.setBBox(mapExtent.extent.minX,mapExtent.extent.minY,mapExtent.extent.maxX,mapExtent.extent.maxY);
        }
        GP.widgets.tabs = new GP.Widget.Tabs({layerGroups:data.groups},".right-panel");
        GP.events.addEvent("end create application",{});
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "authentication success":
                    this._reloadApplication(data.object.user);
                    break;
                case "layers loaded":
                    this._createApplication(data.object)
                    break;
                case "logout":
                    this._logout();
                    break;
           }
        }
    },

    _logout: function(){
        GP.widgets.ajaxLoader.showLoader();
        jsonGET("http://geoportal.prochar.ru/logout", {}, GP.Util.bind(function(data){
            this._reloadApplication(null);
        },this));
    },

    _reloadApplication: function(user){
        GP.events.addEvent("start reload application",{});
        if(user == null)
            GP.models.currentUser = null;
        else
            GP.models.currentUser = new GP.Model.User(user);
        GP.events.addEvent("reload user",{});
        this._getLayerGroups();

    }
});

