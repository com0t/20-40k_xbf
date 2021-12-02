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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/pie-chart.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/pie-chart.js":
/*!******************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/pie-chart.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitPieChart extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-pie-chart',\n        canvas_main: 'canvas.main-canvas',\n        canvas_bg: 'canvas.background-canvas',\n        number: '.pie-chart-content'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $canvas_main: this.$element.find(selectors.canvas_main),\n      $canvas_bg: this.$element.find(selectors.canvas_bg),\n      $number: this.$element.find(selectors.number)\n    };\n  }\n\n  bindEvents() {\n    this.animateChart();\n    jQuery(window).on('scroll', this.animateChart.bind(this));\n\n    if (this.elements.$wrapper.data('content-type') == 'percentage') {\n      this.countNumber();\n      jQuery(window).on('scroll', this.countNumber.bind(this));\n    }\n  }\n\n  animateChart() {\n    const $this = this,\n          canvas_main = $this.elements.$canvas_main,\n          canvas_bg = $this.elements.$canvas_bg;\n\n    if (this.onScreen() && !canvas_main.hasClass('loaded')) {\n      const wrapper = $this.elements.$wrapper,\n            ctx_main = canvas_main.get(0).getContext('2d'),\n            ctx_bg = canvas_bg.get(0).getContext('2d'),\n            percent = wrapper.data('percent'),\n            cutout = wrapper.data('cutout'),\n            color_type = wrapper.data('color-type'),\n            color = wrapper.data('color'),\n            bg_color = wrapper.data('bg-color'),\n            gradient1 = wrapper.data('gradient1'),\n            gradient2 = wrapper.data('gradient2'),\n            animation_duration = wrapper.data('animation-duration'),\n            data_main = {\n        datasets: [{\n          data: [percent, 100 - percent],\n          backgroundColor: [\"#80b1ff\", 'transparent'],\n          hoverBackgroundColor: [\"#80b1ff\", 'transparent'],\n          borderWidth: 0\n        }]\n      },\n            data_bg = {\n        datasets: [{\n          data: [100],\n          backgroundColor: [\"#d1d1d1\"],\n          hoverBackgroundColor: [\"#d1d1d1\"],\n          borderWidth: 0\n        }]\n      },\n            options_main = {\n        animation: {\n          duration: animation_duration\n        },\n        responsive: true,\n        cutoutPercentage: cutout,\n        title: {\n          display: false\n        },\n        legend: {\n          display: false\n        },\n        tooltips: {\n          enabled: false\n        }\n      },\n            options_bg = {\n        animation: false,\n        responsive: true,\n        cutoutPercentage: cutout,\n        title: {\n          display: false\n        },\n        legend: {\n          display: false\n        },\n        tooltips: {\n          enabled: false\n        }\n      };\n\n      if (color_type == 'normal') {\n        if (color !== '') {\n          data_main.datasets[0].backgroundColor[0] = color;\n          data_main.datasets[0].hoverBackgroundColor[0] = color;\n        }\n      } else if (color_type == 'gradient' && (gradient1 !== '' || gradient2 !== '')) {\n        const gradientFill = ctx_main.createLinearGradient(0, 0, 0, 170);\n\n        if (gradient1 !== '') {\n          gradientFill.addColorStop(0, gradient1);\n        }\n\n        if (gradient2 !== '') {\n          gradientFill.addColorStop(1, gradient2);\n        }\n\n        data_main.datasets[0].backgroundColor[0] = gradientFill;\n        data_main.datasets[0].hoverBackgroundColor[0] = gradientFill;\n      }\n\n      if (bg_color !== '') {\n        data_bg.datasets[0].backgroundColor[0] = bg_color;\n        data_bg.datasets[0].hoverBackgroundColor[0] = bg_color;\n      }\n\n      new Chart(ctx_main, {\n        type: 'doughnut',\n        data: data_main,\n        options: options_main\n      });\n      new Chart(ctx_bg, {\n        type: 'doughnut',\n        data: data_bg,\n        options: options_bg\n      });\n      canvas_main.addClass('loaded');\n      canvas_main.css('display', '');\n      canvas_bg.css('display', '');\n    }\n  }\n\n  countNumber() {\n    const number = this.elements.$number,\n          wrapper = this.elements.$wrapper;\n\n    if (this.onScreen() && !number.hasClass('loaded')) {\n      number.prop('Counter', 0).animate({\n        Counter: wrapper.data('percent')\n      }, {\n        duration: wrapper.data('animation-duration'),\n        easing: 'swing',\n        step: function (now) {\n          number.text(Math.ceil(now).toString() + '%');\n        }\n      });\n      number.addClass('loaded');\n    }\n  }\n\n  onScreen() {\n    const windowBottomEdge = jQuery(window).scrollTop() + jQuery(window).height(),\n          elementTopEdge = this.elements.$wrapper.offset().top;\n    return elementTopEdge <= windowBottomEdge;\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitPieChart, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_pie_chart.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/pie-chart.js?");

/***/ })

/******/ });