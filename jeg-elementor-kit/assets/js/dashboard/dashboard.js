(function($) {
    'use strict';

    window.jkitdashboard = window.jkitdashboard || {}

    window.jkitdashboard = {
        init: function(container) {
            var base = this;
            base.xhr = null;

            if (container === undefined) {
                base.container = $('body')
            } else {
                base.container = container
            }

            Notiflix.Notify.Init({ position: "right-top", zindex: 999999 });
            base.button_save = base.container.find('.jkit-dashboard-body-wrap .jkit-form-submit>button');

            base.form_handler();
            base.elements();
        },
        form_handler: function() {
            var base = this,
                form_handler = base.container.find('#jkit-user-data-form, #jkit-settings-form');

				form_handler.find('.jkit-form-content').on('click', function(e) {
                e.preventDefault();

                var tab = $(this).parents('.jkit-form-tab ');

                if (tab.hasClass('collapse')) {
                    tab.removeClass('collapse');
                } else {
                    tab.addClass('collapse');
                }
            });

            form_handler.on('submit', function(e) {
                e.preventDefault();
				var formId = $(this).attr('id'),
					formData = {},
					action = '';

				if ( 'jkit-user-data-form' === formId ) {
					action = 'save_user_data';
					formData = {
						'mailchimp_api': $('input[name="data[mailchimp][api_key]"]').val(),
					};
				} else if ( 'jkit-settings-form' === formId ) {
					action = 'save_settings';
					formData = {
						'global_style': $('select[name="data[global_style]"]').val(),
					};
				}

                base.button_save.addClass('saving');
                base.button_save.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');

                $.ajax({
                        type: 'POST',
                        url: jkit_ajax_url,
                        data: {
                            form_data: formData,
                            action: action,
                            nonce: jkit_nonce
                        },
                        dataType: 'json',
                        encode: true
                    })
                    .done(function(data) {
                        Notiflix.Notify.Success(data.message);
                        base.button_save.removeClass('saving');
                        base.button_save.find('i').removeClass('fa-spinner fa-spin').addClass('fa-save');
                    })
                    .fail(function() {
                        Notiflix.Notify.Failure(jkit_dashboard_localize.save_failed);
                        base.button_save.removeClass('saving');
                    });
            });
        },
        elements: function() {
            var base = this,
                toggle = base.container.find('.element-checkbox-option .switch'),
                enable_all = base.container.find('.jkit-button.enable-all'),
                disable_all = base.container.find('.jkit-button.disable-all'),
                elements_form = base.container.find('#jkit-elements-enable-form');;

            toggle.on('click', function(e) {
                e.preventDefault();

                var input = $(this).prev('input');

                if (input.is(':checked')) {
                    input.prop('checked', false);
                } else {
                    input.prop('checked', true);
                }
            });

            enable_all.on('click', function(e) {
                e.preventDefault();
                toggle.prev('input').prop('checked', true);
            });

            disable_all.on('click', function(e) {
                e.preventDefault();
                toggle.prev('input').prop('checked', false);
            });

            elements_form.on('submit', function(e) {
                e.preventDefault();

                var formData = {};
                base.button_save.addClass('saving');
                base.button_save.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');

                toggle.each(function(index, value) {
                    var input = $(value).prev('input'),
                        element_key = input.data('element-key');

                    formData[element_key] = input.is(':checked');
                });

                $.ajax({
                        type: 'POST',
                        url: jkit_ajax_url,
                        data: {
                            form_data: formData,
                            action: 'save_elements_enable',
                            nonce: jkit_nonce
                        },
                        dataType: 'json',
                        encode: true
                    })
                    .done(function(data) {
                        Notiflix.Notify.Success(data.message);
                        base.button_save.removeClass('saving');
                        base.button_save.find('i').removeClass('fa-spinner fa-spin').addClass('fa-save');
                    })
                    .fail(function() {
                        Notiflix.Notify.Failure(jkit_dashboard_localize.save_failed);
                        base.button_save.removeClass('saving');
                    });
            });
        }
    }

    $(document).on('ready', function() {
        window.jkitdashboard.init()
    })
})(jQuery);