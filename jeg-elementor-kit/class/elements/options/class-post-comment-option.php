<?php
/**
 * Post Comment Option Class
 *
 * @package jeg-elementor-kit
 * @author Jegstudio
 * @since 1.5.0
 */

namespace Jeg\Elementor_Kit\Elements\Options;

/**
 * Class Post_Comment_Option
 *
 * @package Jeg\Elementor_Kit\Elements\Options
 */
class Post_Comment_Option extends Option_Abstract {
	/**
	 * Show color scheme flag for element.
	 *
	 * @return bool
	 */
	public function show_color_scheme() {
		return false;
	}

	/**
	 * Compatibility column
	 *
	 * @return array
	 */
	public function compatible_column() {
		return array();
	}

	/**
	 * Override function to remove compatible column alert
	 */
	public function set_compatible_column_option() {
	}

	/**
	 * Element name
	 *
	 * @return string
	 */
	public function get_element_name() {
		return esc_html__( 'JKit - Post Comment', 'jeg-elementor-kit' );
	}

	/**
	 * Element category
	 *
	 * @return string
	 */
	public function get_category() {
		return esc_html__( 'Jeg Elementor Kit - Single Post', 'jeg-elementor-kit' );
	}

	/**
	 * Element options
	 */
	public function set_options() {
		$this->set_style_option();
		$this->set_element_options();

		parent::set_options();
	}

	/**
	 * Option segments
	 */
	public function set_segments() {
		$this->segments['segment_comment'] = array(
			'name'     => esc_html__( 'Post Comment', 'jeg-elementor-kit' ),
			'priority' => 10,
		);

		$this->set_style_segment();
	}

	/**
	 * Set element option
	 */
	public function set_element_options() {
		$this->options['sg_comment_notice'] = array(
			'type'    => 'raw',
			'title'   => '',
			'segment' => 'segment_comment',
			'raw'     => esc_html__( 'This widget uses the currently active theme comments design and layout to display the comment form and comments.', 'jeg-elementor-kit' ),
			'classes' => 'elementor-descriptor',
		);
	}
}
