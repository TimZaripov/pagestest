GP.Model.Layer = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "enabled", type: "boolean", dvalue: false, notNull:true, rusName: "Включен ли"},
        {name: "info", type: "object", dvalue: {}, notNull:true, rusName: "Информация о слое"},
        {name: "groupId", type: "integer", dvalue: 0, notNull:true, rusName: "Id группы"},
        {name: "order", type: "integer", dvalue: 1, notNull:true, rusName: "Порядковый номер в группе"},
        {name: "fields", type: "object", dvalue: [], notNull:true, rusName: "Атрибуты"},
        {name: "mapLayer", type: "object", dvalue: null, notNull:false, rusName: "Объект слоя"}
    ],

    _titleFields: undefined,

    getTitleFields: function() {
        if (!this._titleFields) {
            this._titleFields = [];
            var fields = this._values["fields"];
            if (fields && fields.length) {
                for (var i=0,length=fields.length;i<length;i++) {
                    if (fields[i] && fields[i].title && fields[i].title == true) {
                        this._titleFields.push(fields[i]);
                    }
                }
            }
        }
        return this._titleFields;
    },

    featureTitle: function(properties) {
        var titleFields = this.getTitleFields(),
            html = '',title;
        for (var i=0;i<titleFields.length;i++) {
            if (properties[titleFields[i].name]) {
                title = properties[titleFields[i].name];
                if(title != undefined && title != "")
                    html+=properties[titleFields[i].name]+"<br/ >";
            }
        }
        if (html=='') html='Нет названия';
        return html;
    },

    featureData: function(properties){
        var fields = this._values["fields"],
            html = '';
        if (fields && fields.length) {
            for (var i=0,length=fields.length;i<length;i++) {
                if (fields[i] && !fields[i].title && properties[fields[i].name] != null) {
                    html += "<p><b>"+fields[i].nameRu + ":</b> " + properties[fields[i].name]+"</p>";
                }
            }
        }
        else{
            for(var key in properties){
                if(properties[key] != null){
                    if(properties[key] != "" && key != 'fid' && key != 'geom' && key != 'the_geom')
                        html += "<p><b>"+key + ":</b>" + properties[key]+"</p>";
                }
            }

        }
        return html;
    }
});
