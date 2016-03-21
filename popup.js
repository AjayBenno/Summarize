// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
* Get the current URL.
*
* @param {function(string)} callback - called when the URL of the current tab
*   is found.
*/
function getCurrentTabUrl(callback) {
// Query filter to be passed to chrome.tabs.query - see
// https://developer.chrome.com/extensions/tabs#method-query
var queryInfo = {
  active: true,
  currentWindow: true
};

chrome.tabs.query(queryInfo, function(tabs) {
  
  var tab = tabs[0];
  var url = tab.url;
  console.assert(typeof url == 'string', 'tab.url should be a string');
  console.log(url);
  callback(url);
});
}
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

/* Using Diffbot and Aylien
document.addEventListener('DOMContentLoaded', function() {
getCurrentTabUrl(function(url) {
  // Put the image URL in Google search.
  var res = new XMLHttpRequest();
  

  var text="";
  var title="";

  var diffBot = new XMLHttpRequest();
  var diffBotUrl = "https://diffbot-diffbot.p.mashape.com/v2/article?token=f82fd0a7be83f7669a31221df46f35dd&fields=text%2Ctitle&timeout=15000&url="+url;

  diffBot.open("GET",diffBotUrl);
  diffBot.onreadystatechange=function() {
    if(diffBot.readyState==4){
      var diffBotReturnObj = JSON.parse(diffBot.responseText);
      text = diffBotReturnObj["text"];
      title= diffBotReturnObj["title"];
      var newurl = 'https://api.aylien.com/api/v1/summarize?text='+text+'&title='+title; 
      res.open("GET", newurl);
      res.setRequestHeader('Accept','application/json');
      res.setRequestHeader('X-AYLIEN-TextAPI-Application-Key','4c08897c91044cccf31d6a5aa4291036');
      res.setRequestHeader('X-AYLIEN-TextAPI-Application-ID','876cb926');
      res.send();
    }
    
  };
  diffBot.setRequestHeader("Accept","application/json");
  diffBot.setRequestHeader("X-Mashape-Key", "yUGG18jZvUmshueA2PQVlnWHLcZCp1yKcS8jsn0xolpDUTYf1i");   
  diffBot.send();
  res.onreadystatechange=function() {
   if (res.readyState == 4) {
    console.log(text);
    console.log(title);
    var stuff = document.getElementById('stuff');
      var string = JSON.parse(res.responseText);//JSON.stringify(res.responseText);
      for(var i = 0;i<string["sentences"].length;i++){
        console.log(string["sentences"][i]);

      }
     // console.log(string["sentences"]);
     stuff.innerHTML = string["sentences"];
   }
   else{
    console.log(res.status);
  }
};
  
});
});*///change to use sentisum but only 50 calls per day so that sucks.


function updateInner(url){
  var ttURL = 'http://textteaser.com/'
  var summary = ''
  console.log('Summarizing this url: ' + url);
  //This calls the api and displays the results in a list.
  $.get(ttURL + "summary", {url: url, output: "json"}, "json")
  .done(function(data) {
    console.log("done");
    var stuff = document.getElementById('stuff');
    var dataElem = document.getElementById('data');
    dataElem.innerHTML="<ol id=list></ol>"
    var list  = document.getElementById('list');
    
    summary = data;
    console.log(summary);
  //  display();
  if(summary["sentences"].length > 0){
    if(summary["sentences"].length <5){
      for(var i = 0;i<summary["sentences"].length;i++){
        list.innerHTML += "<li>"+summary["sentences"][i]["sentence"]+"</li><br>"
        console.log(summary["sentences"][i]["sentence"])
      }
    }else{
      for(var i = 0;i<5;i++){
       list.innerHTML += "<li>"+summary["sentences"][i]["sentence"]+"</li><br>"
       console.log(summary["sentences"][i]["sentence"])
     }
   }
 }else{
  console.log("fuck");
  list.innerHTML +="<div class=row><li>Something went wrong!</li></div><br>"
}

})
  .fail(function(data) {
    if (data.responseJSON == null) {
      $('#init').empty();
      $('#init').append('Something wrong happened. Please try again later.');
    }
    else {
      console.log(data.responseJSON.error);
      $('#init').empty();
      $('#init').append(data.responseJSON.error);
    }     
  });  
}
function updateExtension(){
  getCurrentTabUrl(function(url){
    updateInner(url);
  });
}
document.addEventListener('DOMContentLoaded', updateExtension);
//If you want to change what is displayed call updateInner with
//url of what you want.