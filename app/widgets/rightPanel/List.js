GP.Widget.List = GP.Widget.extend({
	statics:  {
		xtypes: {},
		register: function(name, klass) {
            GP.Widget.List.xtypes[name]=klass;
		}
	},	
	_createWidget: function(){
		this._currentAddElemId = -1;
        this._data = undefined;
        if(this.options == undefined || this.options.data == undefined)
            throw("Can't create List widget. Data parameter is undefined.");
        this._data = this.options.data;
        GP.Util.requestAnimFrame(this._createWidgetAnim,this,false,this);
	},
	
	_createWidgetAnim: function(){
	}
	/*_showFeatures: function(event){
		var features = event.data.features,
			photos = event.data.photos,
			videos = event.data.videos,
			mainTmpl,photoTmpl,videoTmpl,featureTmpl,ftpl,ptpl,vtpl,photoObject = new Array(),
			videoObject = new Array(), thisClass = this;
		$.get("templates/object_settings.tpl", function(templ) {
			mainTmpl = templ;
			$.get("templates/photo.tpl", function(templ) {
				photoTmpl = templ;
				$.get("templates/video.tpl", function(templ) {
					videoTmpl = templ;
					$.get("templates/features.tpl", function(templ) {
						featureTmpl = templ;
						if (RM.widgets.dialogBoxFeatures.initialized){	
							RM.widgets.dialogBoxFeatures.width(600);
							if (photos && photos != undefined && photos != null){
								photos = photos.array();
								if (photos.length > 0){
									for(var i=0;i<photos.length;i++)
										photoObject.push({photo: photos[i].file});
								}
							}
							if (videos && videos != undefined && videos != null){
								videos = videos.array();
								if (videos.length > 0){
									for(var i=0;i<videos.length;i++)
										videoObject.push({id: i,video: videos[i]});
								}
							}
							ftpl = $.tmpl(featureTmpl,features);
							RM.widgets.dialogBoxFeatures.show(mainTmpl,'Свойства объекта');
							RM.widgets.dialogBoxFeatures.appendTmpl('.features_container',ftpl);
							if (photoObject.length > 0){
								ptpl = $.tmpl(photoTmpl,photoObject);
								RM.widgets.dialogBoxFeatures.appendTmpl('.objects_container',ptpl);
								$("a[rel=example_group]").fancybox({
									'transitionIn' : 'none',
									'transitionOut' : 'none',
									'titlePosition' : 'over',
									'overlayShow': false,
									'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
										return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
									}
								});
								$("#fancybox-outer").draggable();
							}
							if (videoObject.length > 0){
								vtpl = $.tmpl(videoTmpl,videoObject);
								RM.widgets.dialogBoxFeatures.appendTmpl('.objects_container',vtpl);
								thisClass._live(".video_elem",'click',{'objects':videos},thisClass._showVideo);
							}
							if (photoObject.length == 0 && videoObject.length == 0)
								RM.widgets.dialogBoxFeatures.hideElem('.objects');
						}
					},"html");	
				},"html");
			},"html");
		},"html");
	}, */
	/*_showVideo: function(event){
		var videos = event.data.objects,
			id = $(this).attr("id"),
			videoObject = videos[id], file;
		if (videoObject && videoObject != undefined){
			file = videoObject.file;
			RM.widgets.dialogBoxVideo.left(500);
			RM.widgets.dialogBoxVideo.top(200);
			RM.widgets.dialogBoxVideo.show('<div id="mediaspace"></div>','Видео');
			var videoWidget = new RM.Widget.Video(null,"#mediaspace",{file:file,divName:'mediaspace'});
		}
		return;
	} */
});
GP.register("list", GP.Widget.List);