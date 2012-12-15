GP.Model.Eis = GP.Model.extend({
    fields: [
        {name: "id", type: "string", dvalue: "", notNull: true, rusName: "Первичный ключ"},
        {name: "url", type: "string", dvalue: "", notNull:true, rusName: "Url"},
        {name: "fileName", type: "string", dvalue: "", notNull:true, rusName: "Имя файла"} ,
        {name: "type", type: "object", dvalue: "", notNull:true, rusName: "тип"}
    ]
});


