<?php
/**
 * Plugin Name: Bacon Ipsum Block
 * Plugin URI:  https://github.com/chrismccoy/bacon-ipsum-block
 * Description: A WordPress block that generates bacon ipsum text via the baconipsum.com API.
 * Version:     1.0.0
 * Author:      Chris McCoy
 * Author URI:  https://github.com/chrismccoy
 * Text Domain: bacon-ipsum
 */

// Prevent direct file access for security.
defined('ABSPATH') || exit;

/**
 * Registers the Bacon Ipsum block and its assets.
 */
function bacon_ipsum_block_register() {
    /*
     * Register the editor script.
     */
    wp_register_script(
        'bacon-ipsum-block-editor',
        plugins_url('js/block.min.js', __FILE__),
        array(
            'wp-blocks',
            'wp-element',
            'wp-block-editor',
            'wp-components',
            'wp-i18n'
        ),
        '1.0',
        true
    );

    /*
     * Register the block type.
     */
    register_block_type('bacon-ipsum/generator', array(
        'editor_script' => 'bacon-ipsum-block-editor',
        'attributes'    => array(
            'type' => array(
                'type'    => 'string',
                'default' => 'all-meat',
            ),
            'paras' => array(
                'type'    => 'number',
                'default' => 3,
            ),
            'startWithLorem' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'content' => array(
                'type'     => 'string',
                'source'   => 'html',
                'selector' => '.bacon-ipsum-content',
                'default'  => '',
            ),
        ),
    ));
}

add_action('init', 'bacon_ipsum_block_register');
