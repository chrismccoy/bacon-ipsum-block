<?php
/**
 * Main plugin class.
 */

namespace BaconIpsum;

defined('ABSPATH') || exit;

/**
 * Main Plugin Class.
 */
final class Plugin {
    /**
     * Plugin instance.
     */
    private static $instance = null;

    /**
     * API Handler instance.
     */
    private $api_handler;

    /**
     * Block Registration instance.
     */
    private $block_registration;

    /**
     * Cache Manager instance.
     */
    private $cache_manager;

    /**
     * Get plugin instance.
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor.
     */
    private function __construct() {
        $this->init_components();
        $this->setup_hooks();
    }

    /**
     * Initialize plugin components.
     */
    private function init_components() {
        $this->cache_manager = new Cache_Manager();
        $this->api_handler = new API_Handler($this->cache_manager);
        $this->block_registration = new Block_Registration();
    }

    /**
     * Setup WordPress hooks.
     */
    private function setup_hooks() {
        add_action('init', [$this, 'register_block']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
    }

    /**
     * Register the block.
     */
    public function register_block() {
        $this->block_registration->register();
    }

    /**
     * Register REST API routes.
     */
    public function register_rest_routes() {
        $this->api_handler->register_routes();
    }

    /**
     * Enqueue block editor assets.
     */
    public function enqueue_editor_assets() {
        $this->block_registration->enqueue_assets();
    }

    /**
     * Get API handler.
     */
    public function get_api_handler() {
        return $this->api_handler;
    }

    /**
     * Get cache manager.
     */
    public function get_cache_manager() {
        return $this->cache_manager;
    }
}
