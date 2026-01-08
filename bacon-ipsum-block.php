<?php
/**
 * Plugin Name: Bacon Ipsum Block
 * Plugin URI:  https://github.com/chrismccoy/bacon-ipsum-block
 * Description: A WordPress block that generates bacon ipsum text via the baconipsum.com API.
 * Version:     1.0.0
 * Author:      Chris McCoy
 * Author URI:  https://github.com/chrismccoy
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: bacon-ipsum
 * Domain Path: /languages
 */

namespace BaconIpsum;

// Prevent direct file access.
defined('ABSPATH') || exit;

/**
 * Plugin constants.
 */
define('BACON_IPSUM_VERSION', '1.0.0');
define('BACON_IPSUM_PLUGIN_FILE', __FILE__);
define('BACON_IPSUM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BACON_IPSUM_PLUGIN_URL', plugin_dir_url(__FILE__));
define('BACON_IPSUM_MIN_PHP', '7.4');
define('BACON_IPSUM_MIN_WP', '6.0');

/**
 * Include Plugin Classes
 */
require_once BACON_IPSUM_PLUGIN_DIR . 'includes/class-api-handler.php';
require_once BACON_IPSUM_PLUGIN_DIR . 'includes/class-cache-manager.php';
require_once BACON_IPSUM_PLUGIN_DIR . 'includes/class-block-registration.php';
require_once BACON_IPSUM_PLUGIN_DIR . 'includes/class-plugin.php';

/**
 * Initialize the plugin.
 */
function init_plugin() {
    // Check requirements.
    if (version_compare(PHP_VERSION, BACON_IPSUM_MIN_PHP, '<')) {
        add_action('admin_notices', __NAMESPACE__ . '\\php_version_notice');
        return;
    }

    if (version_compare(get_bloginfo('version'), BACON_IPSUM_MIN_WP, '<')) {
        add_action('admin_notices', __NAMESPACE__ . '\\wp_version_notice');
        return;
    }

    // Load text domain.
    add_action('init', __NAMESPACE__ . '\\load_textdomain');

    // Initialize plugin.
    Plugin::get_instance();
}

add_action('plugins_loaded', __NAMESPACE__ . '\\init_plugin');

/**
 * Load plugin text domain for translations.
 */
function load_textdomain() {
    load_plugin_textdomain(
        'bacon-ipsum',
        false,
        dirname(plugin_basename(BACON_IPSUM_PLUGIN_FILE)) . '/languages'
    );
}

/**
 * Display PHP version notice.
 */
function php_version_notice() {
    printf(
        '<div class="notice notice-error"><p>%s</p></div>',
        sprintf(
            /* translators: %s: Required PHP version */
            esc_html__(
                'Bacon Ipsum Block requires PHP %s or higher.',
                'bacon-ipsum'
            ),
            esc_html(BACON_IPSUM_MIN_PHP)
        )
    );
}

/**
 * Display WordPress version notice.
 */
function wp_version_notice() {
    printf(
        '<div class="notice notice-error"><p>%s</p></div>',
        sprintf(
            /* translators: %s: Required WordPress version */
            esc_html__(
                'Bacon Ipsum Block requires WordPress %s or higher.',
                'bacon-ipsum'
            ),
            esc_html(BACON_IPSUM_MIN_WP)
        )
    );
}
