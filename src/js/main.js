import '../scss/style.scss';
import * as bootstrap from 'bootstrap';
import {Map as olMap, View as olView} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Cluster} from 'ol/source.js';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ.js';
import { transform ,fromLonLat, toLonLat} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape, Text as olText} from 'ol/style.js';
import {run} from './get_weather.js';
import {coords, crags} from './coordinates';
import Overlay from 'ol/Overlay.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {get_current_periods} from "./get_weather.js"

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

call_coords(arr, 0);

// var fmap = run(coords);
export function call_coords(coords, wi){
  run(coords, wi).then(function(fmap){
    vectorSource.clear();
    // console.log(fmap);
    for(var i = 0, len = fmap.length; i < len; i++){
      var feat = feature_maker(fmap[i]['lonlat'],fmap[i]['image_path'],fmap[i]['TempF'],fmap[i]['Forecast'],fmap[i]['AreaName'],fmap[i]['URL'])
      feat.setStyle(feat.get('style'));
      // console.log(feat);
      vectorSource.addFeature(feat);
    }
    });
}


function feature_maker(lonlat, image_path, tempf, forecast, areaname, url){
  var geom = new Point(fromLonLat(lonlat));
  return new Feature({'geometry': geom, 'image_path':image_path, 'size':'20', 'Forecast':forecast, 'URL':url,'AreaName':areaname, "TempF": tempf, 'style':[
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
  new Style({
    text: new olText({
      text: tempf+' F',
      fill: new Fill({
        color: 'black',
      }),
    }),
  }),
  ]
    })
    };

const styles = {
  '10': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
  }),
  '20': [
    new Style({
      image: new RegularShape({
        points: 6,
        radius: 20,
        fill: new Fill({
          color: 'red'
        })
      })
    })
  ]
};


var vectorSource = new VectorSource({
  features: features
})

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
    // console.log(size);
    // console.log(feature.get('size'));
    if (size == 1){
      // console.log(feature.get('features')[0].get('style'));
      let style = feature.get('features')[0].get('style');
      return style
    }
    else{
      let style = styleCache[size];
      if (!style) {
        style = [new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: '#fff',
            }),
            fill: new Fill({
              color: '#3399CC',
            }),
          }),
          text: new olText({
            text: size.toString(),
            fill: new Fill({
              color: '#fff',
            }),
          }),
        }),
      ];
        styleCache[size] = style;
      }
      return style;
    }
    
  },
});


const map = new olMap({
  // projection: 'EPSG:4326',
  // overlays: [overlay],
  target: 'map',
  layers: [ new TileLayer({
    source: new OSM()
  }), clusters
  ],
  view: new olView({
    center: fromLonLat(lonlat),
    zoom: 15
  }),
  
});

get_current_periods().then(function(subjectObject) {
  console.log(subjectObject[0]);
  var subjectSel = document.getElementById("subject");
  var topicSel = document.getElementById("topic");
  var chapterSel = document.getElementById("chapter");
  for (var x in subjectObject) {
    subjectSel.options[subjectSel.options.length] = new Option(subjectObject[x],x);
  }
  subjectSel.onchange = function() {
    //empty Chapters- and Topics- dropdowns
  //   chapterSel.length = 1;
    //display correct values
      console.log(subjectSel.value);
    call_coords(arr, subjectSel.value);
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
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  console.log(feature);
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
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);