<?php
/**
 * Asset Management Class
 *
 * Handles registration and enqueuing of scripts and styles for the block.
 *
 * @package BaconIpsumBlock
 * @since   1.0.0
 */

// Prevent direct file access.
defined( 'ABSPATH' ) || exit;

/**
 * Manages asset registration and enqueuing for the Bacon Ipsum Block.
 *
 * This class centralizes all asset-related functionality including script
 * registration, dependency management, and cache busting.
 *
 * @since 1.0.0
 */
class Bacon_Ipsum_Assets {

	/**
	 * Plugin URL.
	 *
	 * @var string
	 */
	private $plugin_url;

	/**
	 * Plugin directory path.
	 *
	 * @var string
	 */
	private $plugin_dir;

	/**
	 * Constructor.
	 *
	 * @param string $plugin_url Plugin URL.
	 * @param string $plugin_dir Plugin directory path.
	 */
	public function __construct( $plugin_url, $plugin_dir ) {
		$this->plugin_url = $plugin_url;
		$this->plugin_dir = $plugin_dir;
	}

	/**
	 * Register the block editor script.
	 *
	 * Registers the JavaScript file that contains the block definition
	 * with proper dependencies and version management.
	 *
	 * @since 1.0.0
	 */
	public function register_block_script() {
		$script_path = 'js/block.min.js';
		$script_url  = $this->plugin_url . $script_path;
		$script_file = $this->plugin_dir . '/' . $script_path;

		// Use file modification time for cache busting in development.
		$version = Bacon_Ipsum_Block::VERSION;
		if ( file_exists( $script_file ) ) {
			$version = filemtime( $script_file );
		}

		// Register the editor script with all required dependencies.
		wp_register_script(
			'bacon-ipsum-block-editor',
			$script_url,
			$this->get_script_dependencies(),
			$version,
			true
		);

		// Localize script with configuration data.
		$this->localize_script();
	}

	/**
	 * Get script dependencies.
	 *
	 * Returns array of WordPress script handles that the block depends on.
	 * These are core WordPress scripts that provide the block editor APIs.
	 *
	 * @since 1.0.0
	 * @return array Script dependencies.
	 */
	private function get_script_dependencies() {
		return array(
			'wp-blocks',       // Block registration and block editor store.
			'wp-element',      // React-like element creation and hooks.
			'wp-block-editor', // Block editor components (RichText, InspectorControls, etc).
			'wp-components',   // UI components (Button, SelectControl, etc).
			'wp-i18n',         // Internationalization functions.
		);
	}

	/**
	 * Localize script with configuration data.
	 *
	 * Passes PHP data to JavaScript, including API endpoints,
	 * plugin configuration, and any dynamic settings.
	 *
	 * @since 1.0.0
	 */
	private function localize_script() {
		$config = array(
			'version'    => Bacon_Ipsum_Block::VERSION,
			'apiUrl'     => 'https://baconipsum.com/api/',
			'pluginUrl'  => $this->plugin_url,
			'textDomain' => Bacon_Ipsum_Block::TEXT_DOMAIN,
			'nonce'      => wp_create_nonce( 'bacon_ipsum_block' ),
		);

		/**
		 * Filter the JavaScript configuration data.
		 *
		 * Allows other plugins or themes to modify the configuration
		 * passed to the JavaScript layer.
		 *
		 * @since 1.0.0
		 *
		 * @param array $config Configuration data array.
		 */
		$config = apply_filters( 'bacon_ipsum_block_js_config', $config );

		wp_localize_script(
			'bacon-ipsum-block-editor',
			'baconIpsumConfig',
			$config
		);
	}

	/**
	 * Get inline script for additional configuration.
	 *
	 * Returns JavaScript code to be added inline after the main script.
	 * Useful for small snippets that don't warrant a separate file.
	 *
	 * @since 1.0.0
	 * @return string Inline JavaScript code.
	 */
	public function get_inline_script() {
		return "console.log('Bacon Ipsum Block v" . Bacon_Ipsum_Block::VERSION . " loaded');";
	}

	/**
	 * Enqueue block editor styles (if needed in future).
	 *
	 * Placeholder method for registering block editor styles.
	 * Currently not needed as all styling is done via the block itself.
	 *
	 * @since 1.0.0
	 */
	public function register_block_styles() {
		// Reserved for future use if block-specific styles are needed.
		// Example:
		// wp_register_style(
		//     'bacon-ipsum-block-editor',
		//     $this->plugin_url . 'css/editor.css',
		//     array( 'wp-edit-blocks' ),
		//     Bacon_Ipsum_Block::VERSION
		// );
	}

	/**
	 * Get asset file path.
	 *
	 * Utility method to get the full path to an asset file.
	 *
	 * @since 1.0.0
	 * @param string $relative_path Relative path to asset.
	 * @return string Full file path.
	 */
	public function get_asset_path( $relative_path ) {
		return $this->plugin_dir . '/' . ltrim( $relative_path, '/' );
	}

	/**
	 * Get asset URL.
	 *
	 * Utility method to get the URL to an asset file.
	 *
	 * @since 1.0.0
	 * @param string $relative_path Relative path to asset.
	 * @return string Asset URL.
	 */
	public function get_asset_url( $relative_path ) {
		return $this->plugin_url . ltrim( $relative_path, '/' );
	}
}
