GP.Model.Feature = GP.Model.extend({
    fields: [
        {name: "id", type: "string", dvalue: "", notNull: true, rusName: "Первичный ключ"},
        {name: "title", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "data", type: "object", dvalue: "", notNull:true, rusName: "Данные"} ,
        {name: "groupData", type: "object", dvalue: "", notNull:true, rusName: "Данные о группе"},
        {name: "eisStore", type: "object", dvalue: null, notNull:true, rusName: "Store eis"}
    ]
});

