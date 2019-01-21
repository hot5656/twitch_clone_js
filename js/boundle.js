/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var clientId = 'qvtuq71csrlv5ipxo1ljzgbzqn1okh';
var limitItem = 21;
var offset = 0;
var apiUrl;
var isLoad = false;
var isLoadLastItem = false;
var liveCounter = 0;
var languageType = "en"; // webpack

var i18n = {
  en: __webpack_require__(1),
  'zh-tw': __webpack_require__(2)
};

window.onload = function () {
  queryLive(procesLiveInfo);
};

document.querySelector(".lang_en").onclick = function () {
  language("en");
};

document.querySelector(".lang_tw").onclick = function () {
  language("zh-tw");
};

window.addEventListener('scroll', function (e) {
  var documentBodyScrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
  var body = document.body;
  var html = document.documentElement;
  var documentHeight = Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);

  if (documentBodyScrollTop + window.innerHeight + 200 >= documentHeight) {
    if (liveCounter < limitItem) isLoadLastItem = true;

    if (isLoad && !isLoadLastItem) {
      isLoad = false;
      offset += limitItem;
      queryLive(procesLiveInfo);
      console.log("offset = " + offset);
    }
  }
});

function newAjax() {
  var ajax;

  if (window.XMLHttpRequest) {
    // this is for IE 7+, Chrome, Safri and fireFox
    ajax = new XMLHttpRequest();
  } else {
    // this is for IE6 and IE 5
    ajax = new ActiveXobjext("Microsoft.XMLHTTP");
  }

  return ajax;
}

function queryLive(cb) {
  var ajaxHandler = newAjax();
  apiUrl = "https://api.twitch.tv/kraken/streams/?client_id=" + clientId + "&language=" + languageType + "&game=League%20of%20Legends&limit=" + limitItem + "&offset=" + offset;

  ajaxHandler.onreadystatechange = function () {
    if (ajaxHandler.readyState == 4 && ajaxHandler.status == 200) {
      // json to object
      var respData = JSON.parse(ajaxHandler.responseText);
      console.log(respData);
      isLoad = true;
      cb(null, respData);
    }
  };

  ajaxHandler.open("get", apiUrl, true);
  ajaxHandler.send();
}

function procesLiveInfo(err, data) {
  if (err) {
    console.log(err);
  } else {
    var streams = data.streams;
    var row = document.querySelectorAll('.row');
    liveCounter = streams.length;

    for (var i = 0; i < streams.length; i++) {
      row[0].insertAdjacentHTML('beforeend', getColumn(streams[i]));
    }
  }
}

function getColumn(data) {
  return "\n\t<div class=\"col\">\n\t\t<div class=\"preview\">\n\t\t\t<img src=\"".concat(data.preview.large, "\" onload=\"this.style.opacity=1\" alt=\"\">\n\t\t</div>\n\t\t<div class=\"descript\">\n\t\t\t<div class=\"avatar\">\n\t\t\t\t<img src=\"").concat(data.channel.logo, "\"  onload=\"this.style.opacity=1\" alt=\"\">\n\t\t\t</div>\n\t\t\t<div class=\"introduce\">\n\t\t\t\t<div class=\"ch-name\">").concat(data.channel.status, "</div>\n\t\t\t\t<div class=\"ch-master\">").concat(data.channel.name, "</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t");
}

function language(lang) {
  if (lang !== languageType) {
    var col = document.querySelectorAll('.col');

    for (var i = 0; i < col.length; i++) {
      col[i].remove();
    } // add i18n
    // not webpack
    // document.querySelector(".head h1").textContent = window.i18n[lang].title;
    // webpack


    document.querySelector(".head h1").textContent = i18n[lang].title;
    languageType = lang;
    offset = 0;
    queryLive(procesLiveInfo);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// add i18n
// not webpack
// if (!window.i18n) window.i18n = {};
// window.i18n['en'] = {
//   title: 'The streams in English'
// }
// webpack
module.exports = {
  title: 'The streams in English'
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// add i18n
// not webpack
// if (!window.i18n) window.i18n = {};
// window.i18n['zh-tw'] = {
//   title: '用中文直播的頻道'
// }
// webpack
module.exports = {
  title: '用中文直播的頻道'
};

/***/ })
/******/ ]);