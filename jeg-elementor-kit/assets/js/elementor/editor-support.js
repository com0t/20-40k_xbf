(function($) {
    "use strict";

    elementor.hooks.addFilter('editor/style/styleText', function(css, view) {
        if (view != undefined || view != null) {
            const model = view.getEditModel(),
                widgetType = model.get('widgetType'),
                customCSS = model.get('settings').get('st_css_custom'),
                version = elementor.config.document.version,
                breakpoints = [];

            if (elementor.helpers.compareVersions(version, '3.2.0', '>=')) {
                const active_breakpoint = elementorFrontend.config.responsive.activeBreakpoints;

                Object.keys(active_breakpoint).forEach(function(key) {
                    breakpoints.push({ key: key, value: active_breakpoint[key].value });
                });
            } else {
                breakpoints.push({ key: 'tablet', value: elementorFrontend.config.breakpoints.lg - 1 });
                breakpoints.push({ key: 'mobile', value: elementorFrontend.config.breakpoints.md - 1 });
            }

            breakpoints.sort(function(a, b) {
                return b.value - a.value;
            });

            // Custom CSS Box
            if (customCSS && widgetType.substring(0, 5) == 'jkit_') {
                css += customCSS;
            }

            // Portfolio Gallery remove right border
            if ('jkit_portfolio_gallery' == widgetType) {
                let column = model.get('settings').get('sg_setting_column_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-portfolio-gallery .row-item';

                if (breakpoints.length > 0) {
                    css += '@media (min-width: ' + breakpoints[0].value + 'px) {' + selector + ':nth-child(' + column.size + 'n) { border-right-width:0; } }';
                } else {
                    css += selector + ':nth-child(' + column.size + 'n) { border-right-width:0; }';
                }

                for (let i = 0; i < breakpoints.length - 1; i++) {
                    column = model.get('settings').get('sg_setting_column_responsive_' + breakpoints[i].key);
                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ':nth-child(' + column.size + 'n) { border-right-width:0; } }';
                }

                if (breakpoints.length > 0) {
                    column = model.get('settings').get('sg_setting_column_responsive_' + breakpoints[breakpoints.length - 1].key);
                    css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ':nth-child(' + column.size + 'n) { border-right-width:0; } }';
                }
            }

            // Social share alignment
            if ('jkit_social_share' == widgetType) {
                let align = model.get('settings').get('sg_social_alignment_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-social-share .social-share-list > li a';

                if (align == 'left') {
                    css += selector + ' { margin-right: auto; }';
                } else if (align == 'center') {
                    css += selector + ' { margin-left: auto; margin-right: auto; }';
                } else {
                    css += selector + ' { margin-left: auto; }';
                }

                breakpoints.forEach(function(breakpoint) {
                    align = model.get('settings').get('sg_social_alignment_responsive_' + breakpoint.key);

                    if (align == 'left') {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { margin-left: unset; margin-right: auto; } }';
                    } else if (align == 'center') {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { margin-left: auto; margin-right: auto; } }';
                    } else {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { margin-left: auto; margin-right: unset; } }';
                    }
                });
            }

            // Progress bar stripe color
            if ('jkit_progress_bar' == widgetType) {
                const style = model.get('settings').get('sg_progress_style');

                if ('stripe' == style) {
                    let globals = model.get('settings').get('__globals__'),
                        track_color = model.get('settings').get('st_track_stripe_color_responsive'),
                        track_bg = model.get('settings').get('st_track_stripe_background_color_responsive'),
                        selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-progress-bar .progress-group.stripe .progress-skill-bar .skill-bar .skill-track',
                        color_default = 'var(--jkit-txt-color)',
                        bg_color_default = 'var(--jkit-bg-color)',
                        color = 'var(--jkit-txt-color)',
                        bg_color = 'var(--jkit-bg-color)';

                    if (globals !== undefined) {
                        if (globals['st_track_stripe_color_responsive'] !== undefined && globals['st_track_stripe_color_responsive'] !== '') {
                            track_color = `var(--e-global-color-${globals['st_track_stripe_color_responsive'].replace('globals/colors?id=', '')})`;
                        }

                        if (globals['st_track_stripe_background_color_responsive'] !== undefined && globals['st_track_stripe_background_color_responsive'] !== '') {
                            track_bg = `var(--e-global-color-${globals['st_track_stripe_background_color_responsive'].replace('globals/colors?id=', '')})`;
                        }
                    }

                    if (track_color || track_bg) {
                        color = track_color ? track_color : color_default;
                        bg_color = track_bg ? track_bg : bg_color_default;
                        css += selector + ' { background: -o-repeating-linear-gradient(left, ' + color + ', ' + color + ' 4px, ' + bg_color + ' 4px, ' + bg_color + ' 8px); background: repeating-linear-gradient(to right, ' + color + ', ' + color + ' 4px, ' + bg_color + ' 4px, ' + bg_color + ' 8px); }';
                    }

                    breakpoints.forEach(function(breakpoint) {
                        track_color = model.get('settings').get('st_track_stripe_color_responsive_' + breakpoint.key);
                        track_bg = model.get('settings').get('st_track_stripe_background_color_responsive_' + breakpoint.key);

                        if (globals !== undefined) {
                            if (globals['st_track_stripe_color_responsive_' + breakpoint.key] !== undefined && globals['st_track_stripe_color_responsive_' + breakpoint.key] !== '') {
                                track_color = `var(--e-global-color-${globals['st_track_stripe_color_responsive_' + breakpoint.key].replace('globals/colors?id=', '')})`;
                            }

                            if (globals['st_track_stripe_background_color_responsive_' + breakpoint.key] !== undefined && globals['st_track_stripe_background_color_responsive_' + breakpoint.key] !== '') {
                                track_bg = `var(--e-global-color-${globals['st_track_stripe_background_color_responsive_' + breakpoint.key].replace('globals/colors?id=', '')})`;
                            }
                        }

                        if (track_color || track_bg) {
                            color = track_color ? track_color : color_default;
                            bg_color = track_bg ? track_bg : bg_color_default;
                            css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { background: -o-repeating-linear-gradient(left, ' + color + ', ' + color + ' 4px, ' + bg_color + ' 4px, ' + bg_color + ' 8px); background: repeating-linear-gradient(to right, ' + color + ', ' + color + ' 4px, ' + bg_color + ' 4px, ' + bg_color + ' 8px); } }';
                        }
                    });
                }
            }

            // Dual Button alignment
            if ('jkit_dual_button' == widgetType) {
                let align = model.get('settings').get('sg_dual_alignment_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-dual-button';

                if (align == 'left') {
                    css += selector + ' { -webkit-box-pack: start; -ms-flex-pack: start; justify-content: flex-start; }';
                } else if (align == 'center') {
                    css += selector + ' { -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; }';
                } else {
                    css += selector + ' { -webkit-box-pack: end; -ms-flex-pack: end; justify-content: flex-end; }';
                }

                breakpoints.forEach(function(breakpoint) {
                    align = model.get('settings').get('sg_dual_alignment_responsive_' + breakpoint.key);

                    if (align == 'left') {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { -webkit-box-pack: start; -ms-flex-pack: start; justify-content: flex-start; } }';
                    } else if (align == 'center') {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; } }';
                    } else {
                        css += '@media (max-width: ' + breakpoint.value + 'px) {' + selector + ' { -webkit-box-pack: end; -ms-flex-pack: end; justify-content: flex-end; } }';
                    }
                });
            }

            // Feature List icon position
            if ('jkit_feature_list' == widgetType) {
                let position = model.get('settings').get('sg_setting_icon_position_responsive'),
                    connector_enable = model.get('settings').get('sg_setting_connector_enable'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-feature-list';

                if (breakpoints.length > 0) {
                    if (position == 'left') {
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: left; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-right: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else if (position == 'right') {
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: right; -webkit-box-orient: horizontal; -webkit-box-direction: reverse; -ms-flex-direction: row-reverse; flex-direction: row-reverse; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else {
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-right: 0 !important;  margin-bottom: 0 !important; } }';
                    }
                } else {
                    if (position == 'left') {
                        css += selector + ' .feature-list-items .feature-list-item { text-align: left; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; display: -webkit-box; display: -ms-flexbox; display: flex; }';
                        css += selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-right: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; }';
                    } else if (position == 'right') {
                        css += selector + ' .feature-list-items .feature-list-item { text-align: right; -webkit-box-orient: horizontal; -webkit-box-direction: reverse; -ms-flex-direction: row-reverse; flex-direction: row-reverse; display: -webkit-box; display: -ms-flexbox; display: flex; }';
                        css += selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; }';
                    } else {
                        css += selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-right: 0 !important;  margin-bottom: 0 !important; }';
                    }
                }

                for (let i = 0; i < breakpoints.length - 1; i++) {
                    position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[i].key);

                    if (position == 'left') {
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: left; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-right: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else if (position == 'right') {
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: right; -webkit-box-orient: horizontal; -webkit-box-direction: reverse; -ms-flex-direction: row-reverse; flex-direction: row-reverse; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else {
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-right: 0 !important;  margin-bottom: 0 !important; } }';
                    }
                }

                if (breakpoints.length > 0) {
                    position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[breakpoints.length - 1].key);

                    if (position == 'left') {
                        css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: left; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-right: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else if (position == 'right') {
                        css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { text-align: right; -webkit-box-orient: horizontal; -webkit-box-direction: reverse; -ms-flex-direction: row-reverse; flex-direction: row-reverse; display: -webkit-box; display: -ms-flexbox; display: flex; } }';
                        css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-top: 0 !important;  margin-bottom: 0 !important; } }';
                    } else {
                        css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .feature-list-content-box { margin-left: 0 !important; margin-right: 0 !important;  margin-bottom: 0 !important; } }';
                    }
                }

                if (connector_enable) {
                    let icon_size = model.get('settings').get('st_icon_circle_size_responsive'),
                        connector_type = model.get('settings').get('st_list_connector_type'),
                        icon_shape = model.get('settings').get('sg_setting_icon_shape'),
                        shape_view = model.get('settings').get('sg_setting_shape_view'),
                        offset = icon_size.size !== '' ? icon_size.size : 70,
                        border_width = model.get('settings').get('st_icon_border_width_responsive'),
                        border_width_size = border_width.size !== '' ? border_width.size : 0,
                        prev_offset = offset,
                        prev_border_width = border_width_size;

                    position = model.get('settings').get('sg_setting_icon_position_responsive');

                    if ('rhombus' === icon_shape) {
                        offset += 30;
                    }

                    if ('framed' === shape_view) {
                        offset += 2 * border_width_size;
                    }

                    if (breakpoints.length > 0) {
                        if (position == 'left') {
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: 0; right: calc(100% - ' + offset + icon_size.unit + '); } }';
                        } else if (position == 'right') {
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: calc(100% - ' + offset + icon_size.unit + '); right: 0; } }';
                        } else {
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { display: none; } }';
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item { padding-left: 50px; } }';
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item:before { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 0px; top: 0; z-index: 1; border-right: none !important; height: 100%; } }';
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item:after { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 5px; top: 50%; width: 23px; z-index: 2; border-top: none !important; } }';
                            css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items .feature-list-item:not(:last-child):before { height: calc(100% + 8px); } }';
                        }
                    } else {
                        if (position == 'left') {
                            css += selector + ' .feature-list-items .feature-list-item .connector { left: 0; right: calc(100% - ' + offset + icon_size.unit + '); }';
                        } else if (position == 'right') {
                            css += selector + ' .feature-list-items .feature-list-item .connector { left: calc(100% - ' + offset + icon_size.unit + '); right: 0; }';
                        } else {
                            css += selector + ' .feature-list-items .feature-list-item .connector { display: none; }';
                            css += selector + ' .feature-list-items .feature-list-item { padding-left: 50px; }';
                            css += selector + ' .feature-list-items .feature-list-item:before { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 0px; top: 0; z-index: 1; border-right: none !important; height: 100%; }';
                            css += selector + ' .feature-list-items .feature-list-item:after { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 5px; top: 50%; width: 23px; z-index: 2; border-top: none !important; }';
                            css += selector + ' .feature-list-items .feature-list-item:not(:last-child):before { height: calc(100% + 8px); }';
                        }
                    }

                    for (let i = 0; i < breakpoints.length - 1; i++) {
                        position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[i].key);
                        icon_size = model.get('settings').get('st_icon_circle_size_responsive_' + breakpoints[i].key)
                        offset = icon_size.size !== '' ? icon_size.size : prev_offset,
                            prev_offset = offset;

                        if ('rhombus' === icon_shape) {
                            offset += 30;
                        }

                        if ('framed' === shape_view) {
                            border_width = model.get('settings').get('st_icon_border_width_responsive_' + breakpoints[i].key);
                            border_width_size = border_width.size !== '' ? border_width.size : prev_border_width;
                            prev_border_width = border_width_size;
                            offset += 2 * border_width_size;
                        }

                        if (position == 'left') {
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: 0; right: calc(100% - ' + offset + icon_size.unit + '); } }';
                        } else if (position == 'right') {
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: calc(100% - ' + offset + icon_size.unit + '); right: 0; } }';
                        } else {
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { display: none; } }';
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { padding-left: 50px; } }';
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:before { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 0px; top: 0; z-index: 1; border-right: none !important; height: 100%; } }';
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:after { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 5px; top: 50%; width: 23px; z-index: 2; border-top: none !important; } }';
                            css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:not(:last-child):before { height: calc(100% + 8px); } }';
                        }
                    }

                    if (breakpoints.length > 0) {
                        position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[breakpoints.length - 1].key);
                        icon_size = model.get('settings').get('st_icon_circle_size_responsive_' + breakpoints[breakpoints.length - 1].key)
                        offset = icon_size.size !== '' ? icon_size.size : prev_offset,
                            prev_offset = offset;

                        if ('rhombus' === icon_shape) {
                            offset += 30;
                        }

                        if ('framed' === shape_view) {
                            border_width = model.get('settings').get('st_icon_border_width_responsive_' + breakpoints[breakpoints.length - 1].key);
                            border_width_size = border_width.size !== '' ? border_width.size : prev_border_width;
                            prev_border_width = border_width_size;
                            offset += 2 * border_width_size;
                        }

                        if (position == 'left') {
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: 0; right: calc(100% - ' + offset + icon_size.unit + '); } }';
                        } else if (position == 'right') {
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { left: calc(100% - ' + offset + icon_size.unit + '); right: 0; } }';
                        } else {
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item .connector { display: none; } }';
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item { padding-left: 30px; } }';
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:before { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 0px; top: 0; z-index: 1; border-right: none !important; height: 100%; } }';
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:after { content: ""; position: absolute; display: block; border-style: solid; border-color: var(--jkit-element-bg-color); border-width: 1px; left: 5px; top: 50%; width: 23px; z-index: 2; border-top: none !important; } }';
                            css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items .feature-list-item:not(:last-child):before { height: calc(100% + 8px); } }';
                        }
                    }

                    if ('modern' == connector_type) {
                        position = model.get('settings').get('sg_setting_icon_position_responsive');

                        if (breakpoints.length > 0) {
                            if (position == 'right') {
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-right: 50px; } }';
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { right: 0; } }';
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { right: 5px; } }';
                            } else {
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-left: 50px; } }';
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { left: 0; } }';
                                css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { left: 5px; } }';
                            }
                        } else {
                            if (position == 'right') {
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-right: 50px; }';
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { right: 0; }';
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { right: 5px; }';
                            } else {
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-left: 50px; }';
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { left: 0; }';
                                css += selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { left: 5px; }';
                            }
                        }

                        for (let i = 0; i < breakpoints.length - 1; i++) {
                            position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[i].key);

                            if (position == 'right') {
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-right: 50px; } }';
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { right: 0; } }';
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { right: 5px; } }';
                            } else {
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-left: 50px; } }';
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item :before { left: 0; } }';
                                css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item :after { left: px; } }';
                            }
                        }

                        if (breakpoints.length > 0) {
                            position = model.get('settings').get('sg_setting_icon_position_responsive_' + breakpoints[breakpoints.length - 1].key);

                            if (position == 'right') {
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-right: 30px; } }';
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { right: 0; } }';
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { right: 5px; } }';
                            } else {
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item { padding-left: 30px; } }';
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:before { left: 0; } }';
                                css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .feature-list-items.connector-type-modern .feature-list-item:after { left: 5px; } }';
                            }
                        }
                    }
                }
            }

            // Testimonials slide show predefine CSS
            if ('jkit_testimonials' == widgetType) {
                let items = model.get('settings').get('sg_setting_slide_show_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-testimonials';

                if (breakpoints.length > 0) {
                    css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                    css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item { width: calc(100% / ' + items.size + '); } }';
                    css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                    css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                } else {
                    css += selector + ' .testimonials-track:not(.tns-slider) { display: flex; flex-direction: row; }';
                    css += selector + ' .testimonials-track:not(.tns-slider) .testimonial-item { width: calc(100% / ' + items.size + '); }';
                    css += selector + ' .testimonials-track:not(.tns-slider) .testimonial-item:nth-child(n+' + ( items.size + 1 ) + ') { display: none; }';
                    css += selector + ' .testimonials-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; }';
                }

                for (let i = 0; i < breakpoints.length - 1; i++) {
                    items = model.get('settings').get('sg_setting_slide_show_responsive_' + breakpoints[i].key),

                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item { width: calc(100% / ' + items.size + '); } }';
                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .testimonials-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                }

                if (breakpoints.length > 0) {
                    items = model.get('settings').get('sg_setting_slide_show_responsive_' + breakpoints[breakpoints.length - 1].key),

                    css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                    css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item { width: calc(100% / ' + items.size + '); } }';
                    css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .testimonial-item:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                    css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                }
            }

            // Client logo slide show predefine CSS
            if ('jkit_client_logo' == widgetType) {
                let items = model.get('settings').get('sg_setting_slide_show_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-client-logo';

                    if (breakpoints.length > 0) {
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .client-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .client-track:not(.tns-slider) .client-slider { width: calc(100% / ' + items.size + '); } }';
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .client-track:not(.tns-slider) .client-slider:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                        css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .client-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                    } else {
                        css += selector + ' .client-track:not(.tns-slider) { display: flex; flex-direction: row; }';
                        css += selector + ' .client-track:not(.tns-slider) .client-slider { width: calc(100% / ' + items.size + '); }';
                        css += selector + ' .client-track:not(.tns-slider) .client-slider:nth-child(n+' + ( items.size + 1 ) + ') { display: none; }';
                        css += selector + ' .client-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; }';
                    }
    
                    for (let i = 0; i < breakpoints.length - 1; i++) {
                        items = model.get('settings').get('sg_setting_slide_show_responsive_' + breakpoints[i].key),
    
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .client-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .client-track:not(.tns-slider) .client-slider { width: calc(100% / ' + items.size + '); } }';
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .client-track:not(.tns-slider) .client-slider:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                        css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .client-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                    }
    
                    if (breakpoints.length > 0) {
                        items = model.get('settings').get('sg_setting_slide_show_responsive_' + breakpoints[breakpoints.length - 1].key),
    
                        css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) { display: flex; flex-direction: row; } }';
                        css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .client-slider { width: calc(100% / ' + items.size + '); } }';
                        css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider) .client-slider:nth-child(n+' + ( items.size + 1 ) + ') { display: none; } }';
                        css += '@media (max-width: ' + (breakpoints[breakpoints.length - 1].value) + 'px) {' + selector + ' .testimonials-track:not(.tns-slider):not(:nth-child(' + items.size + ')) { margin-right: 10px; } }';
                    }
            }

            // Mailchimp inline mobile CSS
            if ('jkit_mailchimp' == widgetType) {
                const mobile_breakpoints = breakpoints.filter(p => p.key === 'mobile'),
                    style = model.get('settings').get('sg_form_style'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-mailchimp';

                if (mobile_breakpoints.length > 0 && style === 'inline') {
                    const breakpoint_value = mobile_breakpoints[0].value;
                    
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.style-inline .jkit-form-wrapper.extra-fields .jkit-submit-input-holder{ -webkit-box-flex:0; -ms-flex:0 0 100%; flex:0 0 100%; max-width:100%; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.jeg-elementor-kit.jkit-mailchimp.style-inline .jkit-form-wrapper.extra-fields .jkit-input-wrapper:nth-last-child(2) { margin-right: 0!important; } }';
                }
            }

            // Tabs mobile CSS
            if ('jkit_tabs' == widgetType) {
                const mobile_breakpoints = breakpoints.filter(p => p.key === 'mobile'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-tabs';

                if (mobile_breakpoints.length > 0) {
                    const breakpoint_value = mobile_breakpoints[0].value;
                    
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .tab-nav-list { -ms-flex-wrap: wrap; flex-wrap: wrap; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-flow: row wrap; flex-flow: row wrap; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .tab-nav-list .tab-nav { -webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .tab-nav-list.caret-on .tab-nav.active::after { display: none; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.layout-vertical { -ms-flex-wrap: wrap; flex-wrap: wrap; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.layout-vertical .tab-navigation { -webkit-box-flex: 1; -ms-flex: 1 100%; flex: 1 100%; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.layout-vertical .tab-nav-list { -webkit-box-flex: 1; -ms-flex: 1 100%; flex: 1 100%; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.layout-vertical .tab-nav-list .tab-nav { width: 100%; height: auto !important; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.layout-vertical .tab-nav-list.caret-on .tab-nav.active::after { display: none; } }';
                }
            }

            // Post Block breakpoint CSS
            if ('jkit_post_block' == widgetType) {
                const type = model.get('settings').get('sg_content_postblock_type'),
                    content_breakpoint = model.get('settings').get('sg_content_breakpoint'),
                    custom_breakpoints = breakpoints.filter(p => p.key === content_breakpoint),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-postblock';

                if (custom_breakpoints.length > 0) {
                    const breakpoint_value = custom_breakpoints[0].value;

                    if (type === 'type-1') {
                        css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.postblock-type-1 .jkit-post { display: block; -webkit-box-align: stretch; -ms-flex-align: stretch; align-items: stretch; } }';
                        css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.postblock-type-1 .jkit-thumb { -webkit-box-flex: 1; -ms-flex: 1 0 auto; flex: 1 0 auto; max-width: 100%; } }';
                    } else if (type === 'type-4') {
                        css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.postblock-type-4 .jkit-post { display: block; } }';
                        css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + '.postblock-type-4 .jkit-thumb { -webkit-box-ordinal-group: 1; -ms-flex-order: 0; order: 0; -webkit-box-flex: 1; -ms-flex: 1 0 auto; flex: 1 0 auto; max-width: 100%; } }';
                    }
                }
            }

            // Gallery grid CSS
            if ('jkit_gallery' == widgetType) {
                let column = model.get('settings').get('sg_setting_column_responsive'),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-gallery';

                if (breakpoints.length > 0) {
                    css += '@media (min-width: ' + (breakpoints[0].value + 1) + 'px) {' + selector + ' .gallery-items .gallery-item-wrap { width: calc(100% / ' + parseInt(column.size).toString() + ' ); float: left; } }';
                } else {
                    css += selector + ' .gallery-items .gallery-item-wrap { width: calc(100% / ' + parseInt(column.size).toString() + ' ); float: left; }';
                }

                for (let i = 0; i < breakpoints.length - 1; i++) {
                    column = model.get('settings').get('sg_setting_column_responsive_' + breakpoints[i].key),
                    css += '@media (min-width: ' + (breakpoints[i + 1].value + 1) + 'px) and (max-width: ' + breakpoints[i].value + 'px) {' + selector + ' .gallery-items .gallery-item-wrap { width: calc(100% / ' + parseInt(column.size).toString() + ' ); float: left; } }';
                }

                if (breakpoints.length > 0) {
                    column = model.get('settings').get('sg_setting_column_responsive_' + breakpoints[breakpoints.length - 1].key);
                    css += '@media (max-width: ' + breakpoints[breakpoints.length - 1].value + 'px) {' + selector + ' .gallery-items .gallery-item-wrap { width: calc(100% / ' + parseInt(column.size).toString() + ' ); float: left; } }';
                }
            }

            // Nav Menu breakpoint CSS
            if ('jkit_nav_menu' == widgetType) {
                const content_breakpoint = model.get('settings').get('sg_menu_breakpoint'),
                    custom_breakpoints = breakpoints.filter(p => p.key === content_breakpoint),
                    selector = '.elementor-element.elementor-element-' + model.get('id') + ' .jeg-elementor-kit.jkit-nav-menu';

                if (custom_breakpoints.length > 0) {
                    const breakpoint_value = custom_breakpoints[0].value;

                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-hamburger-menu { display: block; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper { width: 100%; max-width: 360px; border-radius: 0; background-color: #f7f7f7; width: 100%; position: fixed; top: 0; left: -110%; height: 100%!important; box-shadow: 0 10px 30px 0 rgba(255,165,0,0); overflow-y: auto; overflow-x: hidden; padding-top: 0; padding-left: 0; padding-right: 0; display: flex; flex-direction: column-reverse; justify-content: flex-end; -moz-transition: left .6s cubic-bezier(.6,.1,.68,.53); -webkit-transition: left .6s cubic-bezier(.6,.1,.68,.53); -o-transition: left .6s cubic-bezier(.6,.1,.68,.53); -ms-transition: left .6s cubic-bezier(.6,.1,.68,.53); transition: left .6s cubic-bezier(.6,.1,.68,.53); } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper.active { left: 0; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu-container { overflow-y: hidden; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-nav-identity-panel { padding: 10px 0px 10px 0px; display: block; position: relative; z-index: 5; width: 100%; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-nav-identity-panel .jkit-nav-site-title { display: inline-block; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-nav-identity-panel .jkit-close-menu { display: block; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu { display: block; height: 100%; overflow-y: auto; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li.menu-item-has-children > a i { margin-left: auto; border: 1px solid var(--jkit-border-color); border-radius: 3px; padding: 4px 15px; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li.menu-item-has-children > a svg { margin-left: auto; border: 1px solid var(--jkit-border-color); border-radius: 3px; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li.menu-item-has-children .sub-menu { position: inherit; box-shadow: none; background: none; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li { display: block; width: 100%; position: inherit; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li .sub-menu { display: none; max-height: 2500px; opacity: 0; visibility: hidden; transition: max-height 5s ease-out; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li .sub-menu.dropdown-open { display: block; opacity: 1; visibility: visible; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li a { display: block; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li a i { float: right; } }';
                    css += '@media (max-width: ' + breakpoint_value + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu li a svg { float: right } }';
                    css += '@media (min-width: ' + (breakpoint_value + 1) + 'px) {' + selector + ' .jkit-menu-wrapper .jkit-menu-container { height: 100%; } }';
                }
            }
        }

        return css;
    });
})(jQuery);