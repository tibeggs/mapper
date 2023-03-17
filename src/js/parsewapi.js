import wjson from '../json/wapitest.json' assert { type: 'JSON' };;
import noaa_convert from '../json/noaa_convert.json' assert { type: 'JSON' };
import { DateTime } from "luxon";
import	img113	from	'../images/day/113.png';
import	img116	from	'../images/day/116.png';
import	img119	from	'../images/day/119.png';
import	img122	from	'../images/day/122.png';
import	img143	from	'../images/day/143.png';
import	img176	from	'../images/day/176.png';
import	img179	from	'../images/day/179.png';
import	img182	from	'../images/day/182.png';
import	img185	from	'../images/day/185.png';
import	img200	from	'../images/day/200.png';
import	img227	from	'../images/day/227.png';
import	img230	from	'../images/day/230.png';
import	img248	from	'../images/day/248.png';
import	img260	from	'../images/day/260.png';
import	img263	from	'../images/day/263.png';
import	img266	from	'../images/day/266.png';
import	img281	from	'../images/day/281.png';
import	img284	from	'../images/day/284.png';
import	img293	from	'../images/day/293.png';
import	img296	from	'../images/day/296.png';
import	img299	from	'../images/day/299.png';
import	img302	from	'../images/day/302.png';
import	img305	from	'../images/day/305.png';
import	img308	from	'../images/day/308.png';
import	img311	from	'../images/day/311.png';
import	img314	from	'../images/day/314.png';
import	img317	from	'../images/day/317.png';
import	img320	from	'../images/day/320.png';
import	img323	from	'../images/day/323.png';
import	img326	from	'../images/day/326.png';
import	img329	from	'../images/day/329.png';
import	img332	from	'../images/day/332.png';
import	img335	from	'../images/day/335.png';
import	img338	from	'../images/day/338.png';
import	img350	from	'../images/day/350.png';
import	img353	from	'../images/day/353.png';
import	img356	from	'../images/day/356.png';
import	img359	from	'../images/day/359.png';
import	img362	from	'../images/day/362.png';
import	img365	from	'../images/day/365.png';
import	img368	from	'../images/day/368.png';
import	img371	from	'../images/day/371.png';
import	img374	from	'../images/day/374.png';
import	img377	from	'../images/day/377.png';
import	img386	from	'../images/day/386.png';
import	img389	from	'../images/day/389.png';
import	img392	from	'../images/day/392.png';
import	img395	from	'../images/day/395.png';

const img_map = new Map();
img_map.set(	"img113", 	img113	);
img_map.set(	"img116", 	img116	);
img_map.set(	"img119", 	img119	);
img_map.set(	"img122", 	img122	);
img_map.set(	"img143", 	img143	);
img_map.set(	"img176", 	img176	);
img_map.set(	"img179", 	img179	);
img_map.set(	"img182", 	img182	);
img_map.set(	"img185", 	img185	);
img_map.set(	"img200", 	img200	);
img_map.set(	"img227", 	img227	);
img_map.set(	"img230", 	img230	);
img_map.set(	"img248", 	img248	);
img_map.set(	"img260", 	img260	);
img_map.set(	"img263", 	img263	);
img_map.set(	"img266", 	img266	);
img_map.set(	"img281", 	img281	);
img_map.set(	"img284", 	img284	);
img_map.set(	"img293", 	img293	);
img_map.set(	"img296", 	img296	);
img_map.set(	"img299", 	img299	);
img_map.set(	"img302", 	img302	);
img_map.set(	"img305", 	img305	);
img_map.set(	"img308", 	img308	);
img_map.set(	"img311", 	img311	);
img_map.set(	"img314", 	img314	);
img_map.set(	"img317", 	img317	);
img_map.set(	"img320", 	img320	);
img_map.set(	"img323", 	img323	);
img_map.set(	"img326", 	img326	);
img_map.set(	"img329", 	img329	);
img_map.set(	"img332", 	img332	);
img_map.set(	"img335", 	img335	);
img_map.set(	"img338", 	img338	);
img_map.set(	"img350", 	img350	);
img_map.set(	"img353", 	img353	);
img_map.set(	"img356", 	img356	);
img_map.set(	"img359", 	img359	);
img_map.set(	"img362", 	img362	);
img_map.set(	"img365", 	img365	);
img_map.set(	"img368", 	img368	);
img_map.set(	"img371", 	img371	);
img_map.set(	"img374", 	img374	);
img_map.set(	"img377", 	img377	);
img_map.set(	"img386", 	img386	);
img_map.set(	"img389", 	img389	);
img_map.set(	"img392", 	img392	);
img_map.set(	"img395", 	img395	);


// { 'lonlat': [c[0], c[1]], 'Forecast': a, 'image_path': i, "TempF": f, 'AreaName': n, 'URL': u, 'isDay': d }
// Forecast: condition.text image_path:condition.icon avgTempF:avgtemp_f minTempF: mintemp_f maxTempF: maxtemp_f maxWind : maxwind_mph totalPrecip: totalprecip_in
// rain_chance: daily_chance_of_rain snow_chance: daily_chance_of_snow 
function getImageUrl(name) {
    return new URL(`../images/day/${name}.png`, import.meta.url).href
  }

const var_map = new Map();
var_map.set('Forecast', 'condition.text');
var_map.set('image_path', 'condition.icon');
var_map.set('TempF', 'avgtemp_f');
var_map.set('minTempF', 'mintemp_f');
var_map.set('maxTempF', 'maxtemp_f');
var_map.set('maxWind', 'maxwind_mph');
var_map.set('totalPrecip', 'totalprecip_in');
var_map.set('rain_chance', 'daily_chance_of_rain');
var_map.set('snow_chance', 'daily_chance_of_snow');

