GP.Widget.DialogBox = GP.Widget.extend({
    /*options: {
        dialogBoxId
    }*/
    _createWidget: function() {
        this._ready = false;
        if (this._mainElement == undefined)
            this._mainElement = $("body");

        this.dialogBox = undefined;
        this.title = undefined;
        this.container = undefined;
        if(this.options.dialogBoxId == undefined)
            this.options.dialogBoxId = "dialogBox";
        this._id = this.options.dialogBoxId;
        dustRender("dialogBox",{dialogBoxId:this.options.dialogBoxId},this._dustRender,this);
    },

    _dustRender: function(out){
        this._mainElement.append(out);
        this.dialogBox = this._mainElement.children("div[id='" + this._id + "']");
        this.dialogBox.css("display","none");
        this.dialogBox.draggable({handle : ".dialog-header"});
        if (this.options.width != undefined)
            this.width(this.options.width);
        if (this.options.top != undefined)
            this.top(this.options.top);
        if (this.options.left != undefined)
            this.left(this.options.left);

        var closeButton = $("#"+ this._id +">.dialog-header>.close");
        this._bind(closeButton,"click",{},GP.Util.bind(this.close,this));
        this.title = this.dialogBox.children(".dialog-header").children("h4");
        this.container = this.dialogBox.children(".container");
        if (this.options.height != undefined)
            this.height(this.options.height);
        this._ready = true;
        this.fire("readyDialog",{dialog:this});
    },
    close: function(){
        this.clear();
        this.dialogBox.css("display","none");
        this.fire("closeDialog",{dialog:this});
    },
    clear: function(){
        this.dialogBox.children(".dialog-header").children("h4").text('');
        this.dialogBox.children(".container").html('');
        this.title.css('display','');
    },
    isReady: function(){
        return this._ready;
    },
    show: function(){
        if (!this._ready)
            return;
        if (this.title.text() == '')
            this.title.css('display','none');
        this.dialogBox.css("display","");
    },
    isShow: function(){
        return this.dialogBox.css("display") == 'none' ? false : true;
    },
    setTitle: function(title){
        if (!this._ready)
            return;
        this.title.text(title);
    },
    setContainer: function(container){
        if (!this._ready)
            return;
        this.container.html(container);
    },

    width: function(dWidth){
        this.dialogBox.width(dWidth);
    },
    height: function(dHeight){
        this.container.height(dHeight);
    },
    top: function(dTop){
        this.dialogBox.css("top",dTop+"px");
    },
    left: function(dLeft){
        this.dialogBox.css("left",dLeft+"px");
    },
    remove: function(){
        this.dialogBox.remove();
    }



});