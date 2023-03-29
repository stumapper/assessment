
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView.js";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";

import "./style.css";

/*****************************************************************
 * Create Layer instances. One for liveTransport
 * and one for streets pointing to a layer of roads and highways.
 *****************************************************************/

const transportationLayer = new TileLayer({
  url: "https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer",
  // This property can be used to uniquely identify the layer
  id: "streets",
  visible: false
});

/**********************************************
*    Create the liveTransport layer using FETCH
*
***********************************************/


const liveTransportLayerURL = "https://portal.spatial.nsw.gov.au/geoserver/liveTransport/buses/featureServer/0/query?=geojson";

/*
const blob = new Blob(getLTjson());
const dataurl = URL.createObjectURL(blob);

const liveTransportLayer = new GeoJSONLayer({
  url: dataurl,
  id:  "liveTransport",
  popupTemplate: template 
});

async function getLTjson() {
    try {
        let response = await fetch(liveTransportLayerURL);
        if (response.status === 200) {
            let data = await response.text();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}
*/


/*
*    Create the liveTransport layer as FEATURELAYER
*/

const template = new PopupTemplate({
  title: "Vehicle Information",
  content: [
    {
      type: "fields",
      fieldInfos: [        
        {
          fieldName: "hashId",
          label: "hashid"          
        }
      ]
    }
  ]  
});


const liveTransportLayer = new FeatureLayer({
  url: liveTransportLayerURL,
  id: "liveTransport",
  visible: false,
  outfields: ["*"],
  popupTemplate: template  
 });


/*****************************************************************
 * Construct a new map
 *****************************************************************/
const map = new Map({
  basemap: "oceans"   
});

/*****************************************************************
 * Add layers to the map using map.add()
 *****************************************************************/
map.add(transportationLayer);
map.add(liveTransportLayer);

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [151,-33.75],
  zoom: 8  
});

/*****************************************************************
 * The map handles the layers' data while the view and layer views
 * take care of renderering the layers
 *****************************************************************/
view.on("layerview-create", (event) => {
 
  if (event.layer.id === "streets") {
    // Explore the properties of the transportation layer's layer view here
    console.log("streets LayerView  created!", event.layerView);
  }
  if (event.layer.id === "liveTransport") {
    console.log("liveTransport LayerView  created!", event.layerView);
  }
});



/*****************************************************************
 * Layers are promises that resolve when loaded, or when all their
 * properties may be accessed. Once the LT layer has loaded,
 * the view generate a popuptemplate.
 *****************************************************************/

view.when(() => {
  liveTransportLayer.when(() => {
         
    //const autotemplate = liveTransportLayer.createPopupTemplate();
    //liveTransportLayer.popupTemplate = autotemplate;
    
  });
});


/*****************************************************************
 * The visible property on the layer can be used to toggle the
 * layer's visibility in the view. When the visibility is turned off
 * the layer is still part of the map, which means you can access
 * its properties and perform analysis even though it isn't visible.
 *******************************************************************/

const streetsLayerToggle = document.getElementById("streetsLayer");
const liveTransportLayerToggle = document.getElementById("liveTransportLayer");

streetsLayerToggle.addEventListener("change", () => {
  transportationLayer.visible = streetsLayerToggle.checked;
});

liveTransportLayerToggle.addEventListener("change", () => {
  liveTransportLayer.visible = liveTransportLayerToggle.checked;
});

