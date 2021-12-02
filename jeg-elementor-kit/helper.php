<?php
/**
 * Jeg Elementor Kit Helper
 *
 * @package jeg-elementor-kit
 * @author Jegstudio
 * @since 1.0.0
 */

if ( ! function_exists( 'jkit_get_menu_option' ) ) {
	/**
	 * Get menu list using cache
	 *
	 * @return array
	 */
	function jkit_get_menu_option() {
		$menus = wp_cache_get( 'menu', 'jeg-elementor-kit' );

		if ( ! $menus ) {
			$menus = wp_get_nav_menus();
			wp_cache_set( 'menu', $menus, 'jeg-elementor-kit' );
		}

		$menus = array_combine( wp_list_pluck( $menus, 'slug' ), wp_list_pluck( $menus, 'name' ) );

		return $menus;
	}
}

if ( ! function_exists( 'jkit_edit_post' ) ) {
	/**
	 * Get post edit link
	 *
	 * @param  int    $post_id  Post ID.
	 * @param  string $position Link position.
	 * @return bool|string
	 */
	function jkit_edit_post( $post_id, $position = 'left' ) {
		if ( current_user_can( 'edit_posts' ) ) {
			$url = get_edit_post_link( $post_id );

			return '<a class="jkit-edit-post ' . $position . '" href="' . $url . '" target="_blank">
				<i class="fas fa-pencil-alt"></i>
				<span>' . esc_html__( 'edit post', 'jeg-elementor-kit' ) . '</span>
			</a>';
		}

		return false;
	}
}

if ( ! function_exists( 'jkit_get_post_date' ) ) {
	/**
	 * Get post date
	 *
	 * @param  string       $format Get post format.
	 * @param  int|\WP_Post $post   Optional. Post ID or post object.
	 * @param  string       $type Date type.
	 * @return false|string
	 */
	function jkit_get_post_date( $format = '', $post = null, $type = '' ) {
		if ( 'published' === $type ) {
			return get_the_date( $format, $post );
		}

		return get_the_modified_date( $format, $post );
	}
}

if ( ! function_exists( 'jkit_get_post_ago_time' ) ) {
	/**
	 * Get time in ago format
	 *
	 * @param string       $type Date type.
	 * @param int|\WP_Post $post Optional. Post ID or post object.
	 * @return string
	 */
	function jkit_get_post_ago_time( $type, $post ) {
		if ( 'published' === $type ) {
			$output = jkit_ago_time( human_time_diff( get_the_time( 'U', $post ), time() ) );
		} else {
			$output = jkit_ago_time( human_time_diff( get_the_modified_time( 'U', $post ), time() ) );
		}

		return $output;
	}
}

if ( ! function_exists( 'jkit_ago_time' ) ) {
	/**
	 * Format Time ago string.
	 *
	 * @param  string $time time ago from now.
	 * @return string
	 */
	function jkit_ago_time( $time ) {
		return esc_html(
			sprintf(
				/* translators: 1: Time from now. */
				esc_html__( '%s ago', 'jeg-elementor-kit' ),
				$time
			)
		);
	}
}

if ( ! function_exists( 'jkit_get_comments_number' ) ) {
	/**
	 * Get comment number
	 *
	 * @param  int $post_id Post ID.
	 * @return mixed
	 */
	function jkit_get_comments_number( $post_id = 0 ) {
		$comments_number = get_comments_number( $post_id );

		return apply_filters( 'jkit_get_comments_number', $comments_number, $post_id );
	}
}

if ( ! function_exists( 'jkit_get_respond_link' ) ) {
	/**
	 * Get respond link
	 *
	 * @param  null $post_id Post ID.
	 * @return string
	 */
	function jkit_get_respond_link( $post_id = null ) {
		return esc_url( get_the_permalink( $post_id ) ) . '#respond';
	}
}

/** Start custom template directory */
if ( ! function_exists( 'jkit_get_template_part' ) ) {
	/**
	 * Get custom tempate directory
	 *
	 * @param string      $slug Template slug.
	 * @param string|null $name Template name.
	 * @param bool        $dir Template directory.
	 */
	function jkit_get_template_part( $slug, $name = null, $dir = JEG_ELEMENTOR_KIT_DIR ) {
		do_action( "jkit_get_template_part_{$slug}", $slug, $name, $dir );
		$templates = array();
		if ( isset( $name ) ) {
			$templates[] = "{$slug}-{$name}.php";
		}
		$templates[] = "{$slug}.php";
		if ( ! $dir ) {
			$dir = get_template_directory();
		}
		jkit_get_template_path( $templates, true, false, $dir );
	}
}

if ( ! function_exists( 'jkit_get_template_path' ) ) {
	/**
	 * Get custom template path
	 *
	 * @param array  $template_names Templates.
	 * @param bool   $load Load template.
	 * @param bool   $require_once Require once.
	 *
	 * @param string $dir Template directory.
	 *
	 * @return mixed
	 */
	function jkit_get_template_path( $template_names, $load = false, $require_once = true, $dir = JEG_ELEMENTOR_KIT_DIR ) {
		$located = '';
		if ( $dir ) {
			foreach ( (array) $template_names as $template_name ) {
				if ( ! $template_name ) {
					continue;
				}
				/* search file within the $dir only */
				if ( file_exists( $dir . $template_name ) ) {
					$located = $dir . $template_name;
					break;
				}
			}
			if ( $load && '' !== $located ) {
				load_template( $located, $require_once );
			}
		}

		return $located;
	}
}
/** End custom template directory */

