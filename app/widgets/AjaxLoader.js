GP.Widget.AjaxLoader = GP.Widget.extend({
    /*options: {
        divId
    }*/
    _loader: undefined,
    _createWidget: function() {
        this._loader = undefined;
        if (this.options == undefined || this.options.divId == undefined || !$("#"+this.options.divId).length)
            throw new Error('Create AjaxLoader error. divId params undefined.');

        this._loader = $("#"+this.options.divId);
    },
    show: function(){
        this._loader.html('');
        this._show();
    },
    showLoader: function(){
        this._loader.html('<img src="' + GP.imagesPath + '/loader.gif"/>');
        this._show();
    },
    close: function(){
        this._loader.css('width','0');
        this._loader.css('height','0');
        this._loader.css('display','none');
        this._loader.css('opacity','0');
        this._loader.html('');
    },
    _show: function(){
        this._loader.css('width','100%');
        this._loader.css('height','100%');
        this._loader.css('display','block');
        this._loader.css('opacity','0.7');
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "start load application":
                    this.showLoader();
                    break;
                case "start reload application":
                    this.showLoader();
                    break;
                case "wmsLayersClicked":
                    this.showLoader();
                    break;
                case "start geosearch":
                    this.showLoader();
                    break;
                case "create features widget":
                    this.close();
                    break;
                case "end create application":
                    this.close();
                    break;
                case "finish geosearch":
                    this.close();
                    break;
            }
        }
    }


});
