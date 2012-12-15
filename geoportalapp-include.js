(function() { 
		var scripts =[
    "app/geoportal.js",

    "app/utils.js",

    "app/core/Class.js",
    "app/core/Events.js",
    "app/core/Util.js",
    "app/core/Browser.js",

    "app/utils/HashMap.js",
    "app/utils/MapsurferIcon.js",

    "app/controllers/Controller.js",
    "app/controllers/Application.js",

    "app/models/Model.js",
    "app/models/BaseLayer.js",
    "app/models/User.js",
    "app/models/MapExtent.js",
    "app/models/LayerGroup.js",
    "app/models/Layer.js",
    "app/models/Tab.js",
    "app/models/Feature.js",
    "app/models/Eis.js",

    "app/stores/Store.js",
    "app/stores/BaseLayers.js",
    "app/stores/LayerGroups.js",
    "app/stores/Layers.js",
    "app/stores/Tabs.js",
    "app/stores/Features.js",
    "app/stores/Eis.js",

    "app/widgets/Widget.js",
    "app/widgets/map/Map.js",
    "app/widgets/UserPanel.js",
    "app/widgets/controls/ZoomControl.js",
    "app/widgets/controls/Action.js",
    "app/widgets/controls/Distance.js",
    "app/widgets/controls/LayerLegends.js",
    "app/widgets/controls/Reports.js",
    "app/widgets/controls/Print.js",
    "app/widgets/GeoSearch.js",
    "app/widgets/AjaxLoader.js",
    "app/widgets/DialogBox.js",
    "app/widgets/Button.js",
    "app/widgets/Authentication.js",
    "app/widgets/BaseLayerSelector.js",
    "app/widgets/rightPanel/Tabs.js",
    "app/widgets/rightPanel/Accordion.js",
    "app/widgets/rightPanel/LayerAccordion.js",
    "app/widgets/rightPanel/List.js",
    "app/widgets/rightPanel/LayerList.js",
    "app/widgets/futures/WMSFeatures.js",
    "app/widgets/futures/WFSFeatures.js",
    "app/widgets/futuresBox/FeaturesBox.js",
    "app/widgets/futuresBox/GeoSearchFeaturesBox.js",
    "app/widgets/futuresBox/WMSFeaturesBox.js",
    "app/widgets/PrintZoneOverlay.js"
];
		function getSrcUrl() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].src;
			if (src) {
				var res = src.match(/^(.*)geoportalapp-include\.js$/);
				if (res) {
					return res[1];
				}
			}
		}
	}
	
	var path = getSrcUrl();
	for (var i = 0; i < scripts.length; i++) {
		document.writeln("<script type='text/javascript' src='" + path + scripts[i] + "'></script>");
	}
	})();