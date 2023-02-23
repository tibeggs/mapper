import {get_current_periods} from "./get_weather.js"
import { call_coords } from "./main.js";

const coords = [[38.94656, -78.30231], [38.81352, -79.28219], [38.8338, -79.3663]]

// var subjectObject = get_current_periods()
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
      call_coords(coords, subjectSel.value);
    }
}

)
//   window.onload = function() {
//     var subjectSel = document.getElementById("subject");
//     var topicSel = document.getElementById("topic");
//     var chapterSel = document.getElementById("chapter");
//     for (var x in subjectObject) {
//       subjectSel.options[subjectSel.options.length] = new Option(x,x);
//     }
//     subjectSel.onchange = function() {
//       //empty Chapters- and Topics- dropdowns
//     //   chapterSel.length = 1;
//       //display correct values
//       get_current_periods()
//     }
//   }