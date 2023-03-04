import wjson from '../json/wapitest.json' assert { type: 'JSON' };;

// { 'lonlat': [c[0], c[1]], 'Forecast': a, 'image_path': i, "TempF": f, 'AreaName': n, 'URL': u, 'isDay': d }
// Forecast: condition.text image_path:condition.icon avgTempF:avgtemp_f minTempF: mintemp_f maxTempF: maxtemp_f maxWind : maxwind_mph totalPrecip: totalprecip_in
// rain_chance: daily_chance_of_rain snow_chance: daily_chance_of_snow 

const var_map = new Map();
var_map.set('Forecast', 'condition.text');
var_map.set('Forecast', 'condition.text');
var_map.set('image_path', 'condition.icon');
var_map.set('TempF', 'avgtemp_f');
var_map.set('minTempF', 'mintemp_f');
var_map.set('maxTempF', 'maxtemp_f');
var_map.set('maxWind', 'maxwind_mph');
var_map.set('totalPrecip', 'totalprecip_in');
var_map.set('rain_chance', 'daily_chance_of_rain');
var_map.set('snow_chance', 'daily_chance_of_snow');

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

// var day = 0

export function prun(item, wi) {
    var day = wi-1
    // console.log(day);
    let past_day = day-1
    let v = item.value;
    let ret_json = { 'lonlat': [v.lnglat[0],v.lnglat[1],], 'AreaName': v.crag, 'URL': v.url, 'isDay': "true" }
    // console.log(v.history.forecastday[day].date)
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
        // console.log(ret_json);
        return ret_json
    }
    else if (day = -1) {
        ret_json['date'] = v.history.forecastday[0].date;
        var_map.forEach((value, key) => {
            // console.log(eval(`v.history.forecastday[0].day.${value}`));
            ret_json[key] = eval(`v.history.forecastday[0].day.${value}`)
        })
        // console.log(ret_json);
        return ret_json
    }
    

    return
}
