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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/portfolio-gallery.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/portfolio-gallery.js":
/*!**************************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/portfolio-gallery.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitPortfolioGallery extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-portfolio-gallery',\n        row_items: '.row-item',\n        gallery_items: '.gallery-items',\n        image_items: '.image-item'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $row_items: this.$element.find(selectors.row_items),\n      $gallery_items: this.$element.find(selectors.gallery_items),\n      $image_items: this.$element.find(selectors.image_items)\n    };\n  }\n\n  bindEvents() {\n    this.onRenderInit();\n    this.onClickHover();\n  }\n\n  onRenderInit() {\n    const $this = this,\n          row_items = $this.elements.$row_items,\n          image_items = $this.elements.$image_items;\n    jQuery(row_items.get().reverse()).each(function () {\n      if (jQuery(this).hasClass('current-item')) {\n        row_items.removeClass('current-item');\n        jQuery(this).addClass('current-item');\n      }\n    });\n    jQuery(image_items.get().reverse()).each(function () {\n      if (jQuery(this).hasClass('current-item')) {\n        image_items.removeClass('current-item');\n        jQuery(this).addClass('current-item');\n      }\n    });\n  }\n\n  onClickHover() {\n    const $this = this,\n          wrapper = $this.elements.$wrapper,\n          row_items = $this.elements.$row_items;\n\n    if (wrapper.hasClass('on-click')) {\n      row_items.each(function () {\n        jQuery(this).on({\n          click: function () {\n            row_items.removeClass('current-item');\n            jQuery(this).addClass('current-item');\n            $this.onShowImage(jQuery(this).data('tab'));\n          }\n        });\n      });\n    }\n\n    if (wrapper.hasClass('on-hover')) {\n      row_items.each(function () {\n        jQuery(this).on({\n          mouseenter: function () {\n            row_items.removeClass('current-item');\n            jQuery(this).addClass('current-item');\n            $this.onShowImage(jQuery(this).data('tab'));\n          }\n        });\n      });\n    }\n  }\n\n  onShowImage(id) {\n    this.elements.$image_items.removeClass('current-item');\n    this.elements.$gallery_items.find('#' + id).addClass('current-item');\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitPortfolioGallery, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_portfolio_gallery.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/portfolio-gallery.js?");

/***/ })

/******/ });