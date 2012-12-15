GP.Widget.Authentication = GP.Widget.extend({
    /*options: {
     divId
     }*/
    _createWidget: function() {
        this._authElement = undefined;
        dustRender("authentication", {path:GP.imagesPath}, this._dustRendered, this);
    },

    _dustRendered: function(out){
        this._mainElement.append(out);
        this._authElement = this._mainElement.children("#authentication-div");
        this._bind(this._authElement.find("#enterButton"),"click",{},GP.Util.bind(this._sendForm,this));
        this._bind(this._authElement.find("#resetButton"),"click",{},GP.Util.bind(this.hide,this));
        this._bind(this._authElement.find("input[name='login']"),"keypress",{},GP.Util.bind(this._keyPresses,this));
        this._bind(this._authElement.find("input[name='password']"),"keypress",{},GP.Util.bind(this._keyPresses,this));

    },

    show: function(){
        if(this._authElement != undefined)
            this._authElement.slideDown();
    },

    hide: function(){
        if(this._authElement != undefined)
            this._authElement.slideUp();

    },

    remove: function(){
        this._authElement.remove();
    },

    _keyPresses: function(e){
        if(e.keyCode == 13) {
            this._sendForm();
        }
    },

    _sendForm: function(){
        var login = this._authElement.find("input[name='login']").val(),
            password = this._authElement.find("input[name='password']").val();
        if(login == "" || password == "")
            return;
        GP.widgets.ajaxLoader.showLoader();
        var options = {
            url: '/auth',
            type: "POST",
            dataType: "json",
            success: GP.Util.bind(function(data){
                GP.widgets.ajaxLoader.close();
                if(data == undefined || data.user == null)
                    return;
                this.hide();
                GP.events.addEvent("authentication success",{user:data.user});
            },this),
            error: function(jqXHR, textStatus, errorThrown){
                GP.widgets.ajaxLoader.close();
                alert(jqXHR.responseText);
            }
        };
        this._authElement.find("#authenticationForm").ajaxSubmit(options);
    }

});
