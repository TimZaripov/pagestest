GP.Widget.GeoSearch = GP.Widget.extend({
    _createWidget: function(){
        this._mainElement.append('<input type="text"/>');
        this._mainElement.append('<img id="geosearch-buuton" alt="" src="'+GP.imagesPath+'/geosearch-icon.png">');
        this._input = this._mainElement.children("input");
        this._bind(this._mainElement.children("#geosearch-buuton"),"click",{},GP.Util.bind(this._search,this));
        this._bind(this._input,"keypress",{},GP.Util.bind(this._keyPresses,this));
    },

    _keyPresses: function(e){
        if(e.keyCode == 13) {
            this._search();
        }
    },

    _search: function(){
        if(this._input.val() == "")
            return;
        GP.events.addEvent("start geosearch");
        var center = GP.mainMap.getCenter(),
            turnedLayersId = GP.mainMap.getTurnedLayerId("wms"),
            object = {
                layersId: turnedLayersId,
                query: this._input.val(),
                point: {lon:center.lng,lat:center.lat}
            };
        jsonPOST("http://geoportal.prochar.ru/geosearch",object,GP.Util.bind(this._getResult,this));
    },

    _getResult: function(data){
        GP.events.addEvent("finish geosearch");
        if(data != undefined && data.layers != undefined && data.layers.length > 0){
            var layers = data.layers,
                dustObject = {
                    featureGroups: new Array()
                };
            GP.stores.features = new GP.Store.Features();
            GP.stores.features.setReady();
            for(var i=0,len = layers.length;i<len;i++){
                var layer = layers[i],
                    items = layer.items,
                    dustGroup = {
                        className: "",
                        name: layer.layer,
                        features: []
                    };
                if(i % 2 != 0)
                    dustGroup.className = "colored";

                for (var j=0,iLen=items.length;j<iLen;j++){
                    var object = {
                            id: layer.wmsName + "." + items[j].pkid,
                            title: items[j].label,
                            data: items[j],
                            groupData: {
                                layer: layer.layer,
                                wmsName: layer.wmsName,
                                layerId: layer.layerId
                            }
                        },
                        dustItem = {
                            id:layer.wmsName + "." + items[j].pkid,
                            title: items[j].label
                        };
                    GP.stores.features.addObj(object);
                    dustGroup.features.push(dustItem);

                }
                dustObject.featureGroups.push(dustGroup);
            }
            if(GP.widgets.featureBox == undefined || GP.widgets.featureBox instanceof GP.Widget.WMSFeaturesBox)
                GP.widgets.featureBox = new GP.Widget.GeoSearchFeaturesBox({template:"features",dustObject:dustObject},"#wrap");
            else
                GP.widgets.featureBox.reload("features",dustObject);

        }
        else{
            GP.events.addEvent("geosearch no found data");
            delete GP.widgets.featureBox;
            alert("По запросу ничего не найдено!");
        }


    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "close features block":
                    this._input.val('');
                    delete GP.widgets.featureBox;
                    break;
            }
        }
    }

});

