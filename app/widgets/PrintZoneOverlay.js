GP.Widget.PrintZoneOverlay =  GP.Class.extend({
    includes: GP.Mixin.Events,

    options: {
        areaX: 600,
        areaY: 600
    },

    _windowX: undefined,
    _windowY: undefined,
    _placeholder: undefined,

    initialize: function(options) {
        GP.Util.setOptions(this,options);
        this._placeholder = $('.printzone-overlays');
        this._setOverlaysSize();
        GP.application.on('window.resized', this._setOverlaysSize, this);
    },

    _setOverlaysSize: function() {
        this._windowX = $(window).width();
        this._windowY = $(window).height()-37;

        this._placeholder.find('.pz-over-w').css({
            width:  0,
            height: 0
        });
        this._placeholder.find('.pz-over-h').css({
            height: 0,
            width: 0
        });

        if (this._windowX <= this.options.areaX && this._windowY <= this.options.areaY)
            return;

        if (this._windowX <= this.options.areaX )
        {
            this._placeholder.find('.pz-over-w').css({
                width:  this._windowX,
                height: (this._windowY - this.options.areaY)/2
            });
            return;
        }
        if (this._windowY <= this.options.areaY )
        {
            this._placeholder.find('.pz-over-h').css({
                width:  (this._windowX - this.options.areaX)/2,
                height: this._windowY
            });
            return;
        }

        this._placeholder.find('.pz-over-w').css({
            width:  (this._windowX + this.options.areaX)/2,
            height: (this._windowY - this.options.areaY)/2
        });
        this._placeholder.find('.pz-over-h').css({
            height: (this._windowY + this.options.areaY)/2,
            width: (this._windowX - this.options.areaX)/2
        });
    },

    setVisible: function(visible) {
        if (visible)
            this._placeholder.show();
        else
            this._placeholder.hide();
    }
});