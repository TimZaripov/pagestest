GP.Widget.GeoSearchFeaturesBox = GP.Widget.FeaturesBox.extend({
    _featureClick: function(event){
        var me = event.data.me,
            id = $(this).attr("id");
        var feature = GP.stores.features.getById(id);
        if(feature != null){
            var object = feature.get("data"),
                html = '<p>' + object.label + '</p>',
                lon = object.point.lon, lat = object.point.lat,
                zoom = object.zoom;
            GP.mainMap.setPoint(lon,lat,zoom,html);
        }

    }



});

