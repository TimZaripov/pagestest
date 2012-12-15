GP.Widget.Button = GP.Widget.extend({
    /*options: {
        buttonElem
        buttonId
    }*/
    _createWidget: function() {
        this._button = undefined;
        if (this.options == undefined || ((this.options.buttonElem == undefined || !this.options.buttonElem instanceof Object) &&
            (this.options.buttonId == undefined || !$("#" + this.options.buttonId).length)))
            throw ('Error: Button widget create. buttonId option not found or button element not exist.');
        if (this.options.buttonElem != undefined)
            this._button = this.options.buttonElem;
        else
            this._button = $("#"+this.options.buttonId);

        this._bind(this._button,'click',{},GP.Util.bind(this._buttonClick,this));
    },

    _buttonClick: function(){
        this.fire("buttonClick", {button: this});
    },

    display: function(bool){
        if (bool)
            this._button.css('display','block');
        else
            this._button.css('display','none');
    }



});