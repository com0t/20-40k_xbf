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
/******/ 	return __webpack_require__(__webpack_require__.s = "./jeg-elementor-kit/assets/dev/js/gallery.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jeg-elementor-kit/assets/dev/js/gallery.js":
/*!****************************************************!*\
  !*** ./jeg-elementor-kit/assets/dev/js/gallery.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class JKitGallery extends elementorModules.frontend.handlers.Base {\n  getDefaultSettings() {\n    return {\n      selectors: {\n        wrapper: '.jeg-elementor-kit.jkit-gallery',\n        grid: '.gallery-items',\n        active_label: '.jkit-gallery-control.active',\n        filter: '.jkit-gallery-control',\n        filter_button: '#search-filter-trigger',\n        filter_label: '#search-filter-trigger span',\n        filter_list: '.search-filter-controls',\n        filter_form: '#jkit-gallery-search-box-input',\n        load_more: '.jkit-gallery-load-more'\n      }\n    };\n  }\n\n  getDefaultElements() {\n    const selectors = this.getSettings('selectors');\n    return {\n      $wrapper: this.$element.find(selectors.wrapper),\n      $grid: this.$element.find(selectors.grid),\n      $active_label: this.$element.find(selectors.active_label),\n      $filter: this.$element.find(selectors.filter),\n      $filter_button: this.$element.find(selectors.filter_button),\n      $filter_label: this.$element.find(selectors.filter_label),\n      $filter_list: this.$element.find(selectors.filter_list),\n      $filter_form: this.$element.find(selectors.filter_form),\n      $load_more: this.$element.find(selectors.load_more)\n    };\n  }\n\n  bindEvents() {\n    const $this = this,\n          layout = $this.elements.$wrapper.data('grid') == 'masonry' ? 'masonry' : 'fitRows',\n          duration = parseFloat(($this.elements.$wrapper.data('animation-duration') / 1000).toFixed(2)).toString() + 's';\n    $this.grid = $this.elements.$grid.isotope({\n      itemSelector: '.gallery-item-wrap',\n      layoutMode: layout,\n      transitionDuration: duration\n    });\n    $this.grid.imagesLoaded().progress(function () {\n      $this.grid.isotope('layout');\n    });\n    $this.onInitGallery();\n    $this.onClickFilterButton();\n    $this.onClickLoadMoreButton();\n    $this.onFormChange();\n  }\n\n  onInitGallery() {\n    const $this = this;\n    $this.elements.$filter.each(function () {\n      jQuery(this).on('click', function (e) {\n        e.preventDefault();\n        const selectors = $this.getSettings('selectors'),\n              filter_value = jQuery(this).data('filter'),\n              filter_label = $this.elements.$filter_label,\n              filter_list = $this.elements.$filter_list,\n              filter_button = $this.elements.$filter_button,\n              filter_form = $this.elements.$filter_form,\n              filter = $this.elements.$filter;\n        filter.removeClass('active');\n        jQuery(this).addClass('active');\n        $this.elements.$active_label = $this.$element.find(selectors.active_label);\n        $this.grid.isotope({\n          filter: function () {\n            const class_filter = filter_value !== '*' ? filter_value.substring(1) : '*',\n                  class_list = jQuery(this).attr('class').split(/\\s+/);\n            let check_filter = false;\n\n            if (filter_button.length > 0) {\n              const text = filter_form.val(),\n                    name = jQuery(this).find('.item-title').text(),\n                    content = jQuery(this).find('.item-content').text();\n              check_filter = class_filter != '*' ? (name.toLowerCase().includes(text.toLowerCase()) || content.toLowerCase().includes(text.toLowerCase())) && class_list.includes(class_filter) : name.toLowerCase().includes(text.toLowerCase()) || content.toLowerCase().includes(text.toLowerCase());\n            } else {\n              check_filter = class_filter != '*' ? class_list.includes(class_filter) : true;\n            }\n\n            return check_filter;\n          }\n        });\n\n        if (filter_button.length > 0) {\n          filter_label.text(jQuery(this).text());\n          filter_list.removeClass('open-controls');\n        }\n      });\n    });\n  }\n\n  onClickFilterButton() {\n    const $this = this;\n    $this.elements.$filter_button.on('click', function (e) {\n      e.preventDefault();\n      const filter_list = $this.elements.$filter_list;\n\n      if (filter_list.hasClass('open-controls')) {\n        filter_list.removeClass('open-controls');\n      } else {\n        filter_list.addClass('open-controls');\n      }\n    });\n  }\n\n  onFormChange() {\n    const $this = this,\n          filter_form = $this.elements.$filter_form;\n\n    if (filter_form !== undefined) {\n      filter_form.on('change paste keyup', function () {\n        const text = jQuery(this).val();\n        $this.grid.isotope({\n          filter: function () {\n            const name = jQuery(this).find('.item-title').text(),\n                  content = jQuery(this).find('.item-content').text(),\n                  class_list = jQuery(this).attr('class').split(/\\s+/),\n                  class_filter = $this.elements.$active_label.data('filter') !== '*' ? $this.elements.$active_label.data('filter').substring(1) : '*';\n            let check_filter = false;\n\n            if (class_filter == '*') {\n              check_filter = name.toLowerCase().includes(text.toLowerCase()) || content.toLowerCase().includes(text.toLowerCase());\n            } else {\n              check_filter = (name.toLowerCase().includes(text.toLowerCase()) || content.toLowerCase().includes(text.toLowerCase())) && class_list.includes(class_filter);\n            }\n\n            return check_filter;\n          }\n        });\n      });\n    }\n  }\n\n  onClickLoadMoreButton() {\n    const $this = this,\n          items = $this.elements.$wrapper.data('items');\n    $this.elements.$load_more.on('click', function (e) {\n      e.preventDefault();\n      const current_loaded = parseInt($this.elements.$wrapper.attr('data-current-loaded')),\n            count_items = parseInt($this.elements.$wrapper.attr('data-count-items')),\n            load_more = parseInt($this.elements.$wrapper.attr('data-load-more')),\n            no_more_text = $this.elements.$wrapper.attr('data-no-more');\n\n      if (count_items > current_loaded) {\n        if (count_items - load_more - current_loaded > 0) {\n          const items_append = [...items].splice(current_loaded, load_more);\n          $this.grid.append(items_append).isotope('reloadItems').isotope();\n          $this.grid.imagesLoaded().progress(function () {\n            $this.grid.isotope('layout');\n          });\n          $this.elements.$wrapper.attr('data-current-loaded', current_loaded + load_more);\n        } else {\n          const items_append = [...items].splice(current_loaded, count_items - current_loaded);\n          $this.grid.append(items_append).isotope('reloadItems').isotope();\n          $this.grid.imagesLoaded().progress(function () {\n            $this.grid.isotope('layout');\n          });\n          $this.elements.$wrapper.attr('data-current-loaded', count_items);\n          $this.elements.$load_more.find('.load-more-text').text(no_more_text);\n          setTimeout(function () {\n            $this.elements.$load_more.fadeOut('slow');\n          }, 600);\n        }\n      }\n    });\n  }\n\n}\n\njQuery(window).on('elementor/frontend/init', () => {\n  const addHandler = $element => {\n    elementorFrontend.elementsHandler.addHandler(JKitGallery, {\n      $element\n    });\n  };\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/jkit_gallery.default', addHandler);\n});\n\n//# sourceURL=webpack:///./jeg-elementor-kit/assets/dev/js/gallery.js?");

/***/ })

/******/ });