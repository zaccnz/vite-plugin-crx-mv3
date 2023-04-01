"use strict";

// src/constants.ts
var RELOAD = "RELOAD";

// src/client/background.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg == RELOAD) {
    chrome.runtime.reload();
    sendResponse();
  }
});
