GP.Model.LayerGroup = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "order", type: "integer", dvalue: 1, notNull:true, rusName: "Порядковый номер"}
    ]
});

