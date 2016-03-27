// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
* Get the current URL.
*
* @param {function(string)} callback - called when the URL of the current tab
*   is found.
*/
$(document).ready(function(){
  $(".dropdown-button").dropdown();
}); //Activates Dropdown
function goToUrl(urls){
  console.log(urls);
  chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = urls;
    chrome.tabs.create({ url: newURL });
  });
}
function getCurrentTabUrl(callback) {

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
//This function handles adding to a dictionary and checks if already
//already inside the dictionary.
function addToDictionaryStorage(url) {

  chrome.storage.sync.get(null,function(items){
    if(jQuery.isEmptyObject(items)){
      console.log("empty of items");
      var arr = [];      
      chrome.storage.sync.set({"data": arr});
    }

    chrome.storage.sync.get("data",function(arr){
      if(jQuery.inArray(url,arr["data"]) == -1){
        console.log(arr["data"]);
        console.log(url);
        console.log("addagain");
        arr["data"].push(url);
        chrome.storage.sync.set({"data":arr["data"]});
      }
    });
  });
}


function getFromDictonaryStorage(){  
  chrome.storage.sync.get(null,function(items){
    if(jQuery.isEmptyObject(items) == false){
      chrome.storage.sync.get("data",function(arr){
        var dataElem = arr["data"];
        var dropd = document.getElementById('collectionID');
        dropd.innerHTML = "";
        //Lines 71-81 make the prevoius links added and update the view if clicked.
        for(var i = 0; i < arr["data"].length;i++){
          console.log(i);
          dropd.innerHTML += "<li><button id="+i+" class=previousLinks>"+dataElem[i]+"</button></li>";
        } var cell =document.querySelectorAll('.previousLinks');
        for(var i=0;i<cell.length;i++){
          cell[i].addEventListener('click',function(e){
            updateInner(e.target.innerHTML);
          }
          ,false);
        }




      });
    }
  });

}

function updateInner(url){  
  addToDictionaryStorage(url);
  getFromDictonaryStorage();
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
    summary["sentences"].sort(function(a,b){
      var weightA = a["totalScore"];
      var weightB = b["totalScore"];
      if(weightA>weightB){
        return -1;
      }else if(weightA<weightB){
        return 1;
      }else{
        return 0;
      }
    });
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
   list.innerHTML+="<li><a id=gotoart class="+"gotoart"+" href="+url+">Go to Article!</a></li>";
 }else{
  console.log("fuck");
  list.innerHTML +="<div class=row><li>Something went wrong!</li></div><br>"
}
        //This part makes the links open a new tab
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
          var ln = links[i];
          var location = ln.href;
          console.log(ln + location);
          ln.addEventListener('click',function () {
            chrome.tabs.create({active: true, url: location});
          });
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
  $(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
  document.getElementById("clear").addEventListener('click',function(){
    chrome.storage.sync.clear();
    getCurrentTabUrl(function(url){
      updateInner(url);
    });
    getFromDictonaryStorage();
  },false);
}




document.addEventListener('DOMContentLoaded', updateExtension);

//If you want to change what is displayed call updaeInner with
//url of what you want.