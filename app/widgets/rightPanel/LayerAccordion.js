GP.Widget.LayerAccordion = GP.Widget.Accordion.extend({
    _createWidgetAnim: function(){
        if(this._data == undefined)
            return;
        var elementsLen = this._data.length,
            titleCount, cHeight, element, elemTitle, elemId, elemStore, DOMelem, DOMelemDiv;
        if (elementsLen > 0 && this._currentAddElemId < elementsLen) {
            this._accordionDiv.append('<div class="page_div page_1"/>');
            for(var i=this._currentAddElemId+1;i<elementsLen;i++){
                element = this._data[i];
                if (element != null){
                    var className = "";
                    if(this._hasPages){
                        if(i >= this._currentPage * GP.Widget.Accordion.COUNT_ELEMENTS_FOR_PAGE){
                            this._currentPage++;
                            this._accordionDiv.append('<div class="page_div page_'+this._currentPage+'" style="display:none;"/>');
                        }
                    }

                    GP.stores.layerGroups.addObj({id:element.id,name:element.name,order:element.order});
                    elemTitle = element.name;
                    elemId = element.id;
                    this._accordionDiv.children(".page_"+this._currentPage).append('<h3 id="' + elemId +'"><input type="checkbox" class="checkbox-group"/>' +
                                                                                    '<span class="title-group">' + GP.subString(elemTitle,32,'...') + '</span></h3>');
                    this._accordionDiv.children(".page_"+this._currentPage).append('<div class="content"></div>');
                    DOMelem = this._accordionDiv.children(".page_"+this._currentPage).children("h3:last");
                    DOMelemDiv = this._accordionDiv.children(".page_"+this._currentPage).children("div:last");

                    this._bind(DOMelem.children("input"),'click',{me:this},this._clickCheckBox);
                    GP.widgets["layersGroups" + elemId] = new GP.Widget.LayerList({data:{groupLayers: element.groupLayers,groupId:elemId}},DOMelemDiv);
                }
                this._currentAddElemId = i;
            }
            this._accordionDiv.children(".page_div").accordion({header:"h3"});
            setTimeout(GP.Util.bind(this._setHeight,this), 500);
            if (this._currentAddElemId < (elementsLen-1))
                GP.Util.requestAnimFrame(this._createWidgetAnim,this,false,this);

        }
    },
     _clickCheckBox: function(event){
         event.stopPropagation();
         var me = event.data.me,
             groupId = $(this).parent("h3").attr("id"), action = "";
         if($(this).hasClass("checked")){
             $(this).removeClass("checked");
             action = "off all";
         }
         else{
             $(this).addClass("checked");
             action = "turn all";
         }
         GP.events.addEvent("layer group input click",{action: action,groupId:groupId});


    }
});
GP.register("layersAccordion", GP.Widget.LayerAccordion);
