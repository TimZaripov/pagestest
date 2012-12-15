GP.Widget.LayerList = GP.Widget.List.extend({
    _createWidgetAnim: function(){
        var elementsLen = this._data.groupLayers.length,
            groupId = this._data.groupId,
            element, elemTitle, elemId, layer;
        this._mainElement.css('overflow','auto');
        if (elementsLen > 0 && this._currentAddElemId < elementsLen) {
            for(var i=this._currentAddElemId+1;i<elementsLen;i++){
                element = this._data.groupLayers[i];
                if (element != null){
                    elemTitle = element.layer.name;
                    elemId = element.layer.id;
                    layer = element.layer;
                    layer.order = element.order;
                    layer.groupId = groupId;
                    GP.stores.layers.addObj(layer,false);
                    //element.on('getFeatures',this._showFeatures,this);
                    this._mainElement.append('<div class="layer" id="'+elemId+'"/>');
                    var row = this._mainElement.children("div:last");
                    row.append('<input type="checkbox" value="'+elemId+'" class="checkbox"/>' +
                                '<span class="title">'+GP.subString(elemTitle,30,'...')+'</span><span class="info">?</span>');
                    if (i%2 != 0)
                        row.addClass('colored');
                    this._bind(row.children(".checkbox"),"click",{me:this},this._checkboxClick);
                    this._bind(row.children(".info"),"click",{},this._infoShow);
                }
                this._currentAddElemId = i;
            }
            if (this._currentAddElemId < (elementsLen-1))
                GP.Util.requestAnimFrame(this._createWidgetAnim,this,false,this);
        }
    },

    _checkboxClick: function(event){
        var me = event.data.me,
            layerId = $(this).val();
        if($(this).hasClass("checked")){
            $(this).removeClass("checked");
            me._turnOffLayer(layerId,"off");
        }
        else{
            $(this).addClass("checked");
            me._turnOffLayer(layerId,"turn");
        }
    },

    _turnOffLayer: function(layerId,action){
        var layer = GP.stores.layers.getById(layerId);
        if(layer == undefined)
            throw("Cлой не был найден в системе");
        if(action == "off"){
            GP.mainMap.offLayer(layerId);
            GP.events.addEvent("off layer",{layer:layer});
        }
        else{
            var mapLayer = layer.get("mapLayer"),
                info = layer.get("info");
            if(mapLayer == null){
                if (info.service == 'WMS')
                    mapLayer = new M.TileLayer.WMS(info.requestUrl, {layers: info.typeName, styles: info.style, format: 'image/png', transparent: true});
                else{
                    var wfsOptions = {};

                    if (GP.wfsDoubleSize && GP.wfsDoubleSize===true) {
                        wfsOptions.doubleSize = true;
                    }
                    mapLayer = new M.WFS(info.requestUrl,info.typeName,info.requestUrl.substring(0,info.requestUrl.length-3) + "styles/" + layerId + "/" + info.style+ ".sld",undefined,wfsOptions);
                }
                mapLayer.record = layer;
                layer.set("mapLayer",mapLayer);
                GP.stores.layers.setById(layerId,layer);
            }
            GP.mainMap.turnLayer(layerId,mapLayer,info.service);
            GP.events.addEvent("turn layer",{layer:layer});
        }
    },

    _infoShow: function(event){
        var layerId = $(this).parent("div").attr("id"),
            layer = GP.stores.layers.getById(layerId);
        if(layer == null)
            throw("Слой не найден в системе");

        if(GP.widgets.layerLegendBox == undefined){
            var left = window.innerWidth - 500;
            GP.widgets.layerLegendBox = new GP.Widget.DialogBox({dialogBoxId:"layerLegendBox",width:300,top:165,left:left},"#wrap");
        }

        GP.widgets.layerLegendBox.clear();
        GP.widgets.layerLegendBox.setTitle("Информация по слою");
        var content = '<p>' + layer.get("name") + '</p><p>Легенда:</p><p><img src="'+ 'http://geoportal.prochar.ru' + '/service/wms?request=GetLegendGraphic&style='+layer.get("info").style+'&layer='+
                    layer.get("info").typeName+'&format=image/png"></p>';
        GP.widgets.layerLegendBox.setContainer(content);
        GP.widgets.layerLegendBox.show();
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "layer group input click":
                    var groupId = data.object.groupId,
                        action = data.object.action,
                        layerId,
                        me = this;
                    if(this._data.groupId == groupId){
                        this._mainElement.find(".checkbox").each(function(){
                            layerId = $(this).val();
                            if(action == "turn all" && !$(this).hasClass("checked")){
                                $(this).attr('checked',"checked");
                                $(this).addClass("checked");
                                me._turnOffLayer(layerId,"turn");
                            }
                            else if(action == "off all" && $(this).hasClass("checked")){
                                $(this).removeAttr('checked');
                                $(this).removeClass("checked");
                                me._turnOffLayer(layerId,"off");
                            }
                        });

                    }

                    break;
            }
        }
    }

});
GP.register("layerList", GP.Widget.LayerList);
