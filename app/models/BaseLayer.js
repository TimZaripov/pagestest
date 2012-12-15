GP.Model.BaseLayer = GP.Model.extend({
    fields: [
        {name: "id", type: "integer", dvalue: 0, notNull: true, rusName: "Id"},
        {name: "name", type: "string", dvalue: "", notNull:true, rusName: "Название"},
        {name: "className", type: "function", dvalue: "", notNull:true, rusName: "Класс"},
        {name: "type", type: "string", dvalue: "", notNull:true, rusName: "Тип"},
        {name: "turnOn", type: "boolean", dvalue: false, notNull:true, rusName: "Включен"}
    ]
});



