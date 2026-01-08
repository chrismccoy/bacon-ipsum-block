<?php
/**
 * Block Registration handler.
 */

namespace BaconIpsum;

defined('ABSPATH') || exit;

/**
 * Block Registration Class.
 */
class Block_Registration {
    /**
     * Block name.
     */
    private const BLOCK_NAME = 'bacon-ipsum/generator';

    /**
     * Register the block.
     */
    public function register() {
        register_block_type(self::BLOCK_NAME, [
            'api_version' => 2,
            'editor_script_handles' => [],
            'attributes' => $this->get_block_attributes(),
            'render_callback' => [$this, 'render_block'],
        ]);
    }

    /**
     * Get block attributes.
     */
    private function get_block_attributes() {
        return [
            'type' => [
                'type' => 'string',
                'default' => 'all-meat',
            ],
            'paras' => [
                'type' => 'number',
                'default' => 3,
            ],
            'startWithLorem' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'content' => [
                'type' => 'string',
                'source' => 'html',
                'selector' => '.bacon-ipsum-content',
                'default' => '',
            ],
        ];
    }

    /**
     * Render block on frontend.
     */
    public function render_block($attributes) {
        $content = $attributes['content'] ?? '';

        if (empty($content)) {
            return '';
        }

        return sprintf(
            '<div class="wp-block-bacon-ipsum-generator"><div class="bacon-ipsum-content">%s</div></div>',
            wp_kses_post($content)
        );
    }

    /**
     * Enqueue editor assets.
     */
    public function enqueue_assets() {
        // Enqueue block
        wp_enqueue_script(
            'bacon-ipsum-block-editor',
            BACON_IPSUM_PLUGIN_URL . 'assets/js/block.js',
            [
                'wp-blocks',
                'wp-element',
                'wp-block-editor',
                'wp-components',
                'wp-i18n',
                'wp-api-fetch',
            ],
            BACON_IPSUM_VERSION,
            true
        );

        // Localize script with configuration.
        wp_localize_script('bacon-ipsum-block-editor', 'baconIpsumConfig', [
            'apiUrl' => rest_url('bacon-ipsum/v1/generate'),
            'nonce' => wp_create_nonce('wp_rest'),
            'version' => BACON_IPSUM_VERSION,
        ]);
    }
}
