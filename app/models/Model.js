GP.Model = GP.Class.extend({
    includes: GP.Mixin.Events,
    statics: {},
    fields: [],
    filterLanguage: /^[\w-]+$/i,
    filterEncoding: /^[\w_-]+$/i,
    filterDate: /^([0-9]{0,1}[0-9])\.([0,1]{0,1}[0-9])\.([1,2][0,9][0-9][0-9])$/,
    initialize: function(object) {
        this._values = {};
        this._pkField = undefined;
        this._pkValue = undefined;
        if (this.fields &&
            this.fields instanceof Array && object) {
            for (var i=0,l=this.fields.length;i<l;i++) {
                var fieldName = this.fields[i].name,
                    fieldType = this.fields[i].type ? this.fields[i].type : "string",
                    fieldDValue = this.fields[i].dvalue != undefined ? this.fields[i].dvalue : undefined,
                    fieldValue = object[fieldName] != undefined ? object[fieldName] : fieldDValue,
                    fieldNullAble = this.fields[i].is_not_null ? this.fields[i].is_not_null : false,
                    fieldIsPrimary = (fieldName == 'id') || this._toBoolean(this.fields[i].primary);
                this._setValue(fieldName,fieldValue,fieldType);
                if (fieldIsPrimary) {
                    this._pkField = fieldName;
                    this._pkValue = this._values[fieldName];
                }
            }
        }
        GP.events.on("fire event",this._getFireEvent,this);
    },
    pkField: function(){
        return this._pkField;
    },

    id: function() {
        return this._pkValue;
    },

    _setValue: function(name, value, type) {
        switch (type) {
            case "integer":
                this._values[name] = parseInt(value);
                break;
            case "string":
                this._values[name] = value.toString();
                break;
            case "boolean":
                this._values[name] = (value == "true" || value == "t" || value == "1") ? true : false;
                break;
            case "function":
                this._values[name] = eval(value);
                break;
            default:
                this._values[name] = value;
                break;
        }
    },

    field: function(name) {
        return this.fields[name];
    },

    get: function(name) {
        return this._values[name];
    },

    set: function(name, value) {
        this._setValue(name,value);
    },

    _toBoolean: function(value) {
        return (value == "true" || value == "t" || value == "1") ? true : false;
    },

    isNull: function(name,type){
        var checkValue = this.get(name),
            result = false;
        if(type == "string")
            result = ($.trim(checkValue) == "" || checkValue == undefined) ? true : false;
        else if(type == "integer")
            result = (checkValue == 0 || checkValue == undefined) ? true : false;
        else if(type == "boolean"){
            if (checkValue != false && checkValue != true)
                result = true;
        }
        return result;
    },

    validateField: function() {
        var result = [] ,
            fields = this.fields;
        for (var i=0,l=fields.length;i<l;i++) {
            if (!fields[i].specific){
                if(this.isNull(fields[i].name,fields[i].type) && fields[i].notNull ){
                    result.push({name: fields[i].name, rusName: fields[i].rusName,  type : "empty", reg: ""});
                }
                else if(fields[i].reg != undefined &&  (fields[i].reg in this) && (!this[fields[i].reg].test(this.get(fields[i].name)))){
                    result.push( {name: fields[i].name, rusName: fields[i].rusName, type: "reg" , reg: fields[i].reg});
                }
                else if(fields[i].equal != undefined && this.get(fields[i].equal) != undefined && this.get(fields[i].name) != this.get(fields[i].equal)){
                    result.push( {name: fields[i].name, rusName: fields[i].rusName, type: "equal" , reg :"",  name2 : fields[i].equal} );
                }
            }

        }
        return result;
    },
    _getFireEvent: function(data){

    }

});