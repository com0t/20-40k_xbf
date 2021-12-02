<?php
/**
 * Video Button View Class
 *
 * @package jeg-elementor-kit
 * @author Jegstudio
 * @since 1.2.0
 */

namespace Jeg\Elementor_Kit\Elements\Views;

/**
 * Class Video_Button_View
 *
 * @package Jeg\Elementor_Kit\Elements\Views
 */
class Video_Button_View extends View_Abstract {
	/**
	 * Build block content
	 */
	public function build_content() {
		$url   = esc_url( $this->attribute['sg_video_url'] );
		$class = 'jkit-video-popup-btn';

		if ( 'yes' === $this->attribute['sg_video_glow_enable'] ) {
			$class .= ' glow-enable';
		}

		$content = $this->render_url_element(
			array(
				'url'               => $url,
				'is_external'       => 'off',
				'nofollow'          => 'off',
				'custom_attributes' => '',
			),
			null,
			$class,
			$this->render_content()
		);

		return $this->render_wrapper( 'video-button', $content, array(), $this->render_data() );
	}

	/**
	 * Render content
	 *
	 * @return mixed
	 */
	private function render_content() {
		$icon    = null;
		$text    = null;
		$content = null;

		$button_type = $this->attribute['sg_video_button_style'];
		$icon_enable = $this->attribute['sg_video_button_icon_enable'];
		$position    = $this->attribute['sg_video_button_icon_position'];

		if ( ( 'icon' === $button_type || 'both' === $button_type ) && 'yes' === $icon_enable ) {
			$icon = $this->render_icon_element( $this->attribute['sg_video_button_icon'] );
		}

		if ( ( 'text' === $button_type || 'both' === $button_type ) ) {
			$text = '<span>' . esc_attr( $this->attribute['sg_video_button_title'] ) . '</span>';
		}

		if ( 'both' === $button_type && 'before' === $position ) {
			$content = $icon . $text;
		} else {
			$content = $text . $icon;
		}

		$content = '<span class="icon-position-' . $position . '">' . $content . '</span>';

		return $content;
	}

	/**
	 * Get URL with parameters
	 *
	 * @return string
	 */
	private function render_data() {
		$type = $this->attribute['sg_video_type'];
		$data = array(
			'autoplay' => 'yes' === $this->attribute['sg_video_auto_play'] ? '1' : '0',
			'loop'     => 'yes' === $this->attribute['sg_video_loop'] ? '1' : '0',
			'controls' => 'yes' === $this->attribute['sg_video_player_control'] ? '1' : '0',
			'type'     => $type,
		);

		if ( 'youtube' === $type ) {
			$data['start'] = esc_attr( $this->attribute['sg_video_start_time'] ) ? '1' : '0';
			$data['end']   = esc_attr( $this->attribute['sg_video_end_time'] ) ? '1' : '0';
		} else {
			$data['mute']     = 'yes' === $this->attribute['sg_video_mute'] ? '1' : '0';
			$data['title']    = 'yes' === $this->attribute['sg_video_intro_title'] ? '1' : '0';
			$data['portrait'] = 'yes' === $this->attribute['sg_video_intro_portrait'] ? '1' : '0';
			$data['byline']   = 'yes' === $this->attribute['sg_video_intro_byline'] ? '1' : '0';
		}

		return $data;
	}
}
