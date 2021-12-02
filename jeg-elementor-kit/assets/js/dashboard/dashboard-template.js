(function ($, api) {
  'use strict'
  /**
   * Global JKit Dashboard instance
   */
  window.ampdashboard = {}

  /**
   * Builder Holder
   */
  api.builderholder = new api.Values({ defaultConstructor: api.JKitOptionBuilder })

  /**
   * JKit Popup
   */
  api.JKitPopup = api.Class.extend({
    /**
     * Loaded
     */
    loaded: false,
    /**
     * ID of this item
     */
    id: 'popup',

    /**
     * Body
     */
    body: $('body'),

    /**
     * Container that hold option
     */
    popupContainer: null,

    /**
     * Parent Container
     */
    parentContainer: null,

    /**
     * Initialize
     */
    initialize: function (parentContainer) {
      if (!this.loaded) {
        this.parentContainer = parentContainer
        this.createButton = this.parentContainer.find('.create-element-button')
        this.createPopupContainer = $('.create-element-builder-wrapper')
        this.createPopupOverlay = $('.create-element-builder-overlay')

        this.setupPopup()
        this.loaded = true
      }
    },

    /**
     * Setup Popup
     */
    setupPopup: function () {
      this.prepareContainer()
      this.attachEvent()
    },

    /**
     * Prepare Container
     */
    prepareContainer: function () {
      this.createPopupContainer.append(this.popupContent())
      this.popupContainer = $('.popup-content')
    },

    /**
     * Container Content
     */
    containerContent: function () {
      api.builderholder.add(this.id, new api.JKitOptionBuilder(this.id, this.changeTabToField(), this.popupContainer))
      api.builderholder(this.id).triggerFinish()
    },

    /**
     * Change tab to field
     */
    changeTabToField: function () {
      var result = []
      _.each(JKitTemplateConfig.tab, function (data) {
        if ('single' === data.type) {
          data.fields = data.default
        }

        result.push(data)
      })

      return result
    },

    /**
     * Dashboard Content
     */
    popupContent: function () {
      var template = wp.template('jkit-popup')

      return $(template({
        lang: JKitTemplateConfig.lang,
      }))
    },

    /**
     * Render Option
     */
    renderOption () {
      this.containerContent()
      this.resetPosition()
    },

    /**
     * calculate Box size
     */
    resetPosition: function () {
      var wh = $(window).height()
      var ww = $(window).width()

      var maxWidth = 600
      var maxHeight = 700

      var width = Math.floor(80 * ww / 100)
      width = (width > maxWidth) ? maxWidth : width

      var height = Math.floor(80 * wh / 100)
      height = (height > maxHeight) ? maxHeight : height

      var left = (ww - width) / 2
      var top = (wh - height) / 2

      this.createPopupContainer.css({
        width: width,
        height: height,
        top: top,
        left: left,
      })

      this.createPopupContainer.find('.popup-content').css({
        height: height - 150,
      })
    },

    /**
     * Attach event
     */
    attachEvent: function () {
      // create button clicked
      this.createButton.click(this.openCreatePopup.bind(this))

      // attach close event
      this.createPopupContainer.find('.close').click(this.hideCreatePopup.bind(this))

      // attach close event
      this.createPopupContainer.find('.generate').click(this.createElement.bind(this))

      // Draggable handler
      this.createPopupContainer.draggable({ handle: '.popup-header' })
    },

    /**
     * Attach Open Button
     */
    attachOpenButton: function () {
      // create button clicked
      this.parentContainer.find('.create-element-button').click(this.openCreatePopup.bind(this))
    },

    /**
     * Create Header
     */
    createElement: function () {
      this.createPopupContainer.find('.generate').text(JKitTemplateConfig.lang.saving)

      this.ajaxCreateElement().done(function (response) {
        ampdashboard.reRenderWrapper(response)
        this.hideCreatePopup()
      }.bind(this))
    },

    /**
     * Get Values
     *
     * @returns {{}}
     */
    getValues: function () {
      var values = {}
      api.builderholder(this.id).containerHolder.each(function (data) {
        values[data.id] = data.getValues()
      })
      return values
    },

    /**
     * Create Header
     *
     * @returns {*|$.promise}
     */
    ajaxCreateElement: function () {
      return wp.ajax.send('jkit_create_element', {
        data: {
          data: this.getValues(),
          nonce: JKitTemplateConfig.nonce,
          type: JKitTemplateConfig.type
        },
      })
    },

    /**
     * Open Create Popup
     */
    openCreatePopup: function () {
      // remove option if already created
      if (api.builderholder(this.id)) {
        api.builderholder.remove(this.id)
      }

      this.popupContainer.html('')
      this.resetPosition()
      this.body.addClass('overflow-hidden')
      this.createPopupContainer.find('.generate').text(JKitTemplateConfig.lang.create)
      this.createPopupOverlay.fadeIn()
      this.createPopupContainer.fadeIn()

      // render option
      this.renderOption()
    },

    /**
     * Hide Popup
     */
    hideCreatePopup: function () {
      this.body.removeClass('overflow-hidden')
      this.createPopupOverlay.fadeOut()
      this.createPopupContainer.fadeOut()
    },
  })

  /**
   * JKit Dashboard Entry Point
   */
  api.JKitDashboard = api.Class.extend({

    /**
     * Empty
     */
    empty: '',

    /**
     * Popup Instance
     */
    popupInstance: null,

    /**
     * Dashboard Container
     */
    container: $('#jkit-builder-container'),

    /**
     * Initialize
     */
    initialize: function () {
      this.renderWrapper(JKitTemplateConfig.data)
      this.popupInstance = new api.JKitPopup(this.container)
    },

    /**
     * Initialize Wrapper
     */
    renderWrapper: function (data) {
      this.container.html(this.empty)
      this.container.append(this.dashboardContent(data))
      this.injectBuilder(data)
      this.builderSortable()
      api.refreshPriority()
    },

    /**
     * Rerender wrapper
     *
     * @param data
     */
    reRenderWrapper: function (data) {
      this.renderWrapper(data)
      this.popupInstance.attachOpenButton()
    },

    /**
     * Sortable
     */
    builderSortable: function () {
      $('#active-element, #inactive-element').sortable({
        connectWith: '.connectedSortable',
        stop: function () {
          var publish = []
          $('.active-element-wrapper .jkit-element-container').each(function (index) {
            publish.push($(this).data('id'))
          })

          var draft = []
          $('.inactive-element-wrapper .jkit-element-container').each(function () {
            draft.push($(this).data('id'))
          })

          this.saveSortable(publish, draft)
          api.refreshPriority()
        }.bind(this),
      }).disableSelection()
    },

    /**
     * Save Sortable
     *
     * @param publish
     * @param draft
     */
    saveSortable: function (publish, draft) {
      clearTimeout(this.sortableTimeout)
      this.sortableTimeout = setTimeout(function () {
        wp.ajax.send('jkit_update_sequence', {
          data: {
            id: this.id,
            publish: publish,
            draft: draft,
            nonce: JKitTemplateConfig.nonce,
          },
        })
      }.bind(this), 500)
    },

    /**
     * Inject builder
     *
     * @param data
     */
    injectBuilder: function (data) {
      this.removeBuilderHolder()
      this.buildOption(data.publish, $('.active-element-wrapper .content-body'))
      this.buildOption(data.draft, $('.inactive-element-wrapper .content-body'))
      window.dispatchEvent(new Event('resize'))
    },

    /**
     *
     * @param content
     * @param $wrapper
     */
    buildOption: function (content, $wrapper) {
      content.forEach(function (item) {
        var key = item.id.toString()
        var options = this.mergeValues(JKitTemplateConfig.tab, item)
        api.builderholder.add(key, new api.JKitOptionWrapperBuilder(key, options, $wrapper, item))
      }.bind(this))
    },

    /**
     * Merge Values
     */
    mergeValues: function (tabs, values) {
      var config = []
      api.cloneObject(tabs).forEach(function (tab) {
        tab.values = values[tab.id]
        config.push(tab)
      })

      return config
    },

    /**
     * Clean Up
     */
    removeBuilderHolder: function () {
      api.builderholder.each(function (builder) {
        api.builderholder.remove(builder.id)
      })
    },

    /**
     * Dashboard Content
     */
    dashboardContent: function (data) {
      var template = null

      if (data.publish.length === 0 && data.draft.length === 0) {
        template = wp.template('jkit-builder-empty')
      } else {
        template = wp.template('jkit-builder-content')
      }

      return $(template({
        lang: JKitTemplateConfig.lang,
      }))
    },

    /**
     * Get Values
     */
    getValues: function () {
      api.builderholder.each(function (builderholder) {
        var values = []
        builderholder.containerHolder.each(function (data) {
          values[data.id] = data.getValues()
        })
      })
    },
  })

  /****************************************************************************************************
   * Helper
   */

  /**
   * Clone Object
   *
   * @param obj
   */
  api.cloneObject = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  /**
   * Segment Name
   *
   * @param id
   * @param index
   * @returns {string}
   */
  api.segmentName = function (id, index) {
    return id + '_' + index
  }

  /**
   * Refresh Priority
   */
  api.refreshPriority = function () {
    $('.active-element-wrapper .jkit-container-header').each(function (index) {
      $(this).find('.tab-priority').text(index + 1)
    })
  }

  /**
   * Document Ready
   */
  $(document).ready(function () {
    window.ampdashboard = new api.JKitDashboard()
  })

})(jQuery, wp.customize)