<?php
/**
 * Dashboard User Data Template
 *
 * @author Jegstudio
 * @since 1.3.0
 * @package jeg-element
 */

$user_data     = get_option( 'jkit_user_data' );
$mailchimp_api = is_array( $user_data ) && isset( $user_data['mailchimp']['api_key'] ) ? $user_data['mailchimp']['api_key'] : '';
?>

<div class="jkit-dashboard-body-wrap">
	<form method="POST" id="jkit-user-data-form">
		<div id="jkit-form-content">
			<div class="jkit-form-tab ">
				<div class="jkit-form-content">
					<div class="jkit-form-info">
						<span class="jkit-form-name"><?php echo esc_html__( 'Mailchimp', 'jeg-elementor-kit' ); ?></span>
					</div>
				</div>
				<div class="jkit-form-tab-content">
					<div class="jkit-form-input-group mailchimp-api-key">
						<label for="data[mailchimp][api_key]">API Key</label>
						<input type="text" id="data[mailchimp][api_key]" name="data[mailchimp][api_key]" value="<?php echo esc_html( $mailchimp_api ); ?>">
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
