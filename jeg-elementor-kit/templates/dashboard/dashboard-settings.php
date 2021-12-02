<?php
/**
 * Dashboard Settings Template
 *
 * @author Jegstudio
 * @since 2.1.0
 * @package jeg-element
 */

$existing_global_styles_query = array(
	'meta_query'     => array(
		array(
			'key'   => '_elementor_template_type',
			'value' => 'kit',
		),
	),
	'post_type'      => 'elementor_library',
	'post_status'    => 'publish',
	'posts_per_page' => 50,
);
$current_active_global_style  = get_option( 'elementor_active_kit' );
$existing_global_styles       = get_posts( $existing_global_styles_query );

?>

<div class="jkit-dashboard-body-wrap">
	<form method="POST" id="jkit-settings-form">
		<div id="jkit-form-content">
			<div class="jkit-form-tab ">
				<div class="jkit-form-content">
					<div class="jkit-form-info">
						<span class="jkit-form-name"><?php echo esc_html__( 'Global Style', 'jeg-elementor-kit' ); ?></span>
					</div>
				</div>
				<div class="jkit-form-tab-content">
					<div class="jkit-form-input-group global-style-option">
						<label for="data[global_style]">Choose Global Style</label>
						<select id="data[global_style]" name="data[global_style]">
							<?php
							if ( empty( $existing_global_styles ) ) {
								echo '<option value="">No Global Styles Found</option>';
							} else {
								foreach ( $existing_global_styles as $post ) {
									$selected = '';
									if ( $current_active_global_style == $post->ID ) {
										$selected = 'selected';
									}
									echo '<option value="' . esc_html( $post->ID ) . '" ' . esc_html( $selected ) . '>' . esc_html( $post->post_title ) . '</option>';
								}
							}
							?>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="jkit-form-submit jkit-input-wraper">
			<button type="submit" class="jkit-submit"> 
				<i aria-hidden="true" class="fa fa-save"></i> <?php echo esc_html__( 'Save Changes', 'jeg-elementor-kit' ); ?>
			</button>
		</div>
	</form>
</div>
