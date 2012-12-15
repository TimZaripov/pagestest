GP.Widget.Accordion = GP.Widget.extend({
	statics: {
		TITLE_HEIGHT: 25,
        COUNT_ELEMENTS_FOR_PAGE: 10,
        PAGES_MARGIN_BOTTOM: 9

	},
	_createWidget: function(){
		this._currentAddElemId = -1;
        this._currentPage = 1;
        this._hasPages = false;
        this._pages = undefined;
        this._data = undefined;
        this._accordionDiv = undefined;
        if(this.options == undefined || this.options.data == undefined || !(this.options.data instanceof Array) || this.options.accordionId == undefined)
            throw("Can't create Accordion widget. Data parameter is undefined or has not array structure, accordionId parameter is undefined");
        this._data = this.options.data;
        var elementsLen = this._data.length;
        if(elementsLen > GP.Widget.Accordion.COUNT_ELEMENTS_FOR_PAGE){
            this._hasPages = true;
            this._mainElement.append('<div class="pages"/>');
            var pagesDiv = this._mainElement.children(".pages");
            pagesDiv.append("<ul/>");
            this._pages = parseInt(elementsLen/GP.Widget.Accordion.COUNT_ELEMENTS_FOR_PAGE);
            if(elementsLen % GP.Widget.Accordion.COUNT_ELEMENTS_FOR_PAGE > 0)
                this._pages++;
            for(var i=1; i <= this._pages;i++){
                var className = "page";
                if(i == 1)
                    className = "page here";
                pagesDiv.children("ul").append('<li class="'+className+'">'+i+'</li>');
            }
            this._bind(pagesDiv.find("li"),"click",{context: this},this._pageClick);
        }
        this._mainElement.append('<div id="'+this.options.accordionId+'" class="accordion" />');
        var heightA = this._mainElement.height() - 2;
        if(this._hasPages )
            heightA = heightA - (this._mainElement.children(".pages").height() + GP.Widget.Accordion.PAGES_MARGIN_BOTTOM + 1);
        this._accordionDiv = this._mainElement.find("#" + this.options.accordionId);
        this._accordionDiv.height(heightA);
        GP.Util.requestAnimFrame(this._createWidgetAnim,this,false,this);
	},
	_createWidgetAnim: function(){
	},
	_setHeight: function(){
        var titleCount, cHeight;
		if(this._hasPages){
            for(var i=1; i <= this._pages;i++){
                titleCount = this._accordionDiv.children(".page_"+i).children("h3").length;
                if(titleCount > 0){
                    cHeight = this._accordionDiv.height() - titleCount*parseInt(GP.Widget.Accordion.TITLE_HEIGHT);
                    this._accordionDiv.children(".page_"+i).children("div").height(cHeight);
                }
            }

        } else{
            titleCount = this._accordionDiv.find("h3").length;
            cHeight = this._accordionDiv.height() - titleCount*parseInt(GP.Widget.Accordion.TITLE_HEIGHT);
            this._accordionDiv.find(".content").height(cHeight);
        }
	},
    _pageClick: function(event){
        var context = event.data.context,
            page = $(this).text();

        context._accordionDiv.children(".page_div").hide();
        context._accordionDiv.children(".page_"+page).show();
        context._mainElement.children(".pages").find("li").removeClass("here");
        $(this).addClass(("here"));
    },
    _getFireEvent: function(data){
        if(data != undefined && data.eventName != undefined){
            switch(data.eventName){
                case "tab resize":
                    var heightA = this._mainElement.height() - 2;
                    if(this._hasPages )
                        heightA = heightA - (this._mainElement.children(".pages").height() + GP.Widget.Accordion.PAGES_MARGIN_BOTTOM + 1);
                    this._accordionDiv.height(heightA);
                    this._setHeight();
                    break;
            }
        }
    }
});
GP.register("accordion", GP.Widget.Accordion);