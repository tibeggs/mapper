import '../scss/style.scss';
import * as bootstrap from 'bootstrap';
import {Map as olMap, View as olView} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Cluster} from 'ol/source.js';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen.js';
import XYZ from 'ol/source/XYZ.js';
import { transform ,fromLonLat, toLonLat} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape, Text as olText} from 'ol/style.js';
import {run} from './get_weather.js';
import {crags} from './coordinates';
import Overlay from 'ol/Overlay.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {get_current_periods} from "./get_weather.js"
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image';
import {containsXY} from 'ol/extent';

// window.run = run;

// import tranform from 'ol/proj.js'

var cragsmap = new Map(Object.entries(crags));

// function mapper(c){
//   console.log(c)
// }

// cragsmap.forEach(mapper);
const arr = Array.from(cragsmap, ([key, value]) => ({
  key,
  value,
}))
console.log(Array.isArray(arr));
console.log(arr);


const distanceInput = '40';
const minDistanceInput = '10';


// var FeatureMap = localStorage.getItem("FeatureMap");
// export const coords = [[38.94656, -78.30231], [38.81352, -79.28219], [38.8338, -79.3663], [36.13128, -115.42452]]
const lonlat = [-76.87397, 39.1666]
const lonlat2 = [-79.28219, 38.81352]
const latlong = [38.94656, -78.30231]

const geom = new Point(fromLonLat(lonlat));
const feature = new Feature({'geometry': geom, 'size':'20'});
// const geom2 = new Point(fromLonLat(lonlat2));
// const feature2 = new Feature({'geometry': geom2, 'size':'20'});
var features = [feature]


var vectorSource = new VectorSource({
  features: features
})


function feature_maker(lonlat, image_path, tempf, forecast, areaname, url, isday){
  var geom = new Point(fromLonLat(lonlat));
  const day_styles = {
    'true': new Style({
      text: new olText({
        text: tempf+' F',
        fill: new Fill({
          color: 'black',
        }),
      }),
    }),
    'false': new Style({
      text: new olText({
        text: tempf+' F',
        fill: new Fill({
          color: 'white',
        }),
      }),
    }),
  };
  // console.log(day_styles[isday])
  return new Feature({'geometry': geom, 'image_path':image_path, 'size':'20', 'Forecast':forecast, 'URL':url,'AreaName':areaname, 'isday':isday, "TempF": tempf, 'style':[
    new Style({
      image: new RegularShape({
        points: 6,
        radius: 20,
        fill: new Fill({
          color: 'grey'
        })
      })
    }),
    new Style({
    image: new Icon({
      anchor: [.5, .5],
      // anchorOrigin: 'top-right',
      // scale: .10,
      scale: .5,
      // anchorXUnits: 'frac',
      // anchorYUnits: 'pixel',
      src: image_path,
      // color: 'yellow'
    }),
  }),
  day_styles[isday]
  ]
    })
    };

// console.log(vectorSource);
var clusterSource = new Cluster({
  distance: parseInt(distanceInput, 10),
  minDistance: parseInt(minDistanceInput, 10),
  source: vectorSource,
});
// console.log(clusterSource);

const styleCache = {};
const clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    const size = feature.get('features').length;
    // const img_path = feature.get('image_path');
    // console.log(feature);
    // console.log(feature.get('size'));
    let f1style = feature.get('features')[0].get('style');
    if (size == 1){
      // console.log(feature.get('features')[0].get('style'));
      let style = f1style;
      return style
    }
    else{
      // let style = styleCache[size];
      // if (!style) {
      let style = f1style.concat(
        new Style({
          image: new CircleStyle({
            // displacement: .1,
            // anchor:[0.5,1],
            displacement: [0, 17],
            radius: 12,
            stroke: new Stroke({
              color: '#fff',
            }),
            fill: new Fill({
              color: '#3399CC',
            }),
          }),
          text: new olText({
            // offsetx: 5,
            offsetY: -17,
            text: [size.toString(), "12px Sans-Serif"],
            fill: new Fill({
              color: 'white',
              // font: "bold 48px serif",
            }),
          }),
        }),
      );
        styleCache[size] = style;
      // }
      return style;
    }
    
  },
});


const map = new olMap({
  // projection: 'EPSG:4326',
  // overlays: [overlay],
  target: 'map',
  layers: [ new TileLayer({
    source: new Stamen({
      layer: 'terrain',
    })
  }), clusters
  ],
  view: new olView({
    center: fromLonLat(lonlat),
    zoom: 15
  }),
  
});


request_weather(arr, 0);

