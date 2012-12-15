GP.Widget.BaseLayerSelector = GP.Widget.extend({
    /*options: {
     divId
     }*/
    _createWidget: function() {
        if (GP.stores.baseLayers != undefined){
             var len = GP.stores.baseLayers.length(),
             resultObject = {
                path: GP.imagesPath,
                schemaCurrent: '',
                spaceCurrent: '',
                schemas: new Array(),
                spaces: new Array()
             };
             if(len > 0){
                GP.stores.baseLayers.each(function(baseLayer){
                    var type = baseLayer.get("type"),
                        object = {
                            id: baseLayer.get("id"),
                            name: baseLayer.get("name")
                        };
                    if(type == "schema"){
                        resultObject.hasSchema = true;
                        if(resultObject.schemaId == undefined){
                            resultObject.schemaCurrent = "current";
                            resultObject.schemaId = object.id;
                            resultObject.schemaName = object.name;
                        } else{
                            resultObject.schemas.push(object);
                            resultObject.schemaArrow = true;
                        }
                    }else{
                        resultObject.hasSpace = true;
                        if(resultObject.spaceId == undefined){
                            resultObject.spaceId = object.id;
                            resultObject.spaceName = object.name;
                        } else{
                            resultObject.spaceArrow = true;
                            resultObject.spaces.push(object);
                        }
                    }
                },this);
             }
             if(resultObject.schemaCurrent == "" && resultObject.hasSpace)
                resultObject.spaceCurrent ==  "current";
             dustRender("baseLayerSelector", resultObject, this._dustRendered, this);
        }
    },

    _dustRendered: function(out){
        this._mainElement.html(out);
        this._setWidth();
        $(document).click(GP.Util.bind(function(e) {
            if($(e.target) != undefined && $(e.target).attr("id") != "schemaSelector" && $(e.target).attr("id") != "spaceSelector" &&
                $(e.target).attr("id") != "schemaArrow" && $(e.target).attr("id") != "spaceArrow"){
                this._mainElement.children("#schemaSelector").hide();
                this._mainElement.children("#spaceSelector").hide();
            }
        },this));
        this._bind(this._mainElement.children("span[class~='selector']"),"click",{context:this},this._selectorSpanClick);
        this._bind(this._mainElement.children("#schemaArrow"),"click",{context:this},this._schemaArrowClick);
        this._bind(this._mainElement.children("#spaceArrow"),"click",{context:this},this._spaceArrowClick);

        this._bind(this._mainElement.children("#schemaSelector").children("div"),"click",{context:this},this._schemaSelectorClick);
        this._bind(this._mainElement.children("#spaceSelector").children("div"),"click",{context:this},this._spaceSelectorClick);

    },
    _setWidth: function(){
        var width = this._mainElement.width() - 8;
        this._mainElement.children("#schemaSelector").width(width);
        this._mainElement.children("#spaceSelector").width(width);
    },
    _selectorSpanClick: function(event){
        var context = event.data.context;
        if(!$(this).hasClass("current")){
            context._mainElement.children("span[class~='selector']").removeClass("current");
            $(this).addClass("current");
            context._changeBaseLayer($(this).attr("id"));
        }


    },
    _schemaArrowClick: function(event){
        var context = event.data.context;
        if(context._mainElement.children("#schemaSelector").length){
            context._mainElement.children("#spaceSelector").hide();
            context._mainElement.children("#schemaSelector").show();
        }
    },
    _spaceArrowClick: function(event){
        var context = event.data.context;
        if(context._mainElement.children("#spaceSelector").length){
            context._mainElement.children("#schemaSelector").hide();
            context._mainElement.children("#spaceSelector").show();
        }
    },

    _changeBaseLayer: function(id){
        var baseLayer = GP.stores.baseLayers.getById(id);
        if(baseLayer != undefined){
            GP.mainMap.setBaseLayer(baseLayer.get("className"));
        }

    },
    _schemaSelectorClick: function(event){
        var me = event.data.context, span = me._mainElement.children("span[class~='schema']"),
            id = $(this).attr("id"), currentId = span.attr("id"), currentText = span.text();
        me._mainElement.children("span[class~='selector']").removeClass("current");
        span.attr("id",id);
        span.text($(this).text());
        span.addClass("current");
        $(this).attr("id",currentId);
        $(this).text(currentText);
        me._setWidth();
        me._changeBaseLayer(id);
    },
    _spaceSelectorClick: function(event){
        var me = event.data.context, span = me._mainElement.children("span[class~='space']"),
            id = $(this).attr("id");
        me._mainElement.children("span[class~='selector']").removeClass("current");
        span.attr("id",id);
        span.text($(this).text());
        span.addClass("current");
        this._setWidth();
        me._changeBaseLayer(id);
    }


});
