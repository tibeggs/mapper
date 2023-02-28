import { Map as olMap, View as olView } from 'ol';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape, Text as olText } from 'ol/style.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image';
import { containsXY } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Cluster } from 'ol/source.js';
import Overlay from 'ol/Overlay.js';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen.js';
import XYZ from 'ol/source/XYZ.js';
import { transform, fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';

const deflonlat = [-76.87397, 39.1666]
const distanceInput = '40';
const minDistanceInput = '10';

function create_map(){
    return new olMap({
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
}

function create_cluster_source(source) {
    return new Cluster({
        distance: parseInt(distanceInput, 10),
        minDistance: parseInt(minDistanceInput, 10),
        source: source,
      });
}

function create_cluster_layer(clustersource){
    return new VectorLayer({
        source: clustersource,
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
            // styleCache[size] = style;
            // }
            return style;
          }
      
        },
      });
}

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
            scale: .5,
            src: image_path,
          }),
        }),
        day_styles[isday]
      ]
    })
  };

export {create_map, create_cluster_source, create_cluster_layer,feature_maker}