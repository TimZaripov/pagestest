GP.Widget.UserPanel = GP.Widget.extend({
    /*options: {
     }*/
    _createWidget: function() {
        this._authButton = undefined;
        this._exitButton = undefined;
    },

    reloadPanel: function(){
        this._mainElement.html('');
        this._authButton = undefined;
        this._exitButton = undefined;
        if(GP.models.currentUser == null){
            this._mainElement.append('<div class="exit-enter-block"><div class="button" id="enter-button">Вход</div></div>');
            this._authButton = new GP.Widget.Button({buttonElem:this._mainElement.find("#enter-button")});
            this._authButton.on("buttonClick",this._authForm,this);
            GP.widgets.authentication = new GP.Widget.Authentication({},"#wrap");
        }
        else{
            var currentUser = GP.models.currentUser;
            if(GP.widgets.authentication != undefined){
                GP.widgets.authentication.remove();
                delete GP.widgets.authentication;
            }
            this._mainElement.append('<div class="welcome">Здравствуйте, '+currentUser.get("name")+'</div>');
            this._mainElement.append('<div class="exit-enter-block"><div class="button" id="exit-button">Выход</div></div>');
            this._exitButton = new GP.Widget.Button({buttonElem:this._mainElement.find("#exit-button")});
            this._exitButton.on("buttonClick",this._exit,this);
        }
    },

    _exit: function(){
        GP.events.addEvent("logout",{});
    },

    _authForm: function(){
        if(GP.widgets.authentication != undefined && GP.models.currentUser == null)
            GP.widgets.authentication.show();
    },

    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "load user":
                    this.reloadPanel();
                    break;
                case "reload user":
                    this.reloadPanel();
                    break;
            }
        }
    }
});
