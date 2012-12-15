GP.Model.Tab = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "image", type: "string", dvalue: null, rusName: "Иконка"},
        {name: "imageWhite", type: "string", dvalue: null, usName: "Белая иконка"},
        {name: "divId", type: "string", dvalue: null, usName: "Id div"}
    ]
});

