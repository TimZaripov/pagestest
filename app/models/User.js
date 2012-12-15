GP.Model.User = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "right", type: "object", dvalue: null, rusName: "Права"},
        {name: "mapExtent", type: "object", dvalue: null, usName: "Граница карты"}
    ]
});
