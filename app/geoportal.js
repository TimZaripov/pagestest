GeoPortal = {
    version : '0.1',
    imagesPath: "http://geoportal.prochar.ru/public/images",
    wfsDoubleSize: false
};

GP = GeoPortal;

GP.apply = function(o, c, defaults){
    if(defaults){
        GP.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};
GP.Application = M.Class.extend({
    includes: M.Mixin.Events,
    initialize: function() {
        $(window).resize($.debounce(500, M.Util.bind(function() {
            this.fire('window.resized');
        },this)));
    }
});
GP.Events = M.Class.extend({
    includes: M.Mixin.Events,
    initialize: function() {

    },
    addEvent: function(eventName,object){
        this.fire("fire event",{eventName: eventName, object: object});
    }
});
(function(){
    GP.apply(GP, {
        namespace : function(){
            var v, o, d;
            for (var k=0,l=arguments.length;k<l;k++){
                v = arguments[k];
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                var elements = d.slice(1);
                for (var element in elements){
                    var v2 = elements[element];
                    o = o[v2] = o[v2] || {};
                }
            }
            return o;
        },
        register: function(xtype, widget) {
            if (!GP.Widget) GP.namespace("GP.Widget");
            if (!GP.Widget.XTypes) GP.namespace("GP.Widget.XTypes");
            GP.Widget.XTypes[xtype] = widget;
        },
        xwidget: function(xtype) {
            return GP.Widget.XTypes[xtype];
        },
        wordwrap: function( str, width, brk, cut ) {
            brk = brk || '\n';
            width = width || 75;
            cut = cut || false;

            if (!str) {return str;}

            var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

            return str.match( RegExp(regex, 'g') ).join( brk );

        },
        subString: function(str, width, brk){
            var resultString = str;
            if(str.length > width){
                resultString = str.substr(0,width-brk.length) + brk;
            }
            return resultString;

        },
        _inputHelperOut: function(obj, text){
            if ( obj.value == '' || obj.value == text ) {
                $(obj).val ( text );
            }
        },
        inputHelperCreate: function(obj, text){
            $(obj)
                .bind ('focus', function () {
                $(obj).val('');
            } )
                .bind ('blur',{context: this},function (event) {
                var context = event.data.context;
                context._inputHelperOut(this,text);
            } );

            //первоначальный инит
            this._inputHelperOut(obj, text);
        },
        getScrollTop: function(){
            return $(window).scrollTop();
        },
        initialize: function(){
            GP.widgets.ajaxLoader = new GP.Widget.AjaxLoader({divId: "dark-back"});
            GP.controllers.application = new GP.Controller.Application();
            $("#layers-tabs").tabs();
            $("#groups-accordion").accordion();
            $(document).click(function(e) {
                /*if($(e.target) != undefined && GP.widgets.authentication != undefined
                    && $(e.target).attr("id") != "authentication-div" && $(e.target).attr("id") != "enter-button"){
                    console.log($(e.target));
                    GP.widgets.authentication.hide();
                } */
            });

        }
    });

    Object.keys = Object.keys || function(o) {
        var result = [];
        for(var name in o) {
            if (o.hasOwnProperty(name))
                result.push(name);
        }
        return result;
    };
})();
GP.namespace("GP.controllers","GP.stores","GP.models","GP.widgets");
GP.application = new GP.Application();
GP.events = new GP.Events();
