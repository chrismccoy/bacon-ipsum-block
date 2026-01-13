<?php
/**
 * Plugin Name: Bacon Ipsum Block
 * Plugin URI:  https://github.com/chrismccoy/bacon-ipsum-block
 * Description: A WordPress block that generates bacon ipsum text via the baconipsum.com API.
 * Version:     1.0.0
 * Author:      Chris McCoy
 * Author URI:  https://github.com/chrismccoy
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: bacon-ipsum
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 *
 * @package BaconIpsumBlock
 */

// Prevent direct file access for security.
defined( 'ABSPATH' ) || exit;

// Define plugin constants.
define( 'BACON_IPSUM_BLOCK_VERSION', '1.0.0' );
define( 'BACON_IPSUM_BLOCK_FILE', __FILE__ );
define( 'BACON_IPSUM_BLOCK_PATH', plugin_dir_path( __FILE__ ) );
define( 'BACON_IPSUM_BLOCK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Load the main plugin class.
 */
require_once BACON_IPSUM_BLOCK_PATH . 'includes/class-bacon-ipsum-block.php';

/**
 * Initialize the plugin.
 *
 * Returns the main instance of Bacon_Ipsum_Block to prevent the need
 * to use globals and allows for proper encapsulation.
 *
 * @since 1.0.0
 * @return Bacon_Ipsum_Block
 */
function bacon_ipsum_block() {
	return Bacon_Ipsum_Block::instance( BACON_IPSUM_BLOCK_FILE );
}

// Initialize the plugin.
bacon_ipsum_block();

/**
 * Register activation hook.
 *
 * Runs when the plugin is activated via the WordPress admin.
 */
register_activation_hook( __FILE__, array( 'Bacon_Ipsum_Block', 'activate' ) );

/**
 * Register deactivation hook.
 *
 * Runs when the plugin is deactivated via the WordPress admin.
 */
register_deactivation_hook( __FILE__, array( 'Bacon_Ipsum_Block', 'deactivate' ) );