if ( ! function_exists( 'jkit_get_nonce_identifier' ) ) {
	/**
	 * Get nonce identifier
	 *
	 * @return string
	 */
	function jkit_get_nonce_identifier() {
		return 'jkit-nonce';
	}
}

if ( ! function_exists( 'jkit_create_global_nonce' ) ) {
	/**
	 * Get nonce identifier
	 *
	 * @return string
	 */
	function jkit_create_global_nonce() {
		return wp_create_nonce( jkit_get_nonce_identifier() );
	}
}

if ( ! function_exists( 'jkit_load_resource_limit' ) ) {
	/**
	 * Number of limit we can load resouce to prevent system crash
	 *
	 * @return int
	 */
	function jkit_load_resource_limit() {
		return apply_filters( 'jkit_load_resource_limit', 25 );
	}
}

if ( ! function_exists( 'jkit_get_public_post_type_array' ) ) {
	/**
	 * Get public post type
	 *
	 * @return array
	 */
	function jkit_get_public_post_type_array() {
		$types = get_post_types(
			array(
				'public'  => true,
				'show_ui' => true,
			)
		);

		/** Remove header builder post type */
		foreach ( \Jeg\Elementor_Kit\Dashboard\Dashboard::post_type_list() as $list ) {
			unset( $types[ $list ] );
		}

		return array_keys( $types );
	}
}

if ( ! function_exists( 'jkit_get_element_data' ) ) {
	/**
	 * JKit Get Element Data
	 *
	 * @param $type
	 *
	 * @return array
	 */
	function jkit_get_element_data( $type ) {
		return array(
			'publish' => jkit_get_element( 'publish', $type ),
			'draft'   => jkit_get_element( 'draft', $type ),
		);
	}
}

if ( ! function_exists( 'jkit_get_element' ) ) {
	/**
	 * JKit Get Element
	 *
	 * @param $status
	 * @param $type
	 *
	 * @return array
	 */
	function jkit_get_element( $status, $type ) {
		$query = get_posts(
			array(
				'post_type'   => $type,
				'orderby'     => 'menu_order',
				'order'       => 'ASC',
				'post_status' => $status,
			)
		);

		$result = array();

		if ( $query ) {
			foreach ( $query as $post ) {
				$result[] = array(
					'id'    => $post->ID,
					'title' => $post->post_title,
					'url'   => \Jeg\Elementor_Kit\Dashboard\Dashboard::editor_url( $post->ID ),
				);
			}
		}

		wp_reset_postdata();

		return $result;
	}
}

if ( ! function_exists( 'jkit_extract_ids' ) ) {
	/**
	 * Extract ID from Query
	 *
	 * @param $items
	 *
	 * @return array
	 */
	function jkit_extract_ids( $items ) {
		$id = array();
		foreach ( $items as $item ) {
			$id[] = $item['id'];
		}

		return $id;
	}
}

if ( ! function_exists( 'jkit_remove_array' ) ) {
	/**
	 * Remove Array from List
	 *
	 * @param $key
	 * @param $array
	 *
	 * @return mixed
	 */
	function jkit_remove_array( $key, $array ) {
		if ( ( $key = array_search( $key, $array ) ) !== false ) {
			unset( $array[ $key ] );
		}

		return $array;
	}
}

if ( ! function_exists( 'jkit_get_elementor_saved_template_option' ) ) {
	/**
	 * Get elementor saved template option
	 *
	 * @return array
	 */
	function jkit_get_elementor_saved_template_option() {
		$options = array();

		$args = array(
			'post_type'      => 'elementor_library',
			'posts_per_page' => -1,
		);

		$page_templates = get_posts( $args );

		if ( ! empty( $page_templates ) && ! is_wp_error( $page_templates ) ) {
			foreach ( $page_templates as $post ) {
				$options[ $post->ID ] = $post->post_title;
			}
		}

		return $options;
	}
}

if ( ! function_exists( 'jkit_get_nonce_identifier' ) ) {
	/**
	 * Get nonce identifier
	 *
	 * @return string
	 */
	function jkit_get_nonce_identifier() {
		return 'jkit-nonce';
	}
}

if ( ! function_exists( 'jkit_create_global_nonce' ) ) {
	/**
	 * Get nonce identifier
	 *
	 * @return string
	 */
	function jkit_create_global_nonce() {
		return wp_create_nonce( jkit_get_nonce_identifier() );
	}
}

if ( ! function_exists( 'jkit_get_responsive_breakpoints' ) ) {
	/**
	 * Get Elementor responsive breakpoints
	 *
	 * @return array
	 */
	function jkit_get_responsive_breakpoints() {
		$breakpoints = array();

		if ( defined( 'ELEMENTOR_VERSION' ) && version_compare( ELEMENTOR_VERSION, '3.2.0', '>=' ) ) {
			$elementor = \Elementor\Plugin::$instance->breakpoints->get_active_breakpoints();

			foreach ( $elementor as $key => $breakpoint ) {
				array_push(
					$breakpoints,
					array(
						'key'   => $key,
						'value' => $breakpoint->get_value(),
					)
				);
			}
		} else {
			$elementor = \Elementor\Core\Responsive\Responsive::get_editable_breakpoints();

			array_push(
				$breakpoints,
				array(
					'key'   => 'tablet',
					'value' => isset( $elementor['lg'] ) ? strval( $elementor['lg'] - 1 ) : 1024,
				)
			);

			array_push(
				$breakpoints,
				array(
					'key'   => 'mobile',
					'value' => isset( $elementor['md'] ) ? strval( $elementor['md'] - 1 ) : 767,
				)
			);
		}

		usort(
			$breakpoints,
			function( $a, $b ) {
				return $b['value'] - $a['value'];
			}
		);

		return $breakpoints;
	}
}
