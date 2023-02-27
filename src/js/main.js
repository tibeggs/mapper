import '../scss/style.scss';
import * as bootstrap from 'bootstrap';
import { Map as olMap, View as olView } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Cluster } from 'ol/source.js';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen.js';
import XYZ from 'ol/source/XYZ.js';
import { transform, fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape, Text as olText } from 'ol/style.js';
import { run } from './get_weather.js';
// import { crags } from './coordinates';
import crags from '../json/crags.json' assert { type: 'JSON' };;
import Overlay from 'ol/Overlay.js';
import { toStringHDMS } from 'ol/coordinate.js';
import { get_current_periods } from "./get_weather.js"
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image';
import { containsXY } from 'ol/extent';

var cragsmap = new Map(Object.entries(crags));


// cragsmap.forEach(mapper);
const arr = Array.from(cragsmap, ([key, value]) => ({
  key,
  value,
}))

function fill_crags(subjectObject) {
  var subjectSel = document.getElementById("cragjump");
  subjectObject.forEach((value,key) => {
    subjectSel.options[parseInt(key)] = new Option(value.crag, value.lnglat);
  })
  subjectSel.onchange = function () {
    //empty Chapters- and Topics- dropdowns
    //   chapterSel.length = 1;
    //display correct values
    console.log(subjectSel.value);
    change_map_view(subjectSel.value.split(","))
    // request_weather(arr, subjectSel.value);
  }
}
fill_crags(cragsmap);

console.log(Array.isArray(arr));
console.log(arr);

const featureminzoom = 8
const distanceInput = '40';
const minDistanceInput = '10';
const deflonlat = [-76.87397, 39.1666]
const lonlat2 = [-79.28219, 38.81352]
const latlong = [38.94656, -78.30231]
const geom = new Point(fromLonLat(deflonlat));
const feature = new Feature({ 'geometry': geom, 'size': '20' });
const styleCache = {};

var FeatureMap = new Map()
var features = [feature]
var vectorSource = new VectorSource({
  // features: features
})

const map = new olMap({
  // projection: 'EPSG:4326',
  // overlays: [overlay],
  target: 'map',
  layers: [new TileLayer({
    source: new Stamen({
      layer: 'terrain',
    })
  }),
  ],
  view: new olView({
    center: fromLonLat(deflonlat),
    zoom: 12
  }),

});

const element = document.getElementById('popup');

var clusterSource = new Cluster({
  distance: parseInt(distanceInput, 10),
  minDistance: parseInt(minDistanceInput, 10),
  source: vectorSource,
});

const clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    const size = feature.get('features').length;
    // const img_path = feature.get('image_path');
    let f1style = feature.get('features')[0].get('style');
    if (size == 1) {
      let style = f1style;
      return style
    }
    else {
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
map.addLayer(clusters);

function feature_maker(lonlat, image_path, tempf, forecast, areaname, url, isday) {
  var geom = new Point(fromLonLat(lonlat));
  const day_styles = {
    'true': new Style({
      text: new olText({
        text: tempf + ' F',
        fill: new Fill({
          color: 'black',
        }),
      }),
    }),
    'false': new Style({
      text: new olText({
        text: tempf + ' F',
        fill: new Fill({
          color: 'white',
        }),
      }),
    }),
  };

  return new Feature({
    'geometry': geom, 'image_path': image_path, 'size': '20', 'Forecast': forecast, 'URL': url, 'AreaName': areaname, 'isday': isday, "TempF": tempf, 'style': [
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

function getLocation() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}
async function set_default_location() {
  try {
    const position = await getLocation();
    return [position.coords.longitude, position.coords.latitude]
  } catch (err) {
    console.error(err.message);

  }
}
// let t = await set_default_location();
set_default_location().then(function (t) {
  console.log(t);
  change_map_view(t)
})

function change_map_view(t)
{
  map.setView(
    new olView({
      center: fromLonLat(t),
      zoom:map.getView().getZoom()
    }
    )
  )
}

function is_in_extent(item) {
  return containsXY(map.getView().calculateExtent(), fromLonLat(item.value.lnglat)[0], fromLonLat(item.value.lnglat)[1])
}

function chunkArray(a, s) { // a: array to chunk, s: size of chunks
  return Array.from({ length: Math.ceil(a.length / s) })
    .map((_, i) => Array.from({ length: s })
      .map((_, j) => a[i * s + j]));
}

async function request_weather(rawArray, wi) {
  // vectorSource.clear();
  let dataArray = rawArray.filter(is_in_extent);
  try {
    console.log("called");
    const chunks = chunkArray(dataArray, 150);
    for (const chunk of chunks) {
      // console.log(chunk);
      await call_coords(chunk, wi);
    }
  } catch (error) {
    console.log(error)
    // Catch en error here
  }
}

function add_feature_safe(lonlatstr, feat) {
  return new Promise((resolve, reject) => {
    if (map.getView().getZoom() < featureminzoom) {
      resolve()
    }
    try {
      if (FeatureMap.has(lonlatstr)) {
        vectorSource.removeFeature(FeatureMap.get(lonlatstr))
        FeatureMap.delete(lonlatstr);
        if (map.getView().getZoom() > featureminzoom) {
          vectorSource.addFeature(feat);
          FeatureMap.set(lonlatstr, feat);
        }
        resolve();
      }
      else {
        if (map.getView().getZoom() > featureminzoom) {
          vectorSource.addFeature(feat);
          FeatureMap.set(lonlatstr, feat);
        }
        resolve();
      }
    }
    catch (error) {
      console.log(error);
      resolve();
    }
  })
}

function call_coords(chunk, wi) {
  return Promise.all(
    chunk.map((item) => {
      return new Promise((resolve, reject) => {
        if (containsXY(map.getView().calculateExtent(), fromLonLat(item.value.lnglat)[0], fromLonLat(item.value.lnglat)[1])) {
          run(item, wi)
            .then(function (fmap) {
              var feat = feature_maker(fmap['lonlat'], fmap['image_path'], fmap['TempF'], fmap['Forecast'], fmap['AreaName'], fmap['URL'], fmap['isDay'])
              feat.setStyle(feat.get('style'));
              let lonlatstr = fmap['lonlat'].toString()
              resolve(add_feature_safe(lonlatstr, feat));
            }
            )
        }
        else {
          FeatureMap.delete(item.value.lnglat.toString());
          resolve();
        }
      }
      )
    }
    )
  )
}

var radarsource = new ImageWMS({
  attributions: ['NOAA'],
  url: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer',
  params: { 'LAYERS': '1' },
  projection: 'EPSG:3857'
});

var radar = new ImageLayer({
  title: 'NOAA Radar',
  zIndex: 1,
  visible: true,
  source: radarsource,
  opacity: 0.7
});

// map.addLayer(radar);


get_current_periods().then(function (subjectObject) {
  var subjectSel = document.getElementById("weatherperiod");
  subjectSel.innerHTML=subjectObject[0];
  for (var x in subjectObject) {
    subjectSel.options[subjectSel.options.length] = new Option(subjectObject[x], x);
  }
  subjectSel.onchange = function () {
    //empty Chapters- and Topics- dropdowns
    //   chapterSel.length = 1;
    //display correct values
    console.log(subjectSel.value);
    request_weather(arr, subjectSel.value);
  }
});

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
    content: feature.get('features')[0].get('TempF') + " F<br>" + feature.get('features')[0].get('Forecast') + "<br><a href=" + feature.get('features')[0].get('URL') + ">" + feature.get('features')[0].get('URL') + "</a>",
  });
  popover.show();
}


// change mouse cursor when over marker
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  if (hit) {
    map.getTargetElement().style.cursor = 'pointer';
    // popup_show(e)
  }
  else {
    map.getTargetElement().style.cursor = '';
    // disposePopover();
  }
  // map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  // popup_show(e)
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);
map.on('moveend', function () {
  if (map.getView().getZoom() > featureminzoom) {
    let FeaturesToRemove = new Array();
    let KeysToRemove = new Array();
    FeatureMap.forEach((value, key, map1) => {
      let lnglat = key.split(',');
      if (!containsXY(map.getView().calculateExtent(), fromLonLat(lnglat)[0], fromLonLat(lnglat)[1])) {
        FeaturesToRemove.push(value);
        KeysToRemove.push(key);
      }
    }
    )
    FeaturesToRemove.forEach(function (x) {
      vectorSource.removeFeature(x);
    })
    KeysToRemove.map(function (x) {
      FeatureMap.delete(x)
    })
    var subjectSel = document.getElementById("weatherperiod");
    let w
    if (subjectSel.value) {
      w = subjectSel.value
    }
    else {
      w = 0
    }
    request_weather(arr, w)
  }
  else {
    console.log('clear ', map.getView().getZoom());
    vectorSource.clear();
  }
});

request_weather(arr, 0);