const noaa_map = new Map();
noaa_map.set('Forecast', 'shortForecast');
noaa_map.set('image_pathN', 'icon');
noaa_map.set('TempF', 'temperature');
noaa_map.set('minTempF', 'temperature');
noaa_map.set('maxTempF', 'temperature');
noaa_map.set('maxWind', 'windSpeed');
noaa_map.set('totalPrecip', 'probabilityOfPrecipitation.value');
noaa_map.set('rain_chance', 'probabilityOfPrecipitation.value');
noaa_map.set('snow_chance', 'probabilityOfPrecipitation.value');

const past_map = new Map();
past_map.set('ForecastPast', 'condition.text');
past_map.set('image_pathPast', 'condition.icon');
past_map.set('TempFPast', 'avgtemp_f');
past_map.set('minTempFPast', 'mintemp_f');
past_map.set('maxTempFPast', 'maxtemp_f');
past_map.set('maxWindPast', 'maxwind_mph');
past_map.set('totalPrecipPast', 'totalprecip_in');
past_map.set('rain_chancePast', 'daily_chance_of_rain');
past_map.set('snow_chancePast', 'daily_chance_of_snow');

const past_noaa_map = new Map();
past_noaa_map.set('ForecastPast', 'shortForecast');
past_noaa_map.set('image_pathPastN', 'icon');
past_noaa_map.set('TempFPast', 'temperature');
past_noaa_map.set('minTempFPast', 'temperature');
past_noaa_map.set('maxTempFPast', 'temperature');
past_noaa_map.set('maxWindPast', 'windSpeed');
past_noaa_map.set('totalPrecipPast', 'probabilityOfPrecipitation.value');
past_noaa_map.set('rain_chancePast', 'probabilityOfPrecipitation.value');
past_noaa_map.set('snow_chancePast', 'probabilityOfPrecipitation.value');

// var day = 0

export function prun(item, wi) {
    // item over
    var day = wi-1
    let past_day = day-1
    let v = item.value;
    console.log(v);
    let ret_json = { 'lonlat': [v.lnglat[0],v.lnglat[1],], 'AreaName': v.crag, 'URL': v.url, 'isDay': "true" }
    // console.log(v.history.forecastday[day].date)
    ret_json = parse_weather(day, past_day, v, ret_json)
    return ret_json
}


function parse_weather(day,  past_day, v, ret_json){
    console.log(v);
    if (v.forecast.forecastday){
        return parse_w_api(day,  past_day, v, ret_json);
    }
    else
    {
        return parse_noaa(day,  past_day, v, ret_json);
    }
    
    
}

function parse_w_api(day,  past_day, v, ret_json){
    if (day >=0){
        ret_json['date'] = v.forecast.forecastday[day].date;
        var_map.forEach((value, key) => {
            // console.log(eval(`v.forecast.forecastday[${day}].day.${value}`));
            ret_json[key] = eval(`v.forecast.forecastday[${day}].day.${value}`)
        })
        if (day>0){
            past_map.forEach((value, key) => {
                // console.log(eval(ret_json[key]));
                ret_json[key] = eval(`v.forecast.forecastday[${past_day}].day.${value}`)
            })
        }
        else{
            // console.log(v);
            ret_json['totalPrecipPast'] = v.history.forecastday[day].day.totalprecip_in;
        }
        ret_json['precip_is_per'] = 'false'
        return ret_json
    }
    else if (day = -1) {
        ret_json['date'] = v.history.forecastday[0].date;
        var_map.forEach((value, key) => {
            // console.log(eval(`v.history.forecastday[0].day.${value}`));
            ret_json[key] = eval(`v.history.forecastday[0].day.${value}`)
        })
        // console.log(ret_json);
        ret_json['precip_is_per'] = 'false'
        return ret_json
    }
}

function parse_noaa(day,  past_day, v, ret_json){
    let wiu = parseInt(day);
    if (!v.forecast[0].isDaytime && wiu !=-1) {
        wiu = (parseInt(wiu) * 2) + 1;

    }
    else if (wiu !=-1){
        wiu = (parseInt(wiu) * 2);
    }
    console.log(wiu);
    if (wiu >=0){
        var luxonDate = DateTime.fromISO(v.forecast[wiu].startTime);
        const date = luxonDate.toFormat('yyyy-MM-dd')
        ret_json['date'] = date;
        noaa_map.forEach((value, key) => {
            console.log(eval(`v.forecast[${wiu}].${value}`));
            ret_json[key] = eval(`v.forecast[${wiu}].${value}`)
        })
        if(ret_json['Forecast'] in noaa_convert){
            console.log(noaa_convert[ret_json['Forecast']]);
            const img_path = eval(`img${noaa_convert[ret_json['Forecast']].icon}.png`);
            ret_json['image_path'] = img_path;
        }
        else{
            ret_json['image_path'] = ret_json['image_pathN'];
        }
        console.log( ret_json['image_path']);
        if (wiu>0){
            past_noaa_map.forEach((value, key) => {
                // console.log(eval(ret_json[key]));
                ret_json[key] = eval(`v.forecast[${wiu-1}].${value}`)
            })
        }
        else{
            // console.log(v);
            ret_json['totalPrecipPast'] = v.history.forecastday[day].day.totalprecip_in;
        }
        // console.log(ret_json);
        ret_json['precip_is_per'] = 'true'
        return ret_json
    }
    else if (wiu = -1) {
        ret_json['date'] = v.history.forecastday[0].date;
        var_map.forEach((value, key) => {
            ret_json[key] = eval(`v.history.forecastday[0].day.${value}`)
        })
        // console.log(ret_json);
        ret_json['precip_is_per'] = 'true'
        return ret_json
    }
}