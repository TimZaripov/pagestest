GP.Widget.WMSFeaturesBox = GP.Widget.FeaturesBox.extend({
    _dustRender: function(out){
        GP.Widget.FeaturesBox.prototype._dustRender.call(this,out);
        var firstFeature = GP.stores.features.getById(this.options.firstElementId);
        if(firstFeature.get("eisStore") != null){
            this._showEis(firstFeature.get("eisStore"),this.options.firstElementId);
        }else{
            GP.stores.features.on("object update",function(){
                var eis =  firstFeature.get("eisStore");
                if(eis != null)
                    this._showEis(eis,this.options.firstElementId);
            },this);

        }

    },

    _showEis: function(eisStore,fValue){
        var files = [],
            photos = [],
            object,
            container = this._featureBlock.children("#features-container").find("#"+fValue).parent("div"),
            arr = fValue.split("_"),
            fid = fValue;

        if(arr.length > 1)
            fid = arr[arr.length-1];

        eisStore.each(function(elem){
            object = {
                url: elem.get("url"),
                fileName: elem.get("fileName") != "" ? elem.get("fileName") : "нет названия"
            }
            if(elem && elem.get("type").name == "photo")
                photos.push(object);
            else
                files.push(object);
        },this);
        if(photos.length > 0 ){
            container.children(".feature-content").prepend('<div class="feature-eis-photos"/>');
            for(var key in photos){
                container.find(".feature-eis-photos").append('<a class="fancybox-thumbs" data-fancybox-group="thumb" href="'+photos[key].url+'/600?'+fid+'.png">' +
                                                                 '<img src="'+photos[key].url+'/100?'+fid+'.png" alt=""/></a>');
            }
        }
        if(files.length > 0 ){
            container.children(".feature-content").append('<div class="feature-eis-files"/>');
            for(var key in files){
                container.find(".feature-eis-files").append('<div class="item"><a href="'+files[key].url+'" target="_blank">'+files[key].fileName+'</a></div>');
            }
        }
        $('.fancybox-thumbs').fancybox({
            prevEffect : 'none',
            nextEffect : 'none',
            closeBtn  : true,
            arrows    : false,
            nextClick : true,
            overlayShow: true,
            helpers : {
                thumbs : {
                    width  : 50,
                    height : 50
                }
            }
        });
    },

    _featureClick: function(event){
        var me = event.data.me,
            id = $(this).attr("id");
        if($(this).next("div").css("display") == "none"){
            me._featureBlock.children("#features-container").find(".feature-content").hide();
            me._featureBlock.children("#features-container").find(".feature-item").removeClass("features-shown");
            $(this).next("div[class='feature-content']").show("fast");
            $(this).parent(".feature-item").addClass("features-shown");
            var feature = GP.stores.features.getById(id),
                layerId = feature.get("groupData").layerId,
                layer = GP.stores.layers.getById(layerId);

            if(layer.get("info").eisInfo && layer.get("info").eisInfo.hasEis && feature.get("eisStore") == null){
                me._getEis(layerId,id);
            }
        }
        else{
            $(this).next("div[class='feature-content']").hide("fast");
            $(this).parent(".feature-item").removeClass("features-shown");
        }
    },

    _getEis: function(layerId,pkValue){
        var arr = pkValue.split("_"),
            fid = pkValue;
        if(arr.length > 1)
            fid = arr[arr.length-1];

        jsonGET("http://geoportal.prochar.ru/layers/eis/"+layerId+"/"+fid,{},GP.Util.bind(function(data){
            if(data && data.files && data.files.length){
                var feature = GP.stores.features.getById(pkValue);
                feature.set("eisStore",new GP.Store.Eis(data.files));
                GP.stores.features.setById(this._pkValue,feature);
                this._showEis(feature.get("eisStore"),pkValue);
            }
        },this));
    },

    _close: function(){
        this._featureBlock.remove("");
        GP.events.addEvent("close wmsfeatures block",{});
    },

    reload: function(template,dustObject,firstElementId){
        this.options.firstElementId = firstElementId;
        this.options.template = template;
        dustRender(template,dustObject,this._dustRender,this);
    }

});

