

		window.onLoad =  'dbconnect.php';

	/*	<?php include 'php/dbconnect.php';?>*/
       
       // var maplayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
        var maplayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', 
		{
			//maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			//id: 'mapbox.light'
			id: 'mapbox.street'
		//}).addTo(map);
		});

        var map = L.map('map', 
		{
			zoomControl:false,
			maxZoom: 2, minZoom: 2,
          	layers: [maplayer]
          	/*,//\, heatmapLayer]
        maxBounds: 
        [
        //south west
        [56, -65],
        //north east
        [78, 173]
        ]*/

		}).setView([10.0, 135.0], 2);

		map.dragging.disable();

		//control that shows state info on hover
		var info = L.control({position: 'topright'});

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
		this._div.innerHTML = '<h5>Number of Organizations</h5>' +  (props ?
				'<b>' + props.NAME + '</b><br />' + props.UN + ' Organizations'
				: 'Hover over a country');
		};

		info.addTo(map);

        //maplayer.setOpacity(0.0);
        maplayer.setOpacity(1.0);


       	var rlabel = function (props){
		var textLatLng = [props.LAT, props.LON];  
        var myTextLabel = L.marker(textLatLng, {
            icon: L.divIcon({
            	//iconUrl: 'white.png',
            	iconSize:     [130, 50],
            	iconAnchor:   [35, 75],
            	//popupAnchor:  [-3, -76],
                className: 'text-labels',   // Set class for CSS styling
                html: '<B>' + props.NAME + '</B></br>' + props.UN + " Organizations"
            }),
           // draggable: true,       // Allow label dragging...?
           zIndexOffset: 1000     // Make appear above other map features
            
        });
        return myTextLabel;
		}

		// get color depending on population density value
		//map colors are
		//large : D06650
		//medium: DEA64B
		//small: A0AE01
		function getColor(d) {
/*			return d > 600 ? '#d98472' :
				   d > 304 ? '#e4b76e' :
			                  '#bcc64d';*/
			return d > 600 ? '#ca6554' :
				   d > 304 ? '#d6877a' :
			                  '#e7bab3';
		}

		function style(feature) 
		{
			//console.log(feature);
			return {
				weight: 1,
				opacity: 1.0,
				color: '#2b3d51',
				dashArray: '',
				fillOpacity: 1.0,
				fillColor: getColor(feature.properties.UN)
			};
			//}
		}
		
		var textlayer;
		function highlightFeature(e) {
			//map.removeLayer(heatmapLayer);
			maplayer.bringToFront();
			var layer = e.target;
		info.update(layer.feature.properties);

			geojson.setStyle({
				weight: 1,
				opacity: 0.3,
				fillOpacity: 0.3
			});

			layer.setStyle({
				weight: 1,
				opacity: 1.0,
				color: '#2b3d51',
				dashArray: '',
				fillOpacity: 1.0,
				//fillColor: '#A0AE01'
				fillColor: '#375F79'
			});


			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			//textlayer = rlabel(layer.feature.properties);
			//layer.addLayer(textlayer);

			maplayer.setOpacity(0.2);
		}

		var geojson;

		function resetHighlight(e) {
			//To remove the Region name Layer 
			console.log("inside resetHighlight");
			var layer = e.target;
info.update();
/*			geojson.setStyle({
				weight: 1,
				opacity: 1.0,
				color: '#375F79',
				dashArray: '',
				fillOpacity: 0.0
			});*/

			//geojson.setStyle(style(layer.feature));
			geojson.resetStyle(e.target);

			geojson.setStyle({
				weight: 1,
				opacity: 1.0,
				fillOpacity: 1.0
//				fillColor: 'FEB24C'
			});

			//console.log(layer);
			
			
			maplayer.setOpacity(1.0);
			//geojson.resetStyle(layer);
			//layer.removeLayer(textlayer);
			//layer.removeLayer(textlayer);	
		}

/*		function clickPage(e) {
		window.open('northamerica.html','_parent');
			//map.fitBounds(e.target.getBounds());
		}*/
/*	 function clickFeature(e) {
   		 var layer = e.target;
   		 console.log('layer.getBounds()', layer.getBounds());
   		 map.fitBounds(layer.getBounds());
    //console.log(layer.feature.properties.name); //country info from geojson
  		}
*/

		function onEachFeature(feature, layer) {

			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight
				//click: clickFeature
			});
		}
		
		//console.log(regions.features.length);

		/*for (var i=0; i<regions.features.length; i++) {

			console.log('regions.features[i].properties.NAME',i + regions.features[i].properties.NAME);
  			if (regions.features[i].properties.NAME == "Russia") {
    		regions.features[i].properties.NAME = "Russsiiaaaaaaa";
   		 //break;
  			}
		}*/		

		geojson = L.geoJson(regions, {
			style: style,
			onEachFeature: onEachFeature,
		}).addTo(map);

		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 304, 600],
				labels = [],
				from, to;

			/* for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}*/

			//labels.push('<b>No. of Orgs</b>');

			labels.push(
			'<i style="background:' + '#e7bab3' + '"></i> ' +
			0 + '&ndash;' + 10);

			labels.push(
			'<i style="background:' + '#d6877a' + '"></i> ' +
			11 + '&ndash;' + 100);

			labels.push(
			'<i style="background:' + '#ca6554' + '"></i> ' +
			100 + '+');

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);