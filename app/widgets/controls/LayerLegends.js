GP.Widget.LayerLegends = GP.Widget.extend({
    statics: {
        BORDER_WIDTH: 1,
        PADDING_TOP: 2,
        PADDING_BOTTOM: 2
    },

    _createWidget: function() {
        this._mainElement.append('<div class="legends"/>');
        this._setHeight();
        this._mainElement.children(".legends").append('<div class="block"/>');
        this._div = this._mainElement.children(".legends").children("div");
    },

    _setHeight: function(){
        var heightA = this._mainElement.height() - GP.Widget.LayerLegends.BORDER_WIDTH * 2 -
            GP.Widget.LayerLegends.PADDING_TOP - GP.Widget.LayerLegends.PADDING_BOTTOM;
        this._mainElement.children(".legends").height(heightA);
    },
    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "off layer":
                    var layer = data.object.layer;
                    this._div.children("#"+layer.get("id")).remove();
                    break;
                case "turn layer":
                    var layer = data.object.layer;
                    this._createItem(layer);
                    break;
                case "tab resize":
                    this._setHeight();
                    break;
            }
        }
    },
    _createItem: function(layer){
        this._div.append('<div id="'+layer.get("id")+'" class="item"><div class="title">'+layer.get("name")+'</div></div>');
        var img = $('<img src="'+ 'http://geoportal.prochar.ru' + '/service/wms?request=GetLegendGraphic&style=' +
                    layer.get("info").style + '&layer='+layer.get("info").typeName+'&format=image/png">'),
            parent = this._div.children(".item:last");
        this._bind(img,"load",{me: this,layer:layer},function(event){
            var me = event.data.me,
                layer = event.data.layer,
                width = $(this).get(0).width,
                height = $(this).get(0).height;

            if(width > 20 && height < 20){
                parent.append('<div class="image"/>');
                parent.children(".image").append(img);
            }
            else if(height > 20){
                parent.append('<div class="arrow"/>')
                parent.append('<div class="image image-float image-block"/>');
                parent.children(".image").append(img);
                me._bind(parent.children(".arrow"),"click",{},function(){
                    if(!$(this).hasClass("arrow-rotate")){
                        parent.children(".image-block").height(height);
                        $(this).addClass("arrow-rotate");
                    }
                    else{
                        parent.children(".image-block").height(20);
                        $(this).removeClass("arrow-rotate");
                    }
                });
            }
            else{
                parent.prepend('<div class="image image-float"/>');
                parent.children(".image").append(img);
                parent.children(".title").addClass("title-float");
            }
        });

    }


});
