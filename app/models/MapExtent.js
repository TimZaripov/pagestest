GP.Model.MapExtent = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "extent", type: "object", dvalue: null, notNull:true, rusName: "Граница"},
        {name: "projection", type: "string", dvalue: "", notNull:true, rusName: "Проекция"}
    ]
});
