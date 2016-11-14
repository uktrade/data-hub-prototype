'use strict';

function getUrlVars() {
  var url = window.location.href;
  var hash;
  var myJson = {};
  var hashes = url.slice(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    myJson[hash[0]] = hash[1];
  }
  return myJson;
}

export function getQueryParam(param) {
  let params = getUrlVars();
  return params[param];
}


