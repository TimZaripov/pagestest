GP.Widget.Action = GP.Widget.extend({
    _createWidget: function() {
        this._mainElement = $("#wrap").find(".action-elements");
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "hand click":
                    this._disableElement();
                    break;
            }
        }
    },
    _disableElement: function(){
    }

});
