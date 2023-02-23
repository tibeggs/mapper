import './style.css';
import {Map as olMap, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import OSM from 'ol/source/OSM';
import { transform ,fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape} from 'ol/style.js';

import {run} from './get_weather.js';

// window.run = run;

// import tranform from 'ol/proj.js'
const image_path =  "Weather_Icons/White/Rain with Clouds.png"
// var FeatureMap = localStorage.getItem("FeatureMap");
export const coords = [[38.94656, -78.30231], [38.81352, -79.28219], [38.8338, -79.3663]]
const lonlat = [-79.3663,	38.8338, ]
const lonlat2 = [-79.28219, 38.81352]
const latlong = [38.94656, -78.30231]

const geom = new Point(fromLonLat(lonlat));
const feature = new Feature({'geometry': geom, 'size':'20'});
const geom2 = new Point(fromLonLat(lonlat2));
const feature2 = new Feature({'geometry': geom2, 'size':'20'});
var features = []

call_coords(coords, 0);

// var fmap = run(coords);
export function call_coords(coords, wi){
  run(coords, wi).then(function(fmap){
    vectorSource.clear();
    console.log(fmap);
    for(var i = 0, len = fmap.length; i < len; i++){
      var feat = feature_maker(fmap[i]['lonlat'],fmap[i]['image_path'])
      feat.setStyle(feat.get('style'));
      
      vectorSource.addFeature(feat);
      console.log(vector);
    }
    });
}


function feature_maker(lonlat, image_path){
  var geom = new Point(fromLonLat(lonlat));
  return new Feature({'geometry': geom, 'size':'20', 'style':[
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
      scale: .10,
      // anchorXUnits: 'frac',
      // anchorYUnits: 'pixel',
      src: image_path,
      // color: 'yellow'
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
    }),
    new Style({
    image: new Icon({
      anchor: [.5, .5],
      // anchorOrigin: 'top-right',
      scale: .10,
      // anchorXUnits: 'frac',
      // anchorYUnits: 'pixel',
      src: image_path,
      color: 'yellow'
    }),
  }),
  ]
};

var vectorSource = new VectorSource({
  features: features
})

var vector = new VectorLayer({
  source: vectorSource,
  // style: function (feature) {
  //   return styles[feature.get('style')];
  // },
});


const map = new olMap({
  // projection: 'EPSG:4326',
  target: 'map',
  layers: [ new TileLayer({
    source: new OSM()
  }), vector
  ],
  view: new View({
    center: fromLonLat(lonlat),
    zoom: 15
  })
});

