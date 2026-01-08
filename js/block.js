/**
 * Bacon Ipsum Block
 */

(function (wp) {
    'use strict';

    /**
     * Block registration function
     */
    var registerBlockType = wp.blocks.registerBlockType;

    /**
     * React createElement abstraction
     */
    var el = wp.element.createElement;

    /**
     * React useState hook
     */
    var useState = wp.element.useState;

    /**
     * Block editor components
     */
    var InspectorControls = wp.blockEditor.InspectorControls;
    var RichText = wp.blockEditor.RichText;
    var useBlockProps = wp.blockEditor.useBlockProps;

    /**
     * UI components
     */
    var PanelBody = wp.components.PanelBody;
    var SelectControl = wp.components.SelectControl;
    var RangeControl = wp.components.RangeControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;
    var Spinner = wp.components.Spinner;
    var Placeholder = wp.components.Placeholder;

    /**
     * Internationalization function
     */
    var __ = wp.i18n.__;

    /**
     * Base URL for the Bacon Ipsum API.
     */
    var API_BASE_URL = 'https://baconipsum.com/api/';

    /**
     * Block icon SVG element.
     * Displays bacon strips representing the meaty text generation.
     */
    var blockIcon = el(
        'svg',
        {
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            'aria-hidden': 'true',
            focusable: 'false'
        },
        // First bacon strip
        el('path', {
            fill: 'currentColor',
            d: 'M2 4c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0V4z'
        }),
        // Second bacon strip
        el('path', {
            fill: 'currentColor',
            d: 'M2 10c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z'
        }),
        // Third bacon strip
        el('path', {
            fill: 'currentColor',
            d: 'M2 16c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z'
        })
    );

    /**
     * Fetches bacon ipsum text from the Bacon Ipsum API.
     */
    function fetchBaconIpsum(type, paras, startWithLorem) {
        var url = API_BASE_URL + '?format=json';
        url += '&type=' + encodeURIComponent(type);
        url += '&paras=' + encodeURIComponent(paras);

        if (startWithLorem) {
            url += '&start-with-lorem=1';
        }

        return fetch(url).then(function (response) {
            if (!response.ok) {
                throw new Error(
                    'API request failed with status: ' + response.status
                );
            }
            return response.json();
        });
    }

    /**
     * Converts an array of paragraphs to HTML string.
     *
     * Takes the API response array and converts it to an HTML string
     * with each paragraph wrapped in <p> tags for use with RichText.
     */
    function paragraphsToHtml(paragraphs) {
        return paragraphs
            .map(function (para) {
                return '<p>' + para + '</p>';
            })
            .join('');
    }

    /**
     * Edit component for the Bacon Ipsum block.
     *
     * This component renders the block interface in the WordPress editor,
     * including the placeholder for initial setup, the RichText content
     * display for editing, and the sidebar inspector controls.
     */
    function BaconIpsumEdit(props) {
        var attributes = props.attributes;
        var setAttributes = props.setAttributes;

        var type = attributes.type;
        var paras = attributes.paras;
        var startWithLorem = attributes.startWithLorem;
        var content = attributes.content;

        /**
         * Loading state for API requests.
         */
        var loadingState = useState(false);
        var isLoading = loadingState[0];
        var setIsLoading = loadingState[1];

        /**
         * Error state for API request failures.
         */
        var errorState = useState(null);
        var error = errorState[0];
        var setError = errorState[1];

        /**
         * Block wrapper props from useBlockProps hook.
         */
        var blockProps = useBlockProps({
            className: 'bacon-ipsum-block-editor'
        });

        /**
         * Handles the bacon ipsum generation request.
         *
         * Fetches content from the API, converts it to HTML, and stores it
         * in the content attribute for RichText editing.
         */
        function generateBacon() {
            setIsLoading(true);
            setError(null);

            fetchBaconIpsum(type, paras, startWithLorem)
                .then(function (data) {
                    // Convert array to HTML string for RichText
                    var htmlContent = paragraphsToHtml(data);
                    setAttributes({ content: htmlContent });
                    setIsLoading(false);
                })
                .catch(function (err) {
                    setError(err.message);
                    setIsLoading(false);
                });
        }

        /**
         * Handles content changes from RichText editing.
         */
        function onContentChange(value) {
            setAttributes({ content: value });
        }

        /**
         * Handles meat type selection change.
         */
        function onTypeChange(value) {
            setAttributes({ type: value });
        }

        /**
         * Handles paragraph count change.
         */
        function onParasChange(value) {
            setAttributes({ paras: value });
        }

        /**
         * Handles start with lorem toggle change.
         */
        function onStartWithLoremChange(value) {
            setAttributes({ startWithLorem: value });
        }

        /**
         * Inspector controls rendered in the block editor sidebar.
         */
        var inspectorControls = el(
            InspectorControls,
            null,
            el(
                PanelBody,
                {
                    title: __('Bacon Settings', 'bacon-ipsum'),
                    initialOpen: true
                },

                // Meat type dropdown selector
                el(SelectControl, {
                    label: __('Meat Type', 'bacon-ipsum'),
                    value: type,
                    options: [
                        {
                            label: __('All Meat', 'bacon-ipsum'),
                            value: 'all-meat'
                        },
                        {
                            label: __('Meat and Filler', 'bacon-ipsum'),
                            value: 'meat-and-filler'
                        }
                    ],
                    onChange: onTypeChange,
                    help: __(
                        'Choose pure meat or meat mixed with lorem ipsum filler.',
                        'bacon-ipsum'
                    )
                }),

                // Paragraph count range slider
                el(RangeControl, {
                    label: __('Number of Paragraphs', 'bacon-ipsum'),
                    value: paras,
                    onChange: onParasChange,
                    min: 1,
                    max: 10,
                    help: __(
                        'Select between 1 and 10 paragraphs.',
                        'bacon-ipsum'
                    )
                }),

                // Start with lorem toggle
                el(ToggleControl, {
                    label: __(
                        'Start with "Bacon ipsum dolor sit amet"',
                        'bacon-ipsum'
                    ),
                    checked: startWithLorem,
                    onChange: onStartWithLoremChange
                }),

                // Regenerate button in sidebar
                el(
                    Button,
                    {
                        variant: 'secondary',
                        onClick: generateBacon,
                        disabled: isLoading,
                        isDestructive: content ? true : false,
                        style: { marginTop: '10px' }
                    },
                    isLoading
                        ? __('Generating...', 'bacon-ipsum')
                        : content
                          ? __('Regenerate (Replaces Content)', 'bacon-ipsum')
                          : __('Generate Bacon', 'bacon-ipsum')
                )
            )
        );

        /**
         * The main block content element.
         */
        var blockContent;

        if (isLoading) {
            blockContent = el(
                'div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px'
                    }
                },
                el(Spinner),
                el('p', null, __('Sizzling up some bacon...', 'bacon-ipsum'))
            );
        }

        else if (error) {
            blockContent = el(
                Placeholder,
                {
                    icon: blockIcon,
                    label: __('Bacon Ipsum', 'bacon-ipsum'),
                    instructions:
                        __('Error fetching bacon: ', 'bacon-ipsum') + error
                },
                el(
                    Button,
                    {
                        variant: 'primary',
                        onClick: generateBacon
                    },
                    __('Try Again', 'bacon-ipsum')
                )
            );
        }

        else if (!content) {
            blockContent = el(
                Placeholder,
                {
                    icon: blockIcon,
                    label: __('Bacon Ipsum', 'bacon-ipsum'),
                    instructions: __(
                        'Generate meaty lorem ipsum placeholder text. Once generated, you can edit the text directly.',
                        'bacon-ipsum'
                    )
                },

                // Initial setup form within placeholder
                el(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%',
                            maxWidth: '300px'
                        }
                    },

                    // Meat type selector
                    el(SelectControl, {
                        label: __('Meat Type', 'bacon-ipsum'),
                        value: type,
                        options: [
                            {
                                label: __('All Meat', 'bacon-ipsum'),
                                value: 'all-meat'
                            },
                            {
                                label: __('Meat and Filler', 'bacon-ipsum'),
                                value: 'meat-and-filler'
                            }
                        ],
                        onChange: onTypeChange
                    }),

                    // Paragraph count slider
                    el(RangeControl, {
                        label: __('Paragraphs', 'bacon-ipsum'),
                        value: paras,
                        onChange: onParasChange,
                        min: 1,
                        max: 10
                    }),

                    // Start with lorem toggle
                    el(ToggleControl, {
                        label: __('Start with Lorem', 'bacon-ipsum'),
                        checked: startWithLorem,
                        onChange: onStartWithLoremChange
                    }),

                    // Generate button
                    el(
                        Button,
                        {
                            variant: 'primary',
                            onClick: generateBacon
                        },
                        __('Generate Bacon Ipsum', 'bacon-ipsum')
                    )
                )
            );
        }

        else {
            // Build status text for display
            var meatTypeLabel =
                type === 'all-meat'
                    ? '🥓 ' + __('All Meat', 'bacon-ipsum')
                    : '🥓 ' + __('Meat & Filler', 'bacon-ipsum');

            var parasLabel =
                paras +
                ' ' +
                (paras > 1
                    ? __('paragraphs', 'bacon-ipsum')
                    : __('paragraph', 'bacon-ipsum'));

            blockContent = el(
                'div',
                { className: 'bacon-ipsum-content-wrapper' },

                // Editable RichText content
                el(RichText, {
                    tagName: 'div',
                    className: 'bacon-ipsum-content',
                    multiline: 'p',
                    value: content,
                    onChange: onContentChange,
                    placeholder: __(
                        'Your bacon ipsum will appear here...',
                        'bacon-ipsum'
                    )
                }),

                // Footer with regenerate button and status (editor only)
                el(
                    'div',
                    {
                        style: {
                            marginTop: '15px',
                            paddingTop: '15px',
                            borderTop: '1px dashed #ccc',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }
                    },

                    // Regenerate button
                    el(
                        Button,
                        {
                            variant: 'secondary',
                            onClick: generateBacon,
                            disabled: isLoading,
                            isSmall: true,
                            isDestructive: true
                        },
                        __('Regenerate', 'bacon-ipsum')
                    ),

                    // Status text showing current settings
                    el(
                        'span',
                        {
                            style: {
                                fontSize: '12px',
                                color: '#757575'
                            }
                        },
                        meatTypeLabel,
                        ' • ',
                        parasLabel
                    ),

                    // Editable hint
                    el(
                        'span',
                        {
                            style: {
                                fontSize: '11px',
                                color: '#999',
                                fontStyle: 'italic',
                                marginLeft: 'auto'
                            }
                        },
                        __('Click text above to edit', 'bacon-ipsum')
                    )
                )
            );
        }

        return el('div', blockProps, inspectorControls, blockContent);
    }

    /**
     * Save component for the Bacon Ipsum block.
     *
     * Outputs the static HTML content that will be saved to the post.
     * The content is fully editable via RichText in the editor and
     * persists even if the plugin is deactivated.
     */
    function BaconIpsumSave(props) {
        var content = props.attributes.content;

        // Get block props for save
        var blockProps = useBlockProps.save({
            className: 'bacon-ipsum-block'
        });

        // Return the saved content wrapped in a div with the content class
        return el(
            'div',
            blockProps,
            el(RichText.Content, {
                tagName: 'div',
                className: 'bacon-ipsum-content',
                multiline: 'p',
                value: content
            })
        );
    }

    /**
     * Register the Bacon Ipsum block with WordPress.
     */
    registerBlockType('bacon-ipsum/generator', {
        /**
         * Block title displayed in the inserter.
         */
        title: __('Bacon Ipsum', 'bacon-ipsum'),

        /**
         * Block description displayed in the inserter.
         */
        description: __(
            'Generate meaty lorem ipsum placeholder text from baconipsum.com. Content is editable after generation.',
            'bacon-ipsum'
        ),

        /**
         * Block category for grouping in the inserter.
         */
        category: 'text',

        /**
         * Custom SVG Block Icon.
         */
        icon: blockIcon,

        /**
         * Keywords for searching the block in the inserter.
         */
        keywords: [
            __('lorem', 'bacon-ipsum'),
            __('ipsum', 'bacon-ipsum'),
            __('placeholder', 'bacon-ipsum'),
            __('bacon', 'bacon-ipsum'),
            __('meat', 'bacon-ipsum'),
            __('dummy', 'bacon-ipsum'),
            __('text', 'bacon-ipsum')
        ],

        /**
         * Block supports configuration.
         */
        supports: {
            html: false,
            align: ['wide', 'full']
        },

        /**
         * Example data for block preview in the inserter.
         */
        example: {
            attributes: {
                content:
                    '<p>Bacon ipsum dolor amet hamburger pork loin shoulder ' +
                    'swine. Turducken salami ham hock bacon strip steak ' +
                    'bresaola.</p><p>Landjaeger buffalo tongue pork chop. ' +
                    'Kielbasa ham hock frankfurter, brisket t-bone strip ' +
                    'steak hamburger.</p>'
            }
        },

        /**
         * Edit component for the block editor.
         */
        edit: BaconIpsumEdit,

        /**
         * Save component for front-end output.
         * Returns static HTML that persists in post content.
         */
        save: BaconIpsumSave
    });
})(window.wp);
