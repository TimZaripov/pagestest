GP.Widget.Reports = GP.Widget.Action.extend({

    _createWidget: function() {
        GP.Widget.Action.prototype._createWidget.call(this);
        this._mainElement.append('<div class="element"><div><img title="Отчеты" alt="" src="' + GP.imagesPath + '/icons/report.png"></div></div>');

    }
});
