GP.Widget.Distance = GP.Widget.Action.extend({
    mainOptions: {
        popups: false
    },

    _createWidget: function() {
        GP.Widget.Action.prototype._createWidget.call(this);
        this._mainElement.append('<div class="element"><div><img title="Измерить расстояние" alt="" src="' + GP.imagesPath + '/icons/distance.png"></div></div>');
        this._element = this._mainElement.children(".element:last");
        if(this.options.first)
            this._element.addClass("element-first");
        this._bind(this._element,"click",{},GP.Util.bind(this._activateControl,this));

        this._line = new M.Polyline([], {editable: true});
        this._line.on('edit', this._update, this);
        this._line.on('click', function(e) {});
        this._active = false;
        this._distanceBox = undefined;
        this._map = GP.mainMap.map;

        this._map.addLayer(this._line);
        this._calc_disable();
    },
    _activateControl: function(){
        if (this._active){
            this._disableElement();
        }
        else{
            this._element.children("div").addClass("current");
            if(this._distanceBox == undefined){
                this._distanceBox = new GP.Widget.DialogBox({dialogBoxId:"distanceBox",width:110,top:87,left:106},"#wrap");
                this._distanceBox.on("closeDialog",this._disableElement,this);
                this._distanceBox.setTitle("Расстояние");
                this._distanceBox.setContainer('<div class="control-distance"><div class="control-distance-km">0 m</div></div>');
                this._distanceBox.show();
            }
            this._calc_enable();
            GP.events.addEvent("distance control enable",{});
        }
    },

    _disableElement: function(){
        this._element.children("div").removeClass("current");
        if(this._distanceBox != undefined){
            this._distanceBox.remove();
            this._distanceBox = undefined;
            this._reset();
        }
        this._calc_disable();
        GP.events.addEvent("distance control disable",{});
    },

    getLine: function() { return this._line; },

    _calc_enable: function() {
        this._map.on('click', this._add_point, this);

        this._map.container().style.cursor = 'crosshair';
        this._map.addLayer(this._line);
        this._active = true;
        this._line.editing.enable();
        if (!this._map.hasLayer(this._line))
            this._map.addLayer(this._line);
        this._update();
    },

    _calc_disable: function() {
        this._map.off('click', this._add_point, this);
        this._map.removeLayer(this._line);
        this._map.container().style.cursor = 'default';
        this._active = false;
        this._line.editing.disable();
    },

    _reset: function(){
        this._line.setLatLngs([]);
        this._line.editing.updateMarkers();
    },

    _add_point: function (e) {
        var len = this._line.latLngs().length;
        this._line.addLatLng(e.latlng);
        this._line.editing.updateMarkers();
        this._line.fire('edit', {});
    },
    _update: function(e) {
        var text = this._d2txt(this._distance_calc());
        if(this._distanceBox != undefined)
            this._distanceBox.container.find(".control-distance-km").text(text);
    },

    _d2txt: function(d) {
        if (d < 2000)
            return d.toFixed(0) + " m";
        else
            return (d/1000).toFixed(1) + " km";
    },

    _distance_calc: function(e) {
        var ll = this._line.latLngs();
        var d = 0, p = null;
        for (var i = 0; i < ll.length; i++) {
            if (i)
                d += p.distanceTo(ll[i]);
            if (this.mainOptions.popups) {
                var m = this._line.editing._markers[i];
                if (m) {
                    m.bindPopup(this._d2txt(d));
                    m.on('mouseover', m.openPopup, m);
                    m.on('mouseout', m.closePopup, m);
                }
            }
            p = ll[i];
        }
        return d;
    }


});
