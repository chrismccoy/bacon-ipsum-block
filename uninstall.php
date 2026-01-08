<?php
/**
 * Uninstall script.
 * Runs when the plugin is deleted
 */

// Exit if accessed directly or not uninstalling.
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Clean up plugin data on uninstall.
 */
function bacon_ipsum_uninstall() {
    // Flush cache.
    wp_cache_flush_group('bacon_ipsum');

    // Clear any transients.
    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_bacon_ipsum_%'"
    );
    $wpdb->query(
        "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_bacon_ipsum_%'"
    );
}

bacon_ipsum_uninstall();
