GP.Widget.Print = GP.Widget.Action.extend({

    _createWidget: function() {
        GP.Widget.Action.prototype._createWidget.call(this);
        this._mainElement.append('<div class="element" id="print"><div><img title="Печать карты" alt="" src="' + GP.imagesPath + '/icons/print.png"></div></div>');
        this._printButton = this._mainElement.children("#print");
        GP.widgets.printOverlay = new GP.Widget.PrintZoneOverlay({
            areaX: 790,
            areaY: 790
        });

        this._printButton.mouseenter(function() {
            GP.widgets.printOverlay.setVisible(true);
        });
        this._printButton.mouseleave(function() {
            GP.widgets.printOverlay.setVisible(false);
        });
        this._printButton.click(function() {
            $('#map').css({
                width: '790px',
                height: '790px'
            });
            GP.mainMap.map.invalidateSize();
            window.print();
            $('#map').css({
                width: '100%',
                height: '100%'
            });
            GP.mainMap.map.invalidateSize();
        });
    }
});

