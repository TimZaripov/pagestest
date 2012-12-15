GP.Widget.Map = GP.Widget.extend({
    defaultOptions: {
        baseLayer: undefined,
        centerLat: 55.37911044801047,
        centerLng: 88.681640625,
        zoom: 3
    },
    _currentBaseLayer: null,
    _wmsLayers: new GP.HashMap(),
    _wfsLayers: new GP.HashMap(),
    _pointMarker: undefined,
    _popUp: undefined,
    _createWidget: function() {
        this.map = undefined;
        this._mapId = undefined;
        if (this.options.centerLat == undefined)
            this.options.centerLat = this.defaultOptions.centerLat;
        if (this.options.centerLng == undefined)
            this.options.centerLng = this.defaultOptions.centerLng;
        if (this.options.zoom == undefined)
            this.options.zoom = this.defaultOptions.zoom;
        if (this.options.mapContainerId != undefined)
            this._mapId = this.options.mapContainerId;
        if (this._mapId == undefined || !$("#" + this._mapId).length)
            return;

        var layers =  [];
        if(this.options.baseLayer != undefined){
            var baseLayer = new this.options.baseLayer();
            layers = [baseLayer];
        }

        this.map = new M.Map(this._mapId, {
            center: new M.LatLng(this.options.centerLat,this.options.centerLng),
            zoom: this.options.zoom,
            layers: layers,
            attributionControl: true
        });
        this.map.on('click', this._clickEvent, this);
        this.map.on('dblclick', this._disableClickEvent, this);
        this.map.on('zoomstart', this._disableClickEvent, this);
        this.map.on('movestart', this._disableClickEvent, this);
        this.map.on('popupclose',this._removePoint,this);
        this.map.addControl(new M.Control.Scale());
	},
    _setReady: function(){
        this._mapIsReady = true;
        this.map.off("load",this._setReady);
    },

    _unsetClickTimeout: function() {
        if (this._clickTimeout) {
            clearTimeout(this._clickTimeout);
            this._clickTimeout = undefined;
        }
    },

    _clickEvent: function(e) {
        if (this._wmsLayers &&
            this._wmsLayers.getCount()>0 &&
            (!this._lastDisableEvent ||
                (Date.now() - this._lastDisableEvent)>200)) {
            this._unsetClickTimeout();
            this._clickTimeout = setTimeout(M.Util.bind(function() {
                this._wmsLayersClicked(e);
            }, this), 200);

        }
    },

    _disableClickEvent: function(e) {
        if (this._wmsLayers &&
            this._wmsLayers.getCount()>0) {
            this._lastDisableEvent = Date.now();
            this._unsetClickTimeout();
        }
    },


    _wfsLayersClicked: function(e){
        if (e.target.record) {
            this._wfsFeatures = new GP.Widget.WFSFeatures({layerModel: e.target.record, layer: e.layer});
        }
    },

    _featureParsedWfs: function(e){
        e.layer.parentLayer = e.target;
    },

    _wmsLayersClicked: function(e) {
        GP.events.addEvent("wmsLayersClicked",{});
        var clickData = {};
        clickData.layersId = this.getTurnedLayerId("wms");
        clickData.size = this.map.size();
        clickData.extent = this.map.bounds();
        clickData.point = this.map.layerPointToContainerPoint(e.layerPoint);
        var data = JSON.stringify(clickData);
        jsonPOST("http://geoportal.prochar.ru/layers/feature",clickData,GP.Util.bind(function(result){
            if(result.data == undefined || Object.keys(result.data).length == 0) {
                alert("В данной точке не найдено ни одного объекта");
                GP.events.addEvent("create features widget",{});
                return;
            }
            this._wmsFeatures = new GP.Widget.WMSFeatures({result: result.data,latLng: e.latlng});
        },this));
    },

    _removePoint: function(){
        this.map.off('popupclose',this._removePoint);
        if(this._wmsFeatures != undefined)
            this._wmsFeatures = undefined;
        if(this._wfsFeatures != undefined)
            this._wfsFeatures = undefined;
        if(this._pointMarker != undefined){
            if(this.map.hasLayer(this._pointMarker))
                this.map.removeLayer(this._pointMarker);
            this._pointMarker = undefined;
        }
        this.map.on('popupclose',this._removePoint,this);
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "start reload application":
                    if(this._wmsLayers.getCount() > 0) {
                        this._wmsLayers.each(function(key, layer, length){
                            this.map.removeLayer(layer);
                        },this);
                    }
                    if(this._wfsLayers.getCount() > 0) {
                        this._wfsLayers.each(function(key, layer, length){
                            this.map.removeLayer(layer);
                        },this);
                    }
                    this._wmsLayers = new GP.HashMap();
                    this._wfsLayers = new GP.HashMap();
                    break;
                case "show features block":
                    var width = data.object.width;
                    if(width != undefined)
                        this._mainElement.css("margin-left",width+"px");
                    break;
                case "close features block":
                    this._mainElement.css("margin-left",0+"px");
                    this._removePoint();
                    break;
                case "close wmsfeatures block":
                    this._mainElement.css("margin-left",0+"px");
                    delete GP.widgets.featureBox;
                    break;
                case "start geosearch":
                    this._removePoint();
                    break;
                case "distance control enable":
                    this.map.off('click', this._clickEvent);
                    break;
                case "distance control disable":
                    this.map.on('click', this._clickEvent,this);
                    break;

            }
        }
    },

    setPoint: function(lon,lat,zoom,html){
        this._removePoint();
        var latLng = new M.LatLng(lat,lon);
        this._pointMarker = new M.Marker(latLng, {icon: new GP.MapsurferIcon()});
        this.map.addLayer(this._pointMarker);
        this.map.setView(latLng,zoom ? zoom : 12);
        if(html != undefined && html != ""){
            var _container = M.DomUtil.create('div', 'mapsurfer-popup-data');
            _container.innerHTML = html;

            this._pointMarker.bindPopup(_container, {closeButton: true}).openPopup();
        }
        return this._pointMarker;
    },

    getCenter: function(){
        return this.map.center();
    },

    getTurnedLayerId: function(type){
        var wmsLayers = this._wmsLayers.getArray(true),
            wfsLayers = this._wfsLayers.getArray(true),
            resultArray = [];
        if(type == "wms")
            resultArray = wmsLayers;
        else if(type == "wfs")
            resultArray = wfsLayers;
        else
            resultArray = wmsLayers.concat(wfsLayers);

        return resultArray;
    },

    setBBox: function(minLon,minLat,maxLon,maxLat,projection){
        if(projection != undefined && projection == "EPSG:4326"){
            if(minLat < -85)
                minLat = 85;
            if(maxLat > 85)
                maxLat = 85;
        }
        var bounds = new M.LatLngBounds(
            new M.LatLng(maxLat,maxLon),
            new M.LatLng(minLat,minLon));
        this.map.fitBounds(bounds);
    },
    setBaseLayer: function(baseLayer){
        if(baseLayer instanceof Object){
            if(this._currentBaseLayer != null)
                this.map.removeLayer(this._currentBaseLayer);
            this._currentBaseLayer = baseLayer;
            this.map.addLayer(baseLayer,false,true);
        }
    },

    offLayer: function(layerId){
        var mapLayer = null, type = '';
        if(this._wmsLayers.containsKey(layerId)){
            mapLayer =  this._wmsLayers.get(layerId);
            this._wmsLayers.removeByKey(layerId);
            type = "wms";
        }
        else if(this._wfsLayers.containsKey(layerId)){
            mapLayer =  this._wfsLayers.get(layerId);
            this._wfsLayers.removeByKey(layerId);
            type = "wfs";
        }
        if (mapLayer != null && this.map.hasLayer(mapLayer)){
            if(type == "wfs"){
                mapLayer.off('click', this._wfsLayersClicked);
                mapLayer.off('featureparse', this._featureParsedWfs, this);
            }
            this.map.removeLayer(mapLayer);
        }
    },
    turnLayer: function(layerId,mapLayer,service){
        if(service == "WFS"){
            mapLayer.on('click', this._wfsLayersClicked, this);
            mapLayer.on('featureparse', this._featureParsedWfs, this);
            this._wfsLayers.add(layerId,mapLayer);
        }
        else
            this._wmsLayers.add(layerId,mapLayer);
        if (!this.map.hasLayer(mapLayer))
            this.map.addLayer(mapLayer);
    }



});