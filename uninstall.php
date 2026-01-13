<?php
/**
 * Uninstall Handler
 *
 * Fired when the plugin is uninstalled via the WordPress admin.
 * Performs cleanup tasks and removes plugin data if necessary.
 *
 * @package BaconIpsumBlock
 * @since   1.0.0
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Clean up plugin options and data.
 *
 * This plugin stores all content in post content (not as metadata),
 * so there's minimal cleanup needed. Content persists after uninstall
 * by design, as it's part of the post content.
 */

// Option to remove plugin options (currently none, but reserved for future use).
// delete_option( 'bacon_ipsum_block_version' );
// delete_site_option( 'bacon_ipsum_block_version' );

/**
 * Clear any cached data (if applicable).
 */
wp_cache_flush();

/**
 * Fire an action for extensibility.
 *
 * Allows other plugins or custom code to hook into the uninstall process
 * and perform additional cleanup tasks.
 *
 * @since 1.0.0
 */
do_action( 'bacon_ipsum_block_uninstall' );
