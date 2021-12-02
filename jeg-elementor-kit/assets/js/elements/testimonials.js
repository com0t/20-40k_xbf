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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/testimonials.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/testimonials.js":
/*!*********************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/testimonials.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitTestimonials extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-testimonials',\n        items: '.testimonials-track'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $items: this.$element.find(selectors.items)\n    };\n  }\n\n  bindEvents() {\n    this.onLoadElement();\n  }\n\n  onLoadElement() {\n    this.loadCarousel();\n  }\n\n  loadCarousel() {\n    const id = this.elements.$wrapper.data('id'),\n          selectors = this.getSettings('selectors'),\n          options = this.elements.$wrapper.data('settings'),\n          responsive = options.responsive,\n          responsiveAttr = {};\n    let lastBreak = undefined;\n    Object.entries(responsive).forEach(([key, value]) => {\n      if (value.items !== '' || value.margin !== '') {\n        responsiveAttr[value.breakpoint] = {};\n        lastBreak = value.breakpoint;\n\n        if (value.items !== '') {\n          responsiveAttr[value.breakpoint].items = value.items;\n        }\n\n        if (value.margin !== '') {\n          responsiveAttr[value.breakpoint].gutter = value.margin;\n        }\n      }\n    });\n\n    if (lastBreak !== undefined && lastBreak !== 0) {\n      responsiveAttr[0] = responsiveAttr[lastBreak];\n      delete responsiveAttr[lastBreak];\n    }\n\n    const attr = {\n      container: selectors.wrapper + '[data-id=\"' + id + '\"] ' + selectors.items,\n      loop: true,\n      mouseDrag: true,\n      autoplay: options.autoplay,\n      autoplayTimeout: options.autoplay_speed,\n      autoplayHoverPause: options.autoplay_hover_pause,\n      navPosition: 'bottom',\n      controlsPosition: options.arrow_position,\n      controlsText: [options.navigation_left, options.navigation_right],\n      responsiveClass: true,\n      responsive: responsiveAttr\n    };\n    tns(attr);\n    this.elements.$wrapper.find('button[data-action]').remove();\n\n    if (!options.show_navigation) {\n      this.elements.$wrapper.find('.tns-controls').remove();\n    }\n\n    if (!options.show_dots) {\n      this.elements.$wrapper.find('.tns-nav').remove();\n    }\n\n    if (options.show_navigation) {\n      attr.nav = true;\n      attr.navText = ['<i class=\"' + options.navigation_left + '\" aria-hidden=\"true\"></i>', '<i class=\"' + options.navigation_right + '\" aria-hidden=\"true\"></i>'];\n    }\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitTestimonials, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_testimonials.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/testimonials.js?");

/***/ })

/******/ });