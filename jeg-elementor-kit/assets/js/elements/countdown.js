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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/countdown.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/countdown.js":
/*!******************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/countdown.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitCountdown extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-countdown',\n        days: '.timer-container.timer-days',\n        hours: '.timer-container.timer-hours',\n        minutes: '.timer-container.timer-minutes',\n        seconds: '.timer-container.timer-seconds',\n        counts: '.timer-container .timer-count'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $days: this.$element.find(selectors.days),\n      $hours: this.$element.find(selectors.hours),\n      $minutes: this.$element.find(selectors.minutes),\n      $seconds: this.$element.find(selectors.seconds),\n      $counts: this.$element.find(selectors.counts)\n    };\n  }\n\n  bindEvents() {\n    this.onRender();\n  }\n\n  onRender() {\n    const $this = this,\n          date = new Date($this.elements.$wrapper.data('due-date')).getTime();\n    const x = setInterval(function () {\n      const now = new Date(),\n            distance = date - now,\n            days = Math.floor(distance / (1000 * 60 * 60 * 24)),\n            hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),\n            minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)),\n            seconds = Math.floor(distance % (1000 * 60) / 1000);\n      $this.elements.$counts.removeClass('timer-loading');\n\n      if (distance >= 0) {\n        if ($this.elements.$days) {\n          $this.elements.$days.find('.timer-count').text(days);\n        }\n\n        if ($this.elements.$hours) {\n          $this.elements.$hours.find('.timer-count').text(hours);\n        }\n\n        if ($this.elements.$minutes) {\n          $this.elements.$minutes.find('.timer-count').text(minutes);\n        }\n\n        if ($this.elements.$seconds) {\n          $this.elements.$seconds.find('.timer-count').text(seconds);\n        }\n      } else {\n        clearInterval(x);\n        $this.elements.$wrapper.addClass('countdown-expired');\n        $this.onExpired();\n      }\n    }, 1000);\n  }\n\n  onExpired() {\n    const $this = this,\n          wrapper = $this.elements.$wrapper,\n          type = wrapper.data('expired-type');\n\n    if (type == 'message') {\n      const title = wrapper.data('expired-title'),\n            content = wrapper.data('expired-content');\n      wrapper.html(`\n        <div class=\"expire-message\">\n          <span class=\"expire-title\">${title}</span>\n          <span class=\"expire-content\">${content}</span>\n        </div>\n      `);\n    } else if (type == 'redirect') {\n      const link = wrapper.data('redirect-link');\n\n      if (window.self !== window.top) {\n        wrapper.html(`<div class=\"expire-message\">\n            <span class=\"expire-content\">${iframe_content}</span>\n          </div>\n        `);\n      } else {\n        location.href = link;\n      }\n    } else if (type == 'template') {\n      const template = wrapper.data('template');\n      wrapper.html(template);\n    }\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitCountdown, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_countdown.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/countdown.js?");

/***/ })

/******/ });