function chunkArray(a,s){ // a: array to chunk, s: size of chunks
  return Array.from({length: Math.ceil(a.length / s)})
              .map((_,i) => Array.from({length: s})
                                 .map((_,j) => a[i*s+j]));
}

async function request_weather(dataArray, wi) {
  vectorSource.clear();
  try {
    console.log("called");
      const chunks = chunkArray(dataArray, 50);
      for (const chunk of chunks) {
          // console.log(chunk);
          await call_coords(chunk, wi);
      }
  } catch (error) {
      console.log(error)
      // Catch en error here
  }
}

function call_coords(chunk, wi) {
  return Promise.all(
    chunk.map((item) => {
      // console.log(map.getView().calculateExtent());
      // console.log(containsXY(map.getView().calculateExtent(),fromLonLat(lonlat)[0], fromLonLat(lonlat)[1]));
      // console.log(fromLonLat(item.value.lnglat)[0],fromLonLat(item.value.lnglat)[0])
      // console.log(containsXY(map.getView().calculateExtent(), fromLonLat(item.value.lnglat)[0],fromLonLat(item.value.lnglat)[1]));
      return new Promise((resolve, reject) => {
      if (containsXY(map.getView().calculateExtent(), fromLonLat(item.value.lnglat)[0],fromLonLat(item.value.lnglat)[1]))
      {
      run(item, wi)
      .then(function(fmap){
        var feat = feature_maker(fmap['lonlat'],fmap['image_path'],fmap['TempF'],fmap['Forecast'],fmap['AreaName'],fmap['URL'],fmap['isDay'])
        feat.setStyle(feat.get('style'));
        try{vectorSource.addFeature(feat);
          resolve();
        }
        catch(error){
          console.log(error);
          resolve();
        }
      }
      )
      }
      else{
        resolve();
      }
      // console.log(item);
      
    }
    )}
    )
    )
}

var radarsource = new ImageWMS({
  attributions: ['NOAA'],
  url: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer',
  params: {'LAYERS': '1'},
  projection: 'EPSG:3857'
});

var radar = new ImageLayer({
  title: 'NOAA Radar',
  zIndex: 1,
  visible: true,
  source: radarsource,
  opacity: 0.7
});

map.addLayer(radar);


get_current_periods().then(function(subjectObject) {
  // console.log(subjectObject[0]);
  var subjectSel = document.getElementById("subject");
  for (var x in subjectObject) {
    subjectSel.options[subjectSel.options.length] = new Option(subjectObject[x],x);
  }
  subjectSel.onchange = function() {
    //empty Chapters- and Topics- dropdowns
  //   chapterSel.length = 1;
    //display correct values
      console.log(subjectSel.value);
    request_weather(arr, subjectSel.value);
  }
});


const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// display popup on click
// map.on('click', popup_show(evt));
map.on('click', function (evt) {
  popup_show(evt);
  // const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
  //   return feature;
  // });
  // disposePopover();
  // if (!feature) {
  //   return;
  // }
  // popup.setPosition(evt.coordinate);
  // popover = new bootstrap.Popover(element, {
  //   placement: 'top',
  //   html: true,
  //   // content: "Hello",
  //   title: feature.get('features')[0].get('AreaName'),
  //   content: feature.get('features')[0].get('TempF')+" F<br>"+feature.get('features')[0].get('Forecast')+"<br><a href="+feature.get('features')[0].get('URL')+">"+feature.get('features')[0].get('URL')+"</a>",
  // });
  // popover.show();
});

function popup_show(evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);
  popover = new bootstrap.Popover(element, {
    placement: 'top',
    html: true,
    // content: "Hello",
    title: feature.get('features')[0].get('AreaName'),
    content: feature.get('features')[0].get('TempF')+" F<br>"+feature.get('features')[0].get('Forecast')+"<br><a href="+feature.get('features')[0].get('URL')+">"+feature.get('features')[0].get('URL')+"</a>",
  });
  popover.show();
}


// change mouse cursor when over marker
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  if (hit){
    map.getTargetElement().style.cursor = 'pointer';
    // popup_show(e)
  }
  else{
    map.getTargetElement().style.cursor = '';
    // disposePopover();
  }
  // map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  // popup_show(e)
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);
map.on('moveend', function(){
  var subjectSel = document.getElementById("subject");
  let w
  if (subjectSel.value){
    w = subjectSel.value
  }
  else{
    w=0
  }
 console.log('moves');
request_weather(arr, w) 
});
// map.on('moveend', function(){
//   if (map.getView().getZoom() > 10)
//   {console.log('moves');
//   request_weather(arr, 0) }
// });