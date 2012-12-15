GP.Widget.ZoomControl = GP.Widget.extend({
   _mainElement:undefined,
    _slider:undefined,
    _offsetButtons:undefined,
    OFFSET_VALUE: 400,

    options:{

    },
    initialize:function (options,mainElement) {
        GP.Widget.prototype.initialize.call(this, options,mainElement);
        if(GP.mainMap == undefined || GP.mainMap.map == undefined)
            throw("Объект карты еще не создан.");
        this.draw();
    },
    draw:function () {
        var map = GP.mainMap.map;
        if(map == undefined)
            return;
        this._mainElement.append('<div class="hand-control"></div>');
        this._offsetButtons = $('<div class="offset-control arrow-top"></div>' +
                                '<div class="offset-control arrow-right"></div>' +
                                '<div class="offset-control arrow-bottom"></div>' +
                                '<div class="offset-control arrow-left"></div>' +
                                '<div class="hand"></div>').appendTo(this._mainElement.find(".hand-control"));

        this._mainElement.append('<div class="zoom-in"></div>');
        this._slider = $('<div class="slider"></div>').appendTo(this._mainElement);
        this._mainElement.append('<div class="zoom-out"></div>');
        var self = this;
        this._bind(this._mainElement.find('.offset-control'),"click",{},function() {
            var offsetPoint;
            if ($(this).hasClass('arrow-top'))
                offsetPoint = new M.Point(0, -1*self.OFFSET_VALUE);
            if ($(this).hasClass('arrow-right'))
                offsetPoint = new M.Point(self.OFFSET_VALUE,0);
            if ($(this).hasClass('arrow-bottom'))
                offsetPoint = new M.Point(0, self.OFFSET_VALUE);
            if ($(this).hasClass('arrow-left'))
                offsetPoint = new M.Point(-1*self.OFFSET_VALUE,0);
            map.panBy(offsetPoint);
        });
        this._bind(this._mainElement.find('.hand'),"click",{},function(){
            GP.events.addEvent("hand click",{});
        });

        this._slider.slider({
            orientation:"vertical",
            min:0,
            max:17,
            value:map.zoom(),
            change:function (event, ui) {
                map.setZoom(ui.value);
            }
        });
        this._bind(this._mainElement.find(".zoom-in"),"click",{},M.Util.bind(function () {
            if (map.zoom() < 17) {
                map.zoomIn();
            }
        }, this));
        this._bind(this._mainElement.find(".zoom-out"),"click",{},M.Util.bind(function () {
            if (map.zoom() > 0) {
                map.zoomOut();
            }
        }, this));

        map.on('zoomend', function () {
            this._slider.slider("value", map.zoom());
        }, this);
    }
});