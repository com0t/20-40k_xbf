<?php
/**
 * Jeg Elementor Kit Class
 *
 * @package jeg-elementor-kit
 * @author Jegstudio
 * @since 1.0.0
 */

namespace Jeg\Elementor_Kit;

use Jeg\Elementor_Kit\Ajax\Ajax;
use Jeg\Elementor_Kit\Dashboard\Dashboard;
use Jeg\Elementor_Kit\Assets\Asset;
use Jeg\Elementor_Kit\Elements\Element;
use Jeg\Elementor_Kit\Templates\Template;

/**
 * Class Init
 *
 * @package Jeg\Elementor_Kit
 */
class Init {
	/**
	 * Class Instance
	 *
	 * @var Init
	 */
	private static $instance;

	/**
	 * Init constructor.
	 */
	private function __construct() {
		$this->setup_init();
		$this->setup_hook();
	}

	/**
	 * Setup Classes
	 */
	private function setup_init() {
		Element::instance();
		Asset::instance();
		Ajax::instance();
		Dashboard::instance();
		Template::instance();
	}

	/**
	 * Setup Hooks
	 */
	private function setup_hook() {
		add_filter( 'body_class', array( $this, 'load_body_class' ) );
	}

	/**
	 * Get class instance
	 *
	 * @return Init
	 */
	public static function instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	/**
	 * Add body class
	 *
	 * @param array $classes Body classes.
	 */
	public function load_body_class( $classes ) {
		$classes[] = 'jkit-color-scheme';
		return $classes;
	}
}
