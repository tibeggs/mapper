function fill_crags(subjectObject) {
    var subjectSel = document.getElementById("cragjump");
    subjectObject.forEach((value, key) => {
      subjectSel.options[parseInt(key)+1] = new Option(value.crag, value.lnglat);
    })
    subjectSel.onchange = function () {
      //empty Chapters- and Topics- dropdowns
      //   chapterSel.length = 1;
      //display correct values
      change_map_view(subjectSel.value.split(","))
      // request_weather(arr, subjectSel.value);
    }
  }

  function fill_sub_crags(subjectObject, subarr, subarrtoget, FeatureMap) {
    var subjectSel = document.getElementById("addcrag");
    subjectObject.forEach((value, key) => {
      let label = value.overcrag + " - " + value.crag;
      subjectSel.options[parseInt(key)] = new Option(label, key);
    })
    subjectSel.onchange = function () {
      console.log(subarrtoget);
      subarrtoget.forEach(arr => {
        console.log(arr.value.lnglat.toString());
        remove_feature(arr.value.lnglat.toString(), FeatureMap)
      })
      let keys = $('.addcrag').val();
      subarrtoget = subarr.filter(function (subcrag) {
  
        let num = subcrag.key
        return keys.includes(num.toString());
      });
      console.log(subarrtoget);
      // request_weather(subarrtoget, subjectSel.value);
    }
  }
  
  function remove_feature(lonlatstr, FeatureMap) {
    return new Promise((resolve, reject) => {
      if (FeatureMap.has(lonlatstr)) {
        vectorSource.removeFeature(FeatureMap.get(lonlatstr))
        FeatureMap.delete(lonlatstr);
        resolve();
      }
    }
    )
  }

  export {fill_crags,fill_sub_crags}