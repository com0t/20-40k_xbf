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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/video-button.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/video-button.js":
/*!*********************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/video-button.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitVideoButton extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-video-button',\n        link: '.jeg-elementor-kit.jkit-video-button .jkit-video-popup-btn'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $link: this.$element.find(selectors.link)\n    };\n  }\n\n  bindEvents() {\n    this.onClick();\n  }\n\n  onClick() {\n    const wrapper = this.elements.$wrapper,\n          type = wrapper.data('type'),\n          autoplay = wrapper.data('autoplay'),\n          loop = wrapper.data('loop'),\n          controls = wrapper.data('controls');\n    let src = '//www.youtube.com/embed/';\n\n    if ('youtube' == type) {\n      const start = wrapper.data('start'),\n            end = wrapper.data('end');\n      src = src + '?playlist=%id%&autoplay=' + autoplay + '&loop=' + loop + '&controls=' + controls + '&start=' + start + '&end=' + end + '&version=3';\n    } else {\n      const mute = wrapper.data('mute'),\n            title = wrapper.data('title'),\n            portrait = wrapper.data('portrait'),\n            byline = wrapper.data('byline');\n      src = '//player.vimeo.com/video/%id%?autoplay=' + autoplay + '&muted=' + mute + '&loop=' + loop + '&controls=' + controls + '&title=' + title + '&portrait=' + portrait + '&byline=' + byline;\n    }\n\n    this.elements.$link.magnificPopup({\n      type: 'iframe',\n      iframe: {\n        patterns: {\n          youtube: {\n            index: 'youtube.com/',\n            id: function (url) {\n              var m = url.match(/[\\\\?\\\\&]v=([^\\\\?\\\\&]+)/);\n              if (!m || !m[1]) return null;\n              return m[1];\n            },\n            src: src\n          },\n          vimeo: {\n            index: 'vimeo.com/',\n            id: function (url) {\n              var m = url.match(/(https?:\\/\\/)?(www.)?(player.)?vimeo.com\\/([a-z]*\\/)*([0-9]{6,11})[?]?.*/);\n              if (!m || !m[5]) return null;\n              return m[5];\n            },\n            src: src\n          }\n        }\n      },\n      mainClass: 'mfp-fade jkit-magnific-popup',\n      removalDelay: 160,\n      preloader: !0,\n      fixedContentPos: !1,\n      showCloseBtn: true\n    });\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitVideoButton, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_video_button.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/video-button.js?");

/***/ })

/******/ });