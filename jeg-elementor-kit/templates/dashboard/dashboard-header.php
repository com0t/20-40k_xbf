<?php
/**
 * Dashboard Header
 *
 * @author Jegstudio
 * @since 1.3.0
 * @package jeg-element
 */

use Jeg\Elementor_Kit\Dashboard\Dashboard;

$dashboard = new Dashboard();
?>
<div class="jkit-dashboard-header-wrap">
	<h2 class="jkit-dashboard-header-tab">
		<?php
		$allmenu = $dashboard->get_admin_menu();
		foreach ( $allmenu as $menu ) {
			$tabactive = isset( $_GET['page'] ) && ( $_GET['page'] === $menu['slug'] ) ? 'tab-active' : '';
			$pageurl   = menu_page_url( $menu['slug'], false );
			if ( 'customize.php' === $menu['slug'] ) {
				$pageurl = admin_url() . 'customize.php';
			}
			?>
			<a href="<?php echo esc_url( $pageurl ); ?>" class="<?php echo esc_attr( $tabactive ); ?>"><?php echo esc_html( $menu['title'] ); ?></a>
			<?php
		}
		?>
	</h2>
</div>
