=== Bacon Ipsum Block ===
Contributors: chrismccoy
Tags: block, gutenberg, lorem ipsum, placeholder, bacon, text generator
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Generate meaty bacon-themed lorem ipsum placeholder text with a custom Gutenberg block.

== Description ==

Bacon Ipsum Block is a WordPress Gutenberg block that generates bacon-themed lorem ipsum placeholder text via the baconipsum.com API. Perfect for developers and designers who need engaging placeholder content while building WordPress sites.

= Features =

* **Easy to Use**: Add the block, configure settings, and generate bacon ipsum with one click
* **Fully Editable**: All generated content is editable directly in the block editor
* **Customizable Options**:
    * Choose between "All Meat" or "Meat and Filler" text types
    * Select 1-10 paragraphs
    * Option to start with "Bacon ipsum dolor sit amet"
* **No Build Required**: Uses vanilla JavaScript with no build step needed
* **Persistent Content**: Generated content is saved as regular HTML in post content
* **Responsive UI**: Clean, intuitive interface with sidebar controls
* **Translation Ready**: Fully internationalized and ready for translation

= How It Works =

1. Add the "Bacon Ipsum" block to your post or page
2. Configure your preferences (meat type, paragraph count, etc.)
3. Click "Generate Bacon Ipsum"
4. Edit the generated text as needed
5. Publish your content

The block fetches fresh bacon-themed text from baconipsum.com and saves it directly to your post content. Once generated, the text is fully editable and persists even if the plugin is deactivated.

= Developer Friendly =

* Clean, object-oriented PHP architecture
* Well-documented vanilla JavaScript (no JSX or build tools)
* Follows WordPress coding standards
* Extensible via WordPress hooks and filters
* Available on GitHub for contributions

= Privacy & External Services =

This plugin makes requests to the baconipsum.com API to generate placeholder text. The API request includes only the parameters you configure (text type, paragraph count). No personal data is transmitted. For more information, visit [https://baconipsum.com](https://baconipsum.com).

== Installation ==

= Automatic Installation =

1. Log in to your WordPress admin panel
2. Navigate to Plugins > Add New
3. Search for "Bacon Ipsum Block"
4. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin ZIP file
2. Log in to your WordPress admin panel
3. Navigate to Plugins > Add New > Upload Plugin
4. Choose the ZIP file and click "Install Now"
5. Activate the plugin

= From Source =

1. Clone the repository: `git clone https://github.com/chrismccoy/bacon-ipsum-block.git`
2. Upload the `bacon-ipsum-block` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Does this require a build step? =

No! This plugin uses vanilla JavaScript with no build tools required. The JavaScript is written using WordPress's `wp` global API, making it simple and maintainable.

= Can I edit the generated text? =

Yes! Once generated, the bacon ipsum text is fully editable using WordPress's RichText component. Edit it just like any other text in the block editor.

= Will my content disappear if I deactivate the plugin? =

No. The generated content is saved as regular HTML in your post content, so it persists even if the plugin is deactivated.

= What happens if the API is unavailable? =

The block includes error handling. If the API request fails, you'll see an error message with a "Try Again" button. The block will also log detailed error information to the browser console for debugging.

= Can I customize the API endpoint? =

Yes! Developers can filter the JavaScript configuration using the `bacon_ipsum_block_js_config` filter hook to modify the API URL and other settings.

= Is this block compatible with WordPress 6.0+? =

Yes! The block is built using modern WordPress APIs and is compatible with WordPress 5.8 and higher, including the latest versions.

= Does this plugin collect any data? =

No. The plugin itself doesn't collect any user data. It only makes requests to baconipsum.com with the parameters you configure (text type, paragraph count).

== Screenshots ==

1. The Bacon Ipsum block placeholder with initial configuration options
2. Generated bacon ipsum text with edit controls and sidebar settings
3. Sidebar inspector controls for customizing meat type and paragraph count
4. Fully editable content in the block editor

== Changelog ==

= 1.0.0 - 2026-01-13 =
* Initial release with refactored architecture
* Object-oriented PHP structure with proper class organization
* Singleton pattern implementation for main plugin class
* Separate asset management class
* Improved JavaScript with JSDoc documentation
* Better error handling and logging
* Localized script configuration
* Activation and deactivation hooks
* Proper uninstall cleanup
* WordPress coding standards compliance
* Translation ready
* GPL-2.0+ license

== Upgrade Notice ==

= 1.0.0 =
Initial release with professional architecture and WordPress best practices.

== Development ==

This plugin is actively developed on GitHub:
[https://github.com/chrismccoy/bacon-ipsum-block](https://github.com/chrismccoy/bacon-ipsum-block)

Contributions, bug reports, and feature requests are welcome!

== Credits ==

* Bacon ipsum text generated by [Bacon Ipsum](https://baconipsum.com)
* Built with WordPress block editor APIs
* Developed by Chris McCoy

== Support ==

For support, please visit the [GitHub repository](https://github.com/chrismccoy/bacon-ipsum-block) and open an issue.
