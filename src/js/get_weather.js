const NoaaToLocal = new Map()
NoaaToLocal.set('Mostly Cloudy', "./Weather_Icons/White/Sun Behind Clouds.png")
NoaaToLocal.set('Partly Cloudy', "./Weather_Icons/White/Cloud.png")
NoaaToLocal.set('Sunny', "./Weather_Icons/White/Lighter Heat.png")
NoaaToLocal.set('Rain', "./Weather_Icons/White/Rain with Clouds.png")
NoaaToLocal.set('Snow', "./Weather_Icons/White/Snow.png")
NoaaToLocal.set('Clear', './weather-icons-png/Clear.png')
NoaaToLocal.set('NA', "./weather-icons-png/Question.pn")
// NoaaToLocal.set('NA', "https://api.weather.gov/icons/land/day/sct?size=medium")

// const coords = [[38.94656, -78.30231], [38.81352, -79.28219]]
const safe_coord = [38.81352, -79.28219]
const base_url = 'https://api.weather.gov/points/';

var wi = 0;

export async function get_current_periods() {
  return new Promise((resolve, reject) => {
    var wurl = base_url + safe_coord[0] + "," + safe_coord[1]
    console.log(wurl)
    get_weather_periods(wurl).then(
      function (data) {
        resolve(data)
      });
  })
}

async function fill_feature(coords) {
  return new Promise((resolve, reject) => {
    const FeatureMap = new Map()
    // var actions = coords.map(coordfn);
    var result = coordfn(coords);
    // var result =  Promise.all(actions);
    result.then(data => resolve(data))

  });
};

var coordfn = function coordasync(coords) {
  const c = coords.value.lnglat;
  const an = coords.value.crag;
  const url = coords.value.url;
  return new Promise(resolve => {
    var wurl = base_url + c[1] + "," + c[0]
    get_weather_url(wurl).then(
      function (data) {
        resolve(matchForecast(c, data[0], data[1], data[2], data[3], an, url))
      }
    );
  });
};

function matchForecast(c, a, f, i, d, n, u) {
  return { 'lonlat': [c[0], c[1]], 'Forecast': a, 'image_path': i, "TempF": f, 'AreaName': n, 'URL': u, 'isDay': d }
};

export async function run(coords, w) {
  wi = w;
  console.log(wi);
  return new Promise((resolve, reject) => {
    var thing = fill_feature(coords).then(function (Feature) {
      resolve(Feature);
    })
  })
};

async function get_weather_periods(url) {
  const response = await fetchRetry(url, 10, 100);
  var data = await response.json();
  return get_periods(data.properties.forecast)
};

async function get_periods(url) {
  const response = await fetchRetry(url, 10, 100);
  var data = await response.json();
  var startp = 0;

  let names = data.properties.periods.map(({ name }) => name);
  if (data.properties.periods[0].isDaytime == false) {
    names.shift();
  }
  let namesf = names.filter((element, index) => {
    return index % 2 === 0;
  })
  return namesf.slice(0, 5)
};

async function get_weather_url(url) {
  const response = await fetchRetry(url, 100, 5);
  var data = await response.json();
  if ('properties' in data) {
    return get_weather(data.properties.forecast)
  }
  else {
    return ["Unknown", 0, NoaaToLocal.get("NA"), "true"]
  }

}

async function get_weather(url) {
  try {
    const response = await fetchRetry(url, 100, 5);
    var data = await response.json();
    if (data.status) {
      return ["Unknown", 0, NoaaToLocal.get("NA"), "true"]
    }
    else {
      let wiu = parseInt(wi);
      if (!data.properties.periods[0].isDaytime) {
        wiu = (parseInt(wiu) * 2) + 1;

      }
      return [data.properties.periods[wiu].shortForecast, data.properties.periods[wiu].temperature, data.properties.periods[wiu].icon, data.properties.periods[wiu].isDaytime]
    }
  }
  catch (error) {
    console.error(`Could not get products: ${error}`, url);
    return ["Unknown", 0, NoaaToLocal.get("NA"), "true"]
  }
}


var data = { foo: "bar" };
var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

var init = { "status": 200, "statusText": "SuperSmashingGreat!" };
var myResponse = new Response(blob, init);

async function fetchRetry(url, delay, tries, fetchOptions = {}) {
  function onError() {
    if (tries < 1) {
      var data = { status: 'badtimes' }
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var init = { "status": 500, "statusText": "SuperSmashingGreat!" };
      return new Response(blob, init);
    }
    console.log("tries: ", tries)
    return wait(delay).then(() => fetchRetry(url, delay, tries - 1, fetchOptions));
  }
  return new Promise((resolve, reject) => {
    var result = fetch(url, fetchOptions);
    result.then(result => {
      if (result.ok) {
        resolve(result)
      }
      else {
        resolve(onError())
      }
    }
    )
  })
}



function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
