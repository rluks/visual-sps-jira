// ==UserScript==
// @name         InjectVisualStoryPoints
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add visual representation of story points into the story points dialogue window
// @author       rluks
// @match        https://issues.redhat.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

'use strict';

// Select the node that will be observed for mutations
const targetNode = document.getElementById('jira');

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach( (node) => {
               if(node.id === 'modal-field-view'){
                   node.childNodes.forEach((childNode) => {
                       if(childNode.className === 'jira-dialog-heading'){
                           if(childNode.textContent.includes("Edit Story Points for")){
                               //console.log("It's a dialogue window for editing story points!");
                               //console.log(childNode);
                               InjectStoryPoints(node, childNode);
                           }
                       }
                   });
               }
            });
        }
    }
};

function InjectStoryPoints(node, headingNode){

  let mouseSP = 1;
  let catSP = 2;
  let dogSP = 5;

  console.log(node);
  var inputEl = node.getElementsByTagName("input")[0];

  var containerEL = document.createElement("div");
  containerEL.setAttribute("id", "visual-sps-jira");
  containerEL.style.width = '100%';
  containerEL.style.textAlign = 'center';

  headingNode.parentNode.insertBefore(containerEL, headingNode.nextSibling);

  var small = document.createElement("button");
  var smallTxt = document.createTextNode("mouse 🐭 (" + mouseSP + ")");
  small.style.fontSize = "medium";
  small.appendChild(smallTxt);
  small.onclick = function () {
      inputEl.value = mouseSP;
  };
  document.getElementById("visual-sps-jira").appendChild(small);

  var medium = document.createElement("button");
  var mediumTxt = document.createTextNode("cat 🐱(" + catSP + ")");
  medium.style.fontSize = "large";
  medium.appendChild(mediumTxt);
  medium.onclick = function () {
      inputEl.value = catSP;
  };
  document.getElementById("visual-sps-jira").appendChild(medium);

  var big = document.createElement("button");
  var bigTxt = document.createTextNode("dog 🐶(" + dogSP + ")");
  big.style.fontSize = "xx-large";
  big.appendChild(bigTxt);
  big.onclick = function () {
      inputEl.value = dogSP;
      //TODO highlight input field
  };
  document.getElementById("visual-sps-jira").appendChild(big);
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);




