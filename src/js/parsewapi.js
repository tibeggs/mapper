import wjson from '../json/wapitest.json' assert { type: 'JSON' };;
import noaa_convert from '../json/noaa_convert.json' assert { type: 'JSON' };
import { DateTime } from "luxon";


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
    var day = wi - 1
    let past_day = day - 1
    let v = item.value;
    // console.log(v);
    let ret_json = { 'lonlat': [v.lnglat[0], v.lnglat[1],], 'AreaName': v.crag, 'URL': v.url, 'isDay': "true" }
    // console.log(v.history.forecastday[day].date)
    ret_json = parse_weather(day, past_day, v, ret_json)
    console.log(ret_json);
    return ret_json
}


function parse_weather(day, past_day, v, ret_json) {
    // console.log(v);
    if (v.forecast.forecastday) {
        return parse_w_api(day, past_day, v, ret_json);
    }
    else {
        return parse_noaa(day, past_day, v, ret_json);
    }


}

function parse_w_api(d, past_day, v, ret_json) {
    var day = handle_off_day(d);
    if (day >= 0) {
        ret_json['date'] = v.forecast.forecastday[day].date;
        var_map.forEach((value, key) => {
            // console.log(eval(`v.forecast.forecastday[${day}].day.${value}`));
            ret_json[key] = eval(`v.forecast.forecastday[${day}].day.${value}`)
        })
        if (day > 0) {
            past_map.forEach((value, key) => {
                // console.log(eval(ret_json[key]));
                ret_json[key] = eval(`v.forecast.forecastday[${past_day}].day.${value}`)
            })
        }
        else {
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

function parse_noaa(day, past_day, v, ret_json) {
    // let wiu = parseInt(day);
    try{
        let wiu = handle_off_day(v, parseInt(day));
        if (!v.forecast[0].isDaytime && wiu != -1) {
            wiu = (parseInt(wiu) * 2) + 1;
    
        }
        else if (wiu != -1) {
            wiu = (parseInt(wiu) * 2);
        }
        // console.log(wiu);
        if (wiu >= 0) {
            var luxonDate = DateTime.fromISO(v.forecast[wiu].startTime);
            const date = luxonDate.toFormat('yyyy-MM-dd')
            ret_json['date'] = date;
            noaa_map.forEach((value, key) => {
                console.log(eval(`v.forecast[${wiu}].${value}`));
                ret_json[key] = eval(`v.forecast[${wiu}].${value}`)
            })
            if (false && ret_json['Forecast'] in noaa_convert) {
                console.log(`img${noaa_convert[ret_json['Forecast']].icon}`);
                const img_path = eval(`img${noaa_convert[ret_json['Forecast']].icon}`);
                ret_json['image_path'] = img_path;
            }
            else {
                ret_json['image_path'] = ret_json['image_pathN'];
            }
            // console.log(ret_json['image_path']);
            if (wiu > -1) {
                past_noaa_map.forEach((value, key) => {
                    // console.log(eval(ret_json[key]));
                    ret_json[key] = eval(`v.forecast[${wiu - 1}].${value}`)
                })
            }
            // else {
            //     // console.log(v);
            //     ret_json['totalPrecipPast'] = v.history.forecastday[day].day.totalprecip_in;
            // }
            // console.log(ret_json);
            ret_json['precip_is_per'] = 'true'
            return ret_json
        }
        else if (wiu = -1) {
            var luxonDate = DateTime.fromISO(v.history.startTime);
            const date = luxonDate.toFormat('yyyy-MM-dd')
            ret_json['date'] = date;
            past_noaa_map.forEach((value, key) => {
                // console.log(eval(ret_json[key]));
                ret_json[key] = eval(`v.history.${value}`)
            })
            // console.log(ret_json);
            ret_json['precip_is_per'] = 'true'
            return ret_json
        }
        else if (wiu = -2) {
            return ret_json
        }
    }
    catch(err){
        console.log(err)
        return ret_json
    }
}

function match_wi_to_day(v, wi, noaa) {
    console.log("Match_to_day ", v, noaa)
    var arrayLength = v.forecast.length
    for (var i = 0; i < arrayLength; i++) {
        //console.log(i);
        if (noaa) {
            //console.log(is_today(v, i, noaa));
            //console.log(v.forecast[i].isDaytime);
            //console.log(Math.floor((parseInt(i) - 1) / 2) + wi);
            if (is_today(v, i, noaa) && v.forecast[i].isDaytime) {
                console.log(Math.floor((parseInt(i) - 1) / 2) + wi)
                return Math.floor((parseInt(i) - 1) / 2) + parseInt(wi)
            }
        }
        else {
            if (is_today(v, i, noaa)) {
                return parseInt(i) + parseInt(wi)
            }

        }

    }
    return -2
}

function handle_off_day(v, wi, noaa = true) {
    if (is_today(v, 0, noaa)) {
        return wi
    }
    else {
        return match_wi_to_day(v, wi, noaa)
    }
}

function is_today(v, i, noaa) {
    var wi = parseInt(i);
    var today = DateTime.now().toFormat('yyyy-MM-dd')
    try{
        if (noaa) {
            var luxonDate = DateTime.fromISO(v.forecast[wi].startTime);
            var date = luxonDate.toFormat('yyyy-MM-dd')
        }
        else {
            var date = v.forecast.forecastday[wi].date
        }
    
        //console.log("today: ", today, " | comp: ", date);
        if (date != today) {
            return false
        }
        else {
            return true
        }
    }
    catch(err){
        console.log(err);
        return false
    }

}