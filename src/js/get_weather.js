const NoaaToLocal = new Map()
NoaaToLocal.set('Mostly Cloudy', "./Weather_Icons/White/Sun Behind Clouds.png")
NoaaToLocal.set('Partly Cloudy', "./Weather_Icons/White/Cloud.png")
NoaaToLocal.set('Sunny', "./Weather_Icons/White/Lighter Heat.png")
NoaaToLocal.set('Rain', "./Weather_Icons/White/Rain with Clouds.png")
NoaaToLocal.set('Snow', "./Weather_Icons/White/Snow.png")
NoaaToLocal.set('Clear', './/weather-icons-png/Clear.png')
NoaaToLocal.set('NA', "./Weather_Icons/White/Question.png")

// const coords = [[38.94656, -78.30231], [38.81352, -79.28219]]
const safe_coord  =[38.81352, -79.28219]
const base_url = 'https://api.weather.gov/points/';

export async function get_current_periods(){
    return new Promise((resolve, reject) => {
    var wurl = base_url+safe_coord[0]+","+safe_coord[1]
    console.log(wurl)
    get_weather_periods(wurl).then(
        function(data) {
            console.log(data);
            resolve(data)
        });
})
}

var wi = 0;
console.log(wi);
// const lonlat = [-79.288, 38.785]
// const latlong = [38.94656, -78.30231]

async function fill_feature_map(coords){
    return new Promise((resolve, reject) => {
        const FeatureMap = new Map()
        var actions = coords.map(coordfn);
        var result =  Promise.all(actions);
        // console.log(result);
        result.then(data => resolve(data))
        
});
};

var coordfn = function coordasync(c){
    return new Promise(resolve => {
    var wurl = base_url+c[0]+","+c[1]
    console.log(wurl)
    get_weather_url(wurl).then(
        function(data) {
            // console.log(data)
            resolve(matchForecast(c, data[0], data[1], data[2]))
        }
    ); 
});
};


function matchForecast(c,a,f,i){
  console.log("here " + a);
//   return {'lonlat':[c[1],c[0]],'Forecast': a, 'image_path': value}
return {'lonlat':[c[1],c[0]],'Forecast': a, 'image_path': i, "TempF": f}
  // for (var [key, value] of NoaaToLocal) {
  //   if (a.includes(key)) {
  //     var p = "a:" +a + " Key: " + key;
  //       return {'lonlat':[c[1],c[0]],'Forecast': a, 'image_path': i, "TempF": f}
  //       // return {'lonlat':[c[1],c[0]],'Forecast': a, 'image_path': value, 'feature': feature_maker(c)}
  //   };
  // };
  // // console.log(NoaaToLocal);
  // return {'lonlat':[c[1],c[0]],'Forecast': a, 'image_path': NoaaToLocal.get('NA')}
};

export async function run(coords, w) {
    console.log(coords);
    wi = w;
    console.log(wi);
    return new Promise((resolve, reject) => {
    console.log("running")
    var thing = fill_feature_map(coords).then(function(FeatureMap) {
    localStorage.setItem("FeatureMap", FeatureMap);  
    resolve(FeatureMap);
    })
})
};

async function get_weather_periods(url){
    const response = await fetch(url);
    var data = await response.json();
  //   console.log(data.properties.forecast);
    return get_periods(data.properties.forecast)
    };

async function get_periods(url){
  const response = await fetch(url);
  var data = await response.json();
  let names = data.properties.periods.map(({ name }) => name);
  return names.slice(0, 5)
};

async function get_weather_url(url){
  const response = await fetch(url);
  var data = await response.json();
//   console.log(data.properties.forecast);
  return get_weather(data.properties.forecast)
  }

async function get_weather(url){
  const response = await fetch(url);
  var data = await response.json();
//   console.log(data)
//   console.log(wi);
  return [data.properties.periods[wi].shortForecast, data.properties.periods[wi].temperature, data.properties.periods[wi].icon]
  }
