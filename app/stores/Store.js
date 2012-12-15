GP.Store = GP.Class.extend({
    includes: [GP.Mixin.Events],
    model: undefined,
    _data: undefined,
    _dataArr: undefined, // for ordering
    _ready: undefined,
    _object: undefined,
    initialize: function(object) {
        this._clear();
        this._object = object;
        if (typeof this.model == 'undefined')
            throw "Model of store is undefined!";
        GP.events.on("fire event",this._getFireEvent,this);
        this._load();
    },

    reload: function() {
        this._clear();
        this._load();
    },

    reloadObj: function(newObj) {
        this._clear();
        this._object = newObj;
        this._load();
    },

    _clear: function() {
        this._ready = false;
        this._data = {};
        this._dataArr = [];
    },

    _load: function() {
        if (typeof(this._object) === "string") {
            this._loadURL(this._object);
        }
        else if (typeof(this._object) === "object")
        {
            this.loadObject(this._object);
            this.setReady();
        }
    },

    _loadURL: function(url) {
        if (typeof url == 'undefined')
            throw "Url for data loading is undefined!";
        var thisStore = this;
        jsonGET(url, {}, M.Util.bind(function(data){
            this.loadObject(data);
            this.setReady();
        }, this));
    },

    isReady: function() {
        return this._ready;
    },
    setReady: function() {
        this._ready = true;
        this.fire("ready", { store: this });
    },

    getById: function(id) {
        if (!this.isReady())
            throw "Trying to get model of not ready store!";
        return this._data[id];
    },

    setById: function(id,newObject){
        this._data[id] = newObject;
        this.fire("object update",{objectId:id});
    },

    getFirst: function() {
        return this._dataArr[0];
    },

    add: function(modelObj, noFireEvent) {
        var noFireEvent = noFireEvent || false; // we do not fire 'insert' event, when store loads firstly, for example
        var id =  modelObj.id();
        this._data[id] = modelObj;
        this._dataArr.push(modelObj);
        if (!noFireEvent)
            this.fire('insert', {model: modelObj});
    },

    addObj: function(object, noFireEvent) {
        this.add(new this.model(object), noFireEvent);
    },

    each: function(callback, ctx) {
        for (var i=0; i<this._dataArr.length; i++){
            callback.call(ctx, this._dataArr[i]); // arg - model object too
        }
    },

    loadObject: function(object) {
        if (object){
            if (object instanceof Array) {
                var items = object;
                for (var i=0,l=items.length;i<l;i++) {
                    this.addObj(items[i], true);
                }
            } else if (object instanceof Object) {
                this.addObj(object, true);
            }
        }
    },

    length: function() {
        return this._dataArr.length;
    },

    onReady: function(callback, ctx) {
        if (this.isReady())
            callback.call(ctx);
        if (!this.has("ready", callback))
            this.on("ready",callback, ctx);
    },

    // callback is executed only once after store is created
    onReadyOnce: function(callback, ctx) {
        //TODO:!!!
    },

    remove: function(id) {
        var deleteModel = this._data[id];
        if (!deleteModel) return;
        for (var i in this._dataArr)
        {
            if ((this._dataArr[i]).id() == id)
                this._dataArr.splice(i, 1);

        }
        delete this._data[id];
        deleteModel.fire('delete');
    },

    // returns in new store, models that responds specified value.
    where: function(field, value) {
        var resultStore = new this.constructor();
        this.onReady(function() {
            this.each(function(model){
                if (model.get(field) == value)
                    resultStore.add(model, true);
            },this);
            resultStore.setReady();
        }, this);

        return resultStore;
    },

    // resturns SINGLE model in store which field equals given value
    find: function(field, value) {
        if (!this.isReady())
            throw "Trying to find model in not ready store";
        var result;
        this.each(function(model){
            if (model.get(field) == value)
                result = model;
        },this);
        return result;
    },


    sort: function(field, descending) {
        var descending = descending || false;
        var compare = function(a,b) {
            var result = 0;
            if (a.get(field) < b.get(field))
                result = -1;
            if (a.get(field) > b.get(field))
                result = 1;
            if (descending)
                result *= -1;
            return result;
        }
        this._dataArr.sort(compare);
        return this;
    },

    // returns an array contains all models ids
    getIdsArray: function() {
        var arr=[];
        for (var i in this._dataArr)
            arr.push(this._dataArr[i].id());
        return arr;
    },

    _getFireEvent: function(data){

    }
});