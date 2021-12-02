(function ($, api) {
  'use strict'

  api.SingleSegment = api.noWrapSegment.extend({
    /**
     * Populate Fields
     */
    populateFields: function () {
      var fields = this.prepareField(this.params.fields)
      this.setupField(this.id, fields)
    },

    /**
     * Setup Setting Field
     *
     * @param fields
     * @returns {*}
     */
    prepareField: function (fields) {
      var index = 0
      var resultFields = []

      _.each(fields, function (data, key) {
        var nField = api.cloneObject(fields[key])
        resultFields[key] = this.prepareFieldData(nField, data, index++)
      }.bind(this))

      return api.helper.prioritySort(resultFields)
    },

    /**
     * Prepare Field Data
     *
     * @param field
     * @param data
     *
     * @returns {*}
     */
    prepareFieldData: function (field) {
      var container = this.params.container

      field.container = this
      field.fieldName = container.id + '[' + field.fieldName + ']'

      return field
    },

    /**
     * listen field change
     *
     * @param id
     * @param value
     */
    listenFieldChange: function (id, value) {
      this.params.container.listenSegmentChange(this.id, id, value)
    },
  })

  api.MultiSegment = api.SingleSegment.extend({
    segmentType: 'multi',
    segmentContentParent: '.jkit-condition-content',

    ready: function () {
      this.activateSegment()
    },

    /**
     * Prepare Field Data
     *
     * @param field
     *
     * @returns {*}
     */
    prepareFieldData: function (field) {
      var index = this.params.index
      var container = this.params.container

      field.container = this
      field.fieldName = container.id + '[' + index + '][' + field.fieldName + ']'

      return field
    },

    /**
     * Get parent container element
     *
     * @return string
     */
    getParentContainer: function () {
      return this.params.container.container.find('.jkit-condition-wrapper')
    },

    /**
     * attach event
     */
    attachEvent: function () {
      this.element.find('.jkit-condition-header').on('click', this.activateSegment.bind(this))
      this.element.find('.tab-delete').on('click', this.removeSegment.bind(this))
    },

    /**
     * Activate Section
     */
    activateSegment: function () {
      this.params.parentInstance.activateSegment(this.id)
    },

    /**
     * Toogle Segment
     */
    toogleSegment: function () {
      setTimeout(function () {
        this.element.find('.jkit-condition-content').slideToggle('fast')
      }.bind(this), 200)
    },

    /**
     * Close Segment
     */
    closeSegment: function () {
      this.element.find('.jkit-condition-content').slideUp('fast')
    },

    /**
     * Remove Section
     *
     * @param e
     */
    removeSegment: function (e) {
      e.stopPropagation()
      this.element.remove()
      this.params.parentInstance.removeSegment(this.id, this.params.index)

      // trail to top container and remove option
      if (this.params.container.option.parent.saveValue !== undefined) {
        this.params.container.option.parent.saveValue()
      }
    },
  })

  api.segmentConstructor['single'] = api.SingleSegment
  api.segmentConstructor['multi'] = api.MultiSegment

  /**
   * Single Container
   */
  api.SingleContainer = api.BaseContainer.extend({
    /**
     * Set Container Holder
     */
    setContainerHolder: function () {
      this.containerHolder = this.option.parent.containerHolder
    },

    /**
     * Assign additional Segment Data
     *
     * @param segment
     *
     * @returns {*}
     */
    prepareSegmentData: function (segment) {
      segment.parent = this.id
      segment.container = this
      segment.fields = this.option.fields

      return segment
    },

    /**
     * Populate Segment
     * @returns {{}}
     */
    populateSegments: function () {
      var segments = {
        [this.option.id]: {
          id: this.option.id,
          name: this.option.id,
          type: this.option.type,
        },
      }
      segments = this.prepareSegment(segments)
      this.setupSegment(this.id, segments)
    },

    /**
     * Setup Setting Segment
     *
     * @param segments
     */
    prepareSegment: function (segments) {
      _.each(segments, function (data, key) {
        var nSegment = api.cloneObject(segments[key])
        segments[key] = this.prepareSegmentData(nSegment, data)
      }.bind(this))

      return api.helper.prioritySort(segments)
    },

    /**
     * Get this value
     */
    getValues: function () {
      var values = {}
      this.segments(this.option.id).fields.each(function (field) {
        values[field.id] = field.value.get()
      })
      return values
    },

    /**
     * Listen segment change
     */
    listenSegmentChange: function (segment, field, value) {
      if (this.option.parent.listenContainerChange !== undefined) {
        this.option.parent.listenContainerChange(segment, field, value)
      }
    },
  })

  /**
   * Multi Container
   */
  api.ConditionContainer = api.SingleContainer.extend({
    /**
     * Initialize Menu
     *
     * @param id
     * @param element
     * @param option
     */
    initialize: function (id, element, option) {
      this.id = id
      this.element = element
      this.option = option

      // This variable need to be assigned right here to prevent merging variable with previous instantiate class
      this.segments = new api.Values({ defaultConstructor: api.Segment })

      this.embeed()
      this.setContainerHolder()
      this.loadContainer()
    },

    /**
     * Populate Segment
     * @returns {{}}
     */
    populateSegments: function () {
      for (var index in this.option.fields) {
        var multiSegment = this.createSegmentParam(index)
        multiSegment = this.prepareSegment(multiSegment)
        this.setupSegment(this.id, multiSegment)
      }
    },

    /**
     * Get this value
     */
    getValues: function () {
      var values = []
      this.segments.each(function (segment) {
        var nValues = {}
        segment.fields.each(function (field) {
          nValues[field.id] = field.value.get()
        })
        values.push(nValues)
      })
      return values
    },

    /**
     * Trigger finish Container
     */
    triggerFinish: function () {
      this.segments.each(function (data) {
        this.segments(data.id).triggerLoaded()
      }.bind(this))

      this.checkEmptySegment()
    },

    /**
     * Assign additional Segment Data
     *
     * @param segment
     * @param data
     *
     * @returns {*}
     */
    prepareSegmentData: function (segment, data) {
      segment.parent = this.id
      segment.container = this
      segment.parentInstance = this

      if (this.option.fields === undefined) {
        segment.fields = this.option.default
      } else {
        segment.fields = this.option.fields[data.index]
      }

      return segment
    },

    /**
     * Activate Segment
     *
     * @param segmentID
     */
    activateSegment: function (segmentID) {
      this.segments.each(function (segment) {
        if (segmentID === segment.id) {
          segment.toogleSegment()
        }
      })
    },

    /**
     * Remove Segment
     *
     * @param id
     * @param index
     */
    removeSegment: function (id, index) {
      this.segments.remove(id)
      this.checkEmptySegment()
    },

    /**
     * Check Empty Segment
     */
    checkEmptySegment: function () {
      if (this.getAllSegments().length) {
        this.hideEmptyCondition()
      } else {
        this.renderEmptySegment()
      }
    },

    /**
     * Render Empty Segment
     */
    renderEmptySegment: function () {
      this.element.find('.jkit-condition-empty').show()
    },

    /**
     * Hide Empty Condition
     */
    hideEmptyCondition: function () {
      this.element.find('.jkit-condition-empty').hide()
    },

    /**
     * Get all segment ID registered to this container
     */
    getAllSegments: function () {
      var ids = []
      this.segments.each(function (data) {
        ids.push(data.id)
      })
      return ids
    },

    /**
     * Attach event
     */
    attachEvent: function () {
      this.container.find('.jkit-condition-add button').on('click', this.buttonAddClicked.bind(this))
    },

    /**
     * Button Add Clicked
     */
    buttonAddClicked: function () {
      this.createMultiSegment()
      if (this.option.parent.saveValue !== undefined) {
        this.option.parent.saveValue()
      }

      this.checkEmptySegment()
    },

    /**
     * Create Segment for Multiple Segment
     *
     * @returns {string}
     */
    createMultiSegment: function () {
      var index = this.getNextSegmentIndex()
      var segments = this.createSegmentParam(index)
      var id = segments.segment.id

      segments = this.prepareSegment(segments)
      segments[0].fields = this.option.default

      this.setupSegment(this.id, segments)
      this.segments(id).triggerLoaded()
      this.segments(id).activateSegment()
    },

    /**
     * Get last index of multi segment
     *
     * @returns {number}
     */
    getNextSegmentIndex: function () {
      var index = 0
      var flag = false

      this.segments.each(function (segment) {
        index = segment.params.index
        flag = true
      })

      if (!flag && 0 === index) {
        return index
      } else {
        return ++index
      }
    },

    /**
     * Segment Parameter
     *
     * @param index
     * @param initial
     * @returns {{segment: {id: string, name: string, type, index: (Number|*)}}}
     */
    createSegmentParam: function (index) {
      var id = api.segmentName(this.option.id, index)
      index = parseInt(index)

      return {
        'segment': {
          id: id,
          name: this.option.title + ' ' + (index + 1),
          type: this.option.type,
          index: index,
        },
      }
    },

    /**
     * Embeed item
     */
    embeed: function () {
      this.container = $(this.renderContainer())
      this.element.append(this.container)
    },

    /**
     * Navigation Tab
     *
     * @returns {*}
     */
    renderContainer: function () {
      var template = wp.template('jkit-condition-container')

      if (template) {
        return template({
          lang: JKitTemplateConfig.lang,
        })
      }

      return '<div></div>'
    },
  })

  /**
   * Option Builder
   */
  api.JKitOptionBuilder = api.Class.extend({

    /**
     * Option Builder
     *
     * @param id
     * @param options
     * @param $wrapper
     */
    initialize: function (id, options, $wrapper) {
      this.id = id
      this.options = api.cloneObject(options)
      this.$wrapper = $wrapper

      this.createContainer()
    },

    /**
     * Create Container
     */
    createContainer: function () {
      this.containerHolder = new api.Values({ defaultConstructor: api.BaseContainer })

      _.each(this.options, function (data) {
        data.parent = this

        if (data.type === 'single') {
          this.containerHolder.add(data.id, new api.SingleContainer(data.id, this.$wrapper, data))
        } else {
          this.containerHolder.add(data.id, new api.ConditionContainer(data.id, this.$wrapper, data))
        }
      }.bind(this))
    },

    /**
     * Trigger Finish
     */
    triggerFinish: function () {
      this.containerHolder.trigger(this.id, this)
    },
  })

  /**
   * Option Builder
   */
  api.JKitOptionWrapperBuilder = api.JKitOptionBuilder.extend({
    /**
     * Option Builder
     *
     * @param id
     * @param options
     * @param $wrapper
     * @param setting
     */
    initialize: function (id, options, $wrapper, setting) {
      this.id = id
      this.options = api.cloneObject(options)
      this.$wrapper = $wrapper
      this.setting = setting
      this.timeout = null
      this.loaded = false

      this.embeed()
      this.attachEvent()
    },

    attachEvent: function () {
      this.$container.find('.jkit-container-header').on('click', this.headerClicked.bind(this))
      this.$container.find('.jkit-header-action .tab-delete').on('click', this.deleteClicked.bind(this))
      this.$container.find('.jkit-header-action .tab-edit').on('click', this.editClicked.bind(this))
      this.$container.find('.jkit-header-action .tab-clone').on('click', this.cloneClicked.bind(this))
    },

    editClicked: function (e) {
      e.stopPropagation()
    },

    cloneClicked: function (e) {
      e.stopPropagation()
      $(e.currentTarget).find('i').attr('class', 'fa fa-circle-o-notch fa-spin')

      wp.ajax.send('jkit_clone_element', {
        data: {
          id: this.id,
          nonce: JKitTemplateConfig.nonce,
          type: JKitTemplateConfig.type
        },
      }).done(function (response) {
        window.ampdashboard.reRenderWrapper(response)
      }.bind(this))
    },

    /**
     * Delete This one
     *
     * @param e
     */
    deleteClicked: function (e) {
      e.stopPropagation()
      if (confirm(JKitTemplateConfig.lang.deleteelement)) {
        $(e.currentTarget).find('i').attr('class', 'fa fa-circle-o-notch fa-spin')

        wp.ajax.send('jkit_delete_element', {
          data: {
            id: this.id,
            nonce: JKitTemplateConfig.nonce,
          },
        }).done(function () {
          this.$container.remove()
          api.builderholder.remove(this.id)
          api.refreshPriority()
        }.bind(this))
      }
    },

    /**
     * Handle Clicked
     */
    headerClicked: function () {
      if (!this.loaded) {
        this.requestDetail()
        this.loaded = true
      }

      this.$container.siblings().each(function () {
        $(this).find('.jkit-container-body').slideUp('fast')
      })

      this.$container.find('.jkit-container-body').slideToggle('fast')
    },

    /**
     * Request Detail
     */
    requestDetail: function () {
      wp.ajax.send('jkit_detail_element', {
        data: {
          id: this.id,
          nonce: JKitTemplateConfig.nonce,
        },
      }).done(function (response) {
        this.$container.find('.jkit-container-body').html('')
        this.createContainer(response)
        this.triggerFinish()
      }.bind(this))
    },

    /**
     * Embeed
     */
    embeed: function () {
      this.$container = $(this.renderContainer())
      this.$wrapper.append(this.$container)
    },

    /**
     * Embeed
     */
    renderContainer: function () {
      var template = wp.template('jkit-element-container')

      if (template) {
        return template({
          id: this.id,
          title: this.setting.title,
          url: this.setting.url,
          lang: JKitTemplateConfig.lang
        })
      }

      return template
    },

    /**
     * Create Container
     */
    createContainer: function (options) {
      this.containerHolder = new api.Values({ defaultConstructor: api.BaseContainer })
      var container = this.$container.find('.jkit-container-body')

      _.each(this.options, function (data) {
        data.parent = this
        data.fields = options[data.id]

        if (data.type === 'single') {
          this.containerHolder.add(data.id, new api.SingleContainer(data.id, container, data))
        } else {
          this.containerHolder.add(data.id, new api.ConditionContainer(data.id, container, data))
        }
      }.bind(this))
    },

    /**
     * Listen container change
     */
    listenContainerChange: function (segment, field, value) {
      if ('option' === segment && 'title' === field) {
        this.$container.find('.jkit-container-header h3 span').text(value)
      }

      // save this value to database
      this.saveValue()
    },

    /**
     * Get Value
     *
     * @returns {{}}
     */
    getValues: function () {
      var values = {}
      this.containerHolder.each(function (value) {
        values[value.id] = value.getValues()
      })

      return values
    },

    /**
     * Save Value
     */
    saveValue: function () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(function () {
        wp.ajax.send('jkit_update_element', {
          data: {
            id: this.id,
            data: this.getValues(),
            nonce: JKitTemplateConfig.nonce,
          },
        })
      }.bind(this), 500)
    },
  })

})(jQuery, wp.customize)