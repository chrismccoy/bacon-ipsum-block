<?php
/**
 * Main Bacon Ipsum Block Plugin Class
 *
 * @package BaconIpsumBlock
 * @since   1.0.0
 */

// Prevent direct file access.
defined( 'ABSPATH' ) || exit;

/**
 * Main plugin class that handles initialization and coordination.
 *
 * This class follows the singleton pattern to ensure only one instance
 * exists throughout the WordPress lifecycle.
 *
 * @since 1.0.0
 */
class Bacon_Ipsum_Block {

	/**
	 * Single instance of the class.
	 *
	 * @var Bacon_Ipsum_Block|null
	 */
	private static $instance = null;

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	const VERSION = '1.0.0';

	/**
	 * Plugin text domain.
	 *
	 * @var string
	 */
	const TEXT_DOMAIN = 'bacon-ipsum';

	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	const BLOCK_NAMESPACE = 'bacon-ipsum/generator';

	/**
	 * Plugin file path.
	 *
	 * @var string
	 */
	private $plugin_file;

	/**
	 * Plugin directory path.
	 *
	 * @var string
	 */
	private $plugin_dir;

	/**
	 * Plugin URL.
	 *
	 * @var string
	 */
	private $plugin_url;

	/**
	 * Asset manager instance.
	 *
	 * @var Bacon_Ipsum_Assets
	 */
	private $assets;

	/**
	 * Get the singleton instance.
	 *
	 * @param string $plugin_file Main plugin file path.
	 * @return Bacon_Ipsum_Block
	 */
	public static function instance( $plugin_file = '' ) {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self( $plugin_file );
		}
		return self::$instance;
	}

	/**
	 * Constructor - Private to enforce singleton pattern.
	 *
	 * @param string $plugin_file Main plugin file path.
	 */
	private function __construct( $plugin_file ) {
		$this->plugin_file = $plugin_file;
		$this->plugin_dir  = dirname( $plugin_file );
		$this->plugin_url  = plugin_dir_url( $plugin_file );

		$this->load_dependencies();
		$this->init_hooks();
	}

	/**
	 * Load required dependencies.
	 *
	 * @since 1.0.0
	 */
	private function load_dependencies() {
		require_once $this->plugin_dir . '/includes/class-bacon-ipsum-assets.php';
	}

	/**
	 * Initialize WordPress hooks.
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		// Initialize the plugin on WordPress init.
		add_action( 'init', array( $this, 'init' ) );

		// Load text domain for translations.
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Initialize plugin components.
	 *
	 * Runs on the 'init' hook to ensure all WordPress functionality is available.
	 *
	 * @since 1.0.0
	 */
	public function init() {
		// Check if user has capability to edit posts.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		// Initialize asset management.
		$this->assets = new Bacon_Ipsum_Assets( $this->plugin_url, $this->plugin_dir );

		// Register the block.
		$this->register_block();
	}

	/**
	 * Load plugin text domain for translations.
	 *
	 * @since 1.0.0
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			self::TEXT_DOMAIN,
			false,
			dirname( plugin_basename( $this->plugin_file ) ) . '/languages'
		);
	}

	/**
	 * Register the Bacon Ipsum block type.
	 *
	 * Registers both the block script and the block type itself with
	 * all necessary attributes and configuration.
	 *
	 * @since 1.0.0
	 */
	private function register_block() {
		// Register editor script via asset manager.
		$this->assets->register_block_script();

		// Register the block type with attributes.
		register_block_type(
			self::BLOCK_NAMESPACE,
			array(
				'editor_script' => 'bacon-ipsum-block-editor',
				'attributes'    => $this->get_block_attributes(),
			)
		);
	}

	/**
	 * Get block attribute definitions.
	 *
	 * Defines the data structure for the block, including types,
	 * defaults, and how attributes are sourced from saved content.
	 *
	 * @since 1.0.0
	 * @return array Block attributes configuration.
	 */
	private function get_block_attributes() {
		return array(
			'type'           => array(
				'type'    => 'string',
				'default' => 'all-meat',
			),
			'paras'          => array(
				'type'    => 'number',
				'default' => 3,
			),
			'startWithLorem' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'content'        => array(
				'type'     => 'string',
				'source'   => 'html',
				'selector' => '.bacon-ipsum-content',
				'default'  => '',
			),
		);
	}

	/**
	 * Plugin activation hook callback.
	 *
	 * Runs when the plugin is activated. Checks system requirements.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		// Check WordPress version requirement.
		if ( version_compare( get_bloginfo( 'version' ), '5.8', '<' ) ) {
			wp_die(
				esc_html__( 'Bacon Ipsum Block requires WordPress 5.8 or higher.', self::TEXT_DOMAIN ),
				esc_html__( 'Plugin Activation Error', self::TEXT_DOMAIN ),
				array( 'back_link' => true )
			);
		}

		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * Plugin deactivation hook callback.
	 *
	 * Runs when the plugin is deactivated. Performs cleanup tasks.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * Get plugin version.
	 *
	 * @since 1.0.0
	 * @return string Plugin version number.
	 */
	public function get_version() {
		return self::VERSION;
	}

	/**
	 * Get plugin directory path.
	 *
	 * @since 1.0.0
	 * @return string Plugin directory path.
	 */
	public function get_plugin_dir() {
		return $this->plugin_dir;
	}

	/**
	 * Get plugin URL.
	 *
	 * @since 1.0.0
	 * @return string Plugin URL.
	 */
	public function get_plugin_url() {
		return $this->plugin_url;
	}

	/**
	 * Prevent cloning of the instance.
	 *
	 * @since 1.0.0
	 */
	private function __clone() {}

	/**
	 * Prevent unserializing of the instance.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {
		throw new Exception( 'Cannot unserialize singleton' );
	}
}
