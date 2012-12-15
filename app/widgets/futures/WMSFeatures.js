GP.Widget.WMSFeatures = GP.Widget.extend({
    _createWidget: function(){
        GP.stores.features = new GP.Store.Features();
        GP.stores.features.setReady();
        this._dustObject = {
           featureGroups: new Array()
        };
        this._featureCount = 0;
        this._latLng = this.options.latLng;
        this._currentData = null;
        this._firstPhoto = undefined;
        this._popUp = undefined;

        var result = this.options.result,
            length = result.length,
            viewData = null,
            i = 0;
        for (var wmsName in result) {
            var resultLayer = result[wmsName],
                features = resultLayer.features,
                layer = GP.stores.layers.getById(resultLayer.layerId);
            if(layer != null){
                if(i == 0){
                    this._currentData = {
                        feature: features[0],
                        layer: layer,
                        hasEis: false
                    }
                }
                this._featureCount += features.length;
                var titleField = layer.getTitleFields(),
                    dustGroup = {
                        name: layer.get("name"),
                        features: []
                    };
                for (var j=0,iLen=features.length;j<iLen;j++){
                    var title = "", keyField, fid = features[j]['fid'];
                    if(titleField.length == 0){
                        keyField = Object.keys(features[j])[0];
                        title = features[j][keyField];
                    }
                    else{
                        for(var key in titleField){
                            var value = features[j][titleField[key].name];
                            if(value != undefined)
                                title += value;
                        }
                    }
                    if(title == "")
                        title = 'Нет названия';

                    var object = {
                            id: wmsName.replace(":","-") + "_" + fid,
                            title: title,
                            data: features[j],
                            groupData: {
                                wmsName: wmsName,
                                layerId: resultLayer.layerId
                            }
                        },
                        dustItem = {
                            id: wmsName.replace(":","-") + "_" + fid,
                            title: title
                        };
                    if(i==0 && j==0)
                        dustItem.display = true;

                    dustItem.html = layer.featureData(features[j]);
                    GP.stores.features.addObj(object);
                    dustGroup.features.push(dustItem);

                }
                this._dustObject.featureGroups.push(dustGroup);
                i++;
            }


        }
        GP.events.addEvent("create features widget",{});
        if(this._currentData != null){
            var layer = this._currentData.layer,
                fid = this._currentData.feature['fid'];
            if(layer.get("info").eisInfo != undefined &&
               layer.get("info").eisInfo.hasEis == true){
                this._currentData.hasEis = true;
                this.on("eis loaded",this._eisLoader,this);

                jsonGET("http://geoportal.prochar.ru/layers/eis/"+layer.get("id")+"/"+fid,{},GP.Util.bind(function(data){
                    if(data && data.files && data.files.length){
                        var key = layer.get("info").typeName.replace(":","-") + "_" + fid,
                            feature = GP.stores.features.getById(key);

                        feature.set("eisStore",new GP.Store.Eis(data.files));
                        GP.stores.features.setById(key,feature);
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
                    }
                },this));
            }
        }
        this._showPopUp();

    },

    _eisLoader: function(){
        if(this._popUp != undefined){
            if(this._firstPhoto != undefined){
                console.log("adhtt");
                var image = $('<img src="'+this._firstPhoto+'/150" alt=""/>');
                this._bind(image,"load",{},GP.Util.bind(function(event){
                    $(".mapsurfer-popup-data").find(".firstImage").html(image);

                    this._popUp.update();
                },this));
            }
        }
    },

    _showPopUp: function(){
        if(this._currentData != null){
            var title = this._currentData.layer.featureTitle(this._currentData.feature),
                firstFid = this._currentData.layer.get("info").typeName.replace(":","-") + "_" +this._currentData.feature['fid'],
                html = "",
                zoom;
            if(this._featureCount > 1)
                html = '<div class="showFeatures" id="showAllFeatures">Подробнее и найдено: '+this._featureCount+' объектов</div>';
            else
                html = '<div class="showFeatures" id="showAllFeatures">Подробнее</div>';

            zoom = GP.mainMap.map.zoom();
            var marker = GP.mainMap.setPoint(this._latLng.lng,this._latLng.lat,zoom,'<h4>'+title+'</h4>'+html);
            this._popUp = marker.popup();
            if(this._currentData.hasEis){
                $(".mapsurfer-popup-data").find("h4").after('<p class="firstImage"/>');
                $(".mapsurfer-popup-data").find(".firstImage").append('<img src="'+GP.imagesPath+'/ajax-loader.gif" alt=""/>');
            }
            this._bind($("#showAllFeatures"),"click",{},GP.Util.bind(function(){
                if(GP.widgets.featureBox == undefined || GP.widgets.featureBox instanceof GP.Widget.GeoSearchFeaturesBox){
                    GP.widgets.featureBox = new GP.Widget.WMSFeaturesBox({template:"wmsFeatures",dustObject:this._dustObject,
                                                                          firstElementId:firstFid},"#wrap");
                }
                else{
                    GP.widgets.featureBox.reload("wmsFeatures",this._dustObject,firstFid);
                }
            },this));
        }
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "close features block":
                    delete GP.widgets.featureBox;
                    break;
                case "close wmsfeatures block":
                    delete GP.widgets.featureBox;
                    break;
                case "start geosearch":
                    break;
            }
        }
    }
});

