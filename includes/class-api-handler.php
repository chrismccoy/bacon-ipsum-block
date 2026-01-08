<?php
/**
 * API Handler for Bacon Ipsum.
 */

namespace BaconIpsum;

defined('ABSPATH') || exit;

/**
 * API Handler Class.
 */
class API_Handler {
    /**
     * API base URL.
     */
    private const API_URL = 'https://baconipsum.com/api/';

    /**
     * REST namespace.
     */
    private const REST_NAMESPACE = 'bacon-ipsum/v1';

    /**
     * Cache manager instance.
     */
    private $cache_manager;

    /**
     * Constructor.
     */
    public function __construct(Cache_Manager $cache_manager) {
        $this->cache_manager = $cache_manager;
    }

    /**
     * Register REST API routes.
     */
    public function register_routes() {
        register_rest_route(
            self::REST_NAMESPACE,
            '/generate',
            [
                'methods' => 'POST',
                'callback' => [$this, 'handle_generate_request'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => $this->get_endpoint_args(),
            ]
        );
    }

    /**
     * Get endpoint arguments schema.
     */
    private function get_endpoint_args() {
        return [
            'type' => [
                'required' => false,
                'type' => 'string',
                'enum' => ['all-meat', 'meat-and-filler'],
                'default' => 'all-meat',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'paras' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 10,
                'default' => 3,
            ],
            'start_with_lorem' => [
                'required' => false,
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }

    /**
     * Check permissions for API access.
     */
    public function check_permissions() {
        return current_user_can('edit_posts');
    }

    /**
     * Handle generate request.
     */
    public function handle_generate_request($request) {
        $type = $request->get_param('type');
        $paras = $request->get_param('paras');
        $start_with_lorem = $request->get_param('start_with_lorem');

        // Try to get from cache first.
        $cache_key = $this->cache_manager->generate_key(
            $type,
            $paras,
            $start_with_lorem
        );
        $cached_data = $this->cache_manager->get($cache_key);

        if (false !== $cached_data) {
            return rest_ensure_response([
                'success' => true,
                'data' => $cached_data,
                'cached' => true,
            ]);
        }

        // Fetch from API.
        $result = $this->fetch_from_api($type, $paras, $start_with_lorem);

        if (is_wp_error($result)) {
            return $result;
        }

        // Cache the result.
        $this->cache_manager->set($cache_key, $result);

        return rest_ensure_response([
            'success' => true,
            'data' => $result,
            'cached' => false,
        ]);
    }

    /**
     * Fetch data from Bacon Ipsum API.
     */
    private function fetch_from_api($type, $paras, $start_with_lorem) {
        $url = add_query_arg(
            [
                'format' => 'json',
                'type' => $type,
                'paras' => $paras,
                'start-with-lorem' => $start_with_lorem ? '1' : '0',
            ],
            self::API_URL
        );

        $response = wp_remote_get($url, [
            'timeout' => 15,
            'sslverify' => true,
        ]);

        if (is_wp_error($response)) {
            return new \WP_Error(
                'api_request_failed',
                __('Failed to connect to Bacon Ipsum API.', 'bacon-ipsum'),
                ['status' => 500]
            );
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            return new \WP_Error(
                'api_request_failed',
                sprintf(
                    __('API returned status code: %d', 'bacon-ipsum'),
                    $status_code
                ),
                ['status' => $status_code]
            );
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error(
                'invalid_json',
                __('Invalid JSON response from API.', 'bacon-ipsum'),
                ['status' => 500]
            );
        }

        if (!is_array($data) || empty($data)) {
            return new \WP_Error(
                'empty_response',
                __('API returned empty response.', 'bacon-ipsum'),
                ['status' => 500]
            );
        }

        return $data;
    }
}
