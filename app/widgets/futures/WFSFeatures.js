GP.Widget.WFSFeatures = GP.Widget.extend({
    _createWidget: function(){
        this._layerModel = this.options.layerModel;
        this._layer = this.options.layer;
        this._firstPhoto = undefined;
        this._popUp = undefined;
        this._loadEis = false;
        GP.stores.features = new GP.Store.Features();
        GP.stores.features.setReady();
        var title = this._layerModel.featureTitle(this._layer.properties),
            popUpHtml = '<div class="showFeatures" id="showAllFeatures">Подробнее</div>',
            featureHtml = this._layerModel.featureData(this._layer.properties);
        this._pkValue = this._layer.properties['fid'].replace(".","_");
        GP.stores.features.addObj({
                                    id: this._pkValue,
                                    title: title,
                                    data: this._layer.properties,
                                    groupData: {
                                        layerId: this._layerModel.get("id")
                                    }
                                });
        if(this._layerModel.get("info").eisInfo != undefined &&
           this._layerModel.get("info").eisInfo.hasEis == true){
           this._loadEis = true;
           this.on("eis loaded",this._eisLoader,this);
           var arr = this._pkValue.split("_"),
               fid = this._pkValue;

           if(arr.length > 1)
               fid = arr[arr.length-1];

           jsonGET("http://geoportal.prochar.ru/layers/eis/"+this._layerModel.get("id")+"/"+fid,{},GP.Util.bind(function(data){
                if(data && data.files && data.files.length){
                    var feature = GP.stores.features.getById(this._pkValue);
                    feature.set("eisStore",new GP.Store.Eis(data.files));
                    GP.stores.features.setById(this._pkValue,feature);
                    var i,len = data.files.length;
                    for(i=0;i<len;i++){
                        var file = data.files[i];
                        if(file.type.name == 'photo' && this._firstPhoto == undefined){
                            this._firstPhoto = file.url;
                        }
                    }
                    this.fire("eis loaded");
                }else{
                    $(".mapsurfer-popup-data").find(".firstImage").html("");
                    this._popUp.update();
                }
           },this));
        }
        this._createPopup(title,popUpHtml,featureHtml);

    },

    _eisLoader: function(){
        if(this._popUp != undefined){
            if(this._firstPhoto != undefined){
                var image = $('<img src="'+this._firstPhoto+'/150" alt=""/>');
                this._bind(image,"load",{},GP.Util.bind(function(event){
                    $(".mapsurfer-popup-data").find(".firstImage").html(image);
                    this._popUp.update();
                },this));
            }
        }
    },

    _createPopup: function(title,popUpHtml,featureHtml) {
        var _container = M.DomUtil.create('div', 'mapsurfer-popup-data'),
            createdPopUp = false;

        _container.innerHTML = '<h4>' + title + '</h4>' + popUpHtml;

        if (this._layer instanceof M.Marker) {
            this._layer.bindPopup(_container, {closeButton: true});
            this._layer.openPopup();
            this._popUp = this._layer.popup();
            createdPopUp = true;
        } else if (this._layer instanceof M.LatLng) {
            this._popUp = new M.Popup({closeButton: true}, this);
            this._popUp.setContent(_container);
            this._popUp.setLatLng(this._layer);
            this.map.openPopup(this._popUp);
            createdPopUp = true;
        }
        else if(this._layer instanceof M.Path){
            this._layer.bindPopup(_container, {closeButton: true});
            this._popUp = this._layer.popup();
            createdPopUp = true;
        }
        if(createdPopUp){
            if(this._loadEis){
                $(".mapsurfer-popup-data").find("h4").after('<p class="firstImage"/>');
                $(".mapsurfer-popup-data").find(".firstImage").append('<img src="'+GP.imagesPath+'/ajax-loader.gif" alt=""/>');

            }
            this._bind($("#showAllFeatures"),"click",{},GP.Util.bind(function(){
                var dustObject = {
                    featureGroups: [{
                        name: this._layerModel.get("name"),
                        features: [{
                            id: this._pkValue,
                            title: title,
                            display: true,
                            html: featureHtml
                        }]
                    }]
                };
                if(GP.widgets.featureBox == undefined || GP.widgets.featureBox instanceof GP.Widget.GeoSearchFeaturesBox)
                    GP.widgets.featureBox = new GP.Widget.WMSFeaturesBox({template:"wmsFeatures",dustObject:dustObject,
                                                                          firstElementId:this._pkValue},"#wrap");
                else
                    GP.widgets.featureBox.reload("wmsFeatures",dustObject,this._pkValue);
            },this));
        }
    }
});

