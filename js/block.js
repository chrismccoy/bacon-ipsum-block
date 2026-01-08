/**
 * Bacon Ipsum Block
 */

(function (wp) {
    'use strict';

    var registerBlockType = wp.blocks.registerBlockType;
    var el = wp.element.createElement;
    var useState = wp.element.useState;
    var Fragment = wp.element.Fragment;

    var InspectorControls = wp.blockEditor.InspectorControls;
    var RichText = wp.blockEditor.RichText;
    var useBlockProps = wp.blockEditor.useBlockProps;

    var PanelBody = wp.components.PanelBody;
    var SelectControl = wp.components.SelectControl;
    var RangeControl = wp.components.RangeControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;
    var Spinner = wp.components.Spinner;
    var Placeholder = wp.components.Placeholder;

    var __ = wp.i18n.__;

    /**
     * Plugin configuration object with defaults.
     */
    var CONFIG = window.baconIpsumConfig || {
        apiUrl: 'https://baconipsum.com/api/',
        version: '1.0.0'
    };

    /**
     * Block configuration constants.
     */
    var BLOCK_CONFIG = {
        namespace: 'bacon-ipsum',
        blockName: 'generator',
        category: 'text',
        apiBaseUrl: CONFIG.apiUrl,
        paragraphLimits: {
            min: 1,
            max: 10
        }
    };

    /**
     * Meat type options configuration.
     */
    var MEAT_TYPE_OPTIONS = [
        {
            label: __('All Meat', 'bacon-ipsum'),
            value: 'all-meat'
        },
        {
            label: __('Meat and Filler', 'bacon-ipsum'),
            value: 'meat-and-filler'
        }
    ];

    /**
     * Text strings organized by context.
     */
    var STRINGS = {
        labels: {
            meatType: __('Meat Type', 'bacon-ipsum'),
            paragraphs: __('Number of Paragraphs', 'bacon-ipsum'),
            paragraphsShort: __('Paragraphs', 'bacon-ipsum'),
            startWithLorem: __('Start with "Bacon ipsum dolor sit amet"', 'bacon-ipsum'),
            startWithLoremShort: __('Start with Lorem', 'bacon-ipsum'),
            allMeat: __('All Meat', 'bacon-ipsum'),
            meatAndFiller: __('Meat & Filler', 'bacon-ipsum'),
            paragraph: __('paragraph', 'bacon-ipsum'),
            paragraphsPlural: __('paragraphs', 'bacon-ipsum')
        },
        buttons: {
            generate: __('Generate Bacon Ipsum', 'bacon-ipsum'),
            regenerate: __('Regenerate', 'bacon-ipsum'),
            regenerateWarning: __('Regenerate (Replaces Content)', 'bacon-ipsum'),
            tryAgain: __('Try Again', 'bacon-ipsum'),
            generating: __('Generating...', 'bacon-ipsum')
        },
        messages: {
            loading: __('Sizzling up some bacon...', 'bacon-ipsum'),
            errorPrefix: __('Error fetching bacon: ', 'bacon-ipsum'),
            placeholder: __('Your bacon ipsum will appear here...', 'bacon-ipsum'),
            editHint: __('Click text above to edit', 'bacon-ipsum'),
            instructions: __(
                'Generate meaty lorem ipsum placeholder text. Once generated, you can edit the text directly.',
                'bacon-ipsum'
            )
        },
        help: {
            meatType: __(
                'Choose pure meat or meat mixed with lorem ipsum filler.',
                'bacon-ipsum'
            ),
            paragraphs: __(
                'Select between 1 and 10 paragraphs.',
                'bacon-ipsum'
            )
        }
    };

    /**
     * Creates the block icon SVG element.
     * Bacon strips representing the meaty text generation.
     */
    function createBlockIcon() {
        return el(
            'svg',
            {
                width: 24,
                height: 24,
                viewBox: '0 0 24 24',
                'aria-hidden': 'true',
                focusable: 'false'
            },
            el('path', {
                fill: 'currentColor',
                d: 'M2 4c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0V4z'
            }),
            el('path', {
                fill: 'currentColor',
                d: 'M2 10c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z'
            }),
            el('path', {
                fill: 'currentColor',
                d: 'M2 16c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z'
            })
        );
    }

    /**
     * API Service for Bacon Ipsum.
     */
    var BaconIpsumAPI = {
        /**
         * Builds the API URL with query parameters.
         */
        buildUrl: function (type, paras, startWithLorem) {
            var url = BLOCK_CONFIG.apiBaseUrl + '?format=json';
            url += '&type=' + encodeURIComponent(type);
            url += '&paras=' + encodeURIComponent(paras);

            if (startWithLorem) {
                url += '&start-with-lorem=1';
            }

            return url;
        },

        /**
         * Fetches bacon ipsum text from the API.
         */
        fetch: function (type, paras, startWithLorem) {
            var url = this.buildUrl(type, paras, startWithLorem);

            return fetch(url)
                .then(function (response) {
                    if (!response.ok) {
                        var errorMsg = 'API request failed with status: ' + response.status;
                        console.error('[Bacon Ipsum Block] ' + errorMsg, {
                            url: url,
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error(errorMsg);
                    }
                    return response.json();
                })
                .catch(function (error) {
                    console.error('[Bacon Ipsum Block] Error fetching bacon ipsum:', error);
                    throw error;
                });
        }
    };

    /**
     * Data transformation utilities for converting between formats.
     */
    var DataTransformer = {
        /**
         * Converts an array of paragraphs to HTML string.
         */
        paragraphsToHtml: function (paragraphs) {
            if (!paragraphs || !Array.isArray(paragraphs)) {
                console.warn('[Bacon Ipsum Block] Invalid paragraphs data:', paragraphs);
                return '';
            }

            return paragraphs
                .map(function (para) {
                    return '<p>' + para + '</p>';
                })
                .join('');
        },

        /**
         * Formats the meat type for display.
         */
        formatMeatType: function (type) {
            var label = type === 'all-meat'
                ? STRINGS.labels.allMeat
                : STRINGS.labels.meatAndFiller;
            return '🥓 ' + label;
        },

        /**
         * Formats paragraph count for display.
         */
        formatParagraphCount: function (paras) {
            var label = paras > 1
                ? STRINGS.labels.paragraphsPlural
                : STRINGS.labels.paragraph;
            return paras + ' ' + label;
        }
    };

    /**
     * Functions for building consistent control elements.
     */
    var ControlBuilders = {
        /**
         * Creates a meat type select control.
         */
        meatTypeSelect: function (value, onChange, showHelp) {
            var config = {
                label: STRINGS.labels.meatType,
                value: value,
                options: MEAT_TYPE_OPTIONS,
                onChange: onChange
            };

            if (showHelp) {
                config.help = STRINGS.help.meatType;
            }

            return el(SelectControl, config);
        },

        /**
         * Creates a paragraph count range control.
         */
        paragraphRange: function (value, onChange, showHelp, shortLabel) {
            var config = {
                label: shortLabel
                    ? STRINGS.labels.paragraphsShort
                    : STRINGS.labels.paragraphs,
                value: value,
                onChange: onChange,
                min: BLOCK_CONFIG.paragraphLimits.min,
                max: BLOCK_CONFIG.paragraphLimits.max
            };

            if (showHelp) {
                config.help = STRINGS.help.paragraphs;
            }

            return el(RangeControl, config);
        },

        /**
         * Creates a start with lorem toggle control.
         */
        loremToggle: function (checked, onChange, shortLabel) {
            return el(ToggleControl, {
                label: shortLabel
                    ? STRINGS.labels.startWithLoremShort
                    : STRINGS.labels.startWithLorem,
                checked: checked,
                onChange: onChange
            });
        }
    };

    /**
     * View components for different block states.
     */
    var BlockViews = {
        /**
         * Renders the loading state view.
         */
        loading: function () {
            return el(
                'div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px'
                    }
                },
                el(Spinner),
                el('p', null, STRINGS.messages.loading)
            );
        },

        /**
         * Renders the error state view.
         */
        error: function (error, onRetry, blockIcon) {
            return el(
                Placeholder,
                {
                    icon: blockIcon,
                    label: __('Bacon Ipsum', 'bacon-ipsum'),
                    instructions: STRINGS.messages.errorPrefix + error
                },
                el(
                    Button,
                    {
                        variant: 'primary',
                        onClick: onRetry
                    },
                    STRINGS.buttons.tryAgain
                )
            );
        },

        /**
         * Renders the empty state placeholder view with initial setup form.
         */
        empty: function (attributes, handlers, blockIcon, isLoading) {
            return el(
                Placeholder,
                {
                    icon: blockIcon,
                    label: __('Bacon Ipsum', 'bacon-ipsum'),
                    instructions: STRINGS.messages.instructions
                },
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
                    ControlBuilders.meatTypeSelect(
                        attributes.type,
                        handlers.onTypeChange,
                        false
                    ),
                    ControlBuilders.paragraphRange(
                        attributes.paras,
                        handlers.onParasChange,
                        false,
                        true
                    ),
                    ControlBuilders.loremToggle(
                        attributes.startWithLorem,
                        handlers.onStartWithLoremChange,
                        true
                    ),
                    el(
                        Button,
                        {
                            variant: 'primary',
                            onClick: handlers.onGenerate,
                            disabled: isLoading
                        },
                        STRINGS.buttons.generate
                    )
                )
            );
        },

        /**
         * Renders the content view with editable RichText.
         */
        content: function (attributes, handlers, isLoading) {
            var meatTypeLabel = DataTransformer.formatMeatType(attributes.type);
            var parasLabel = DataTransformer.formatParagraphCount(attributes.paras);

            return el(
                'div',
                { className: 'bacon-ipsum-content-wrapper' },
                el(RichText, {
                    tagName: 'div',
                    className: 'bacon-ipsum-content',
                    multiline: 'p',
                    value: attributes.content,
                    onChange: handlers.onContentChange,
                    placeholder: STRINGS.messages.placeholder
                }),
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
                    el(
                        Button,
                        {
                            variant: 'secondary',
                            onClick: handlers.onGenerate,
                            disabled: isLoading,
                            isSmall: true,
                            isDestructive: true
                        },
                        STRINGS.buttons.regenerate
                    ),
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
                        STRINGS.messages.editHint
                    )
                )
            );
        },

        /**
         * Renders the inspector controls sidebar panel.
         */
        inspectorControls: function (attributes, handlers, isLoading, hasContent) {
            return el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    {
                        title: __('Bacon Settings', 'bacon-ipsum'),
                        initialOpen: true
                    },
                    ControlBuilders.meatTypeSelect(
                        attributes.type,
                        handlers.onTypeChange,
                        true
                    ),
                    ControlBuilders.paragraphRange(
                        attributes.paras,
                        handlers.onParasChange,
                        true,
                        false
                    ),
                    ControlBuilders.loremToggle(
                        attributes.startWithLorem,
                        handlers.onStartWithLoremChange,
                        false
                    ),
                    el(
                        Button,
                        {
                            variant: 'secondary',
                            onClick: handlers.onGenerate,
                            disabled: isLoading,
                            isDestructive: hasContent,
                            style: { marginTop: '10px' }
                        },
                        isLoading
                            ? STRINGS.buttons.generating
                            : hasContent
                                ? STRINGS.buttons.regenerateWarning
                                : STRINGS.buttons.generate
                    )
                )
            );
        }
    };

    /**
     * Edit component for the Bacon Ipsum block.
     */
    function BaconIpsumEdit(props) {
        var attributes = props.attributes;
        var setAttributes = props.setAttributes;

        // State management
        var loadingState = useState(false);
        var isLoading = loadingState[0];
        var setIsLoading = loadingState[1];

        var errorState = useState(null);
        var error = errorState[0];
        var setError = errorState[1];

        // Block wrapper props
        var blockProps = useBlockProps({
            className: 'bacon-ipsum-block-editor'
        });

        /**
         * Handles bacon ipsum generation.
         * Fetches from API and updates block content.
         */
        function handleGenerate() {
            setIsLoading(true);
            setError(null);

            BaconIpsumAPI.fetch(
                attributes.type,
                attributes.paras,
                attributes.startWithLorem
            )
                .then(function (data) {
                    var htmlContent = DataTransformer.paragraphsToHtml(data);

                    if (!htmlContent) {
                        throw new Error('No content received from API');
                    }

                    setAttributes({ content: htmlContent });
                    setIsLoading(false);
                })
                .catch(function (err) {
                    setError(err.message || 'Unknown error occurred');
                    setIsLoading(false);
                });
        }

        /**
         * Event handlers object.
         */
        var handlers = {
            onGenerate: handleGenerate,
            onContentChange: function (value) {
                setAttributes({ content: value });
            },
            onTypeChange: function (value) {
                setAttributes({ type: value });
            },
            onParasChange: function (value) {
                setAttributes({ paras: value });
            },
            onStartWithLoremChange: function (value) {
                setAttributes({ startWithLorem: value });
            }
        };

        // Block icon
        var blockIcon = createBlockIcon();

        // Determine which view to render based on state
        var blockContent;

        if (isLoading) {
            blockContent = BlockViews.loading();
        } else if (error) {
            blockContent = BlockViews.error(error, handleGenerate, blockIcon);
        } else if (!attributes.content) {
            blockContent = BlockViews.empty(attributes, handlers, blockIcon, isLoading);
        } else {
            blockContent = BlockViews.content(attributes, handlers, isLoading);
        }

        // Render inspector controls
        var inspectorControls = BlockViews.inspectorControls(
            attributes,
            handlers,
            isLoading,
            !!attributes.content
        );

        return el('div', blockProps, inspectorControls, blockContent);
    }

    /**
     * Save component for the Bacon Ipsum block.
     */
    function BaconIpsumSave(props) {
        var blockProps = useBlockProps.save({
            className: 'bacon-ipsum-block'
        });

        return el(
            'div',
            blockProps,
            el(RichText.Content, {
                tagName: 'div',
                className: 'bacon-ipsum-content',
                multiline: 'p',
                value: props.attributes.content
            })
        );
    }

    /**
     * Register the Bacon Ipsum block with WordPress.
     */
    registerBlockType(
        BLOCK_CONFIG.namespace + '/' + BLOCK_CONFIG.blockName,
        {
            title: __('Bacon Ipsum', 'bacon-ipsum'),
            description: __(
                'Generate meaty lorem ipsum placeholder text from baconipsum.com. Content is editable after generation.',
                'bacon-ipsum'
            ),
            category: BLOCK_CONFIG.category,
            icon: createBlockIcon(),
            keywords: [
                __('lorem', 'bacon-ipsum'),
                __('ipsum', 'bacon-ipsum'),
                __('placeholder', 'bacon-ipsum'),
                __('bacon', 'bacon-ipsum'),
                __('meat', 'bacon-ipsum'),
                __('dummy', 'bacon-ipsum'),
                __('text', 'bacon-ipsum')
            ],
            supports: {
                html: false,
                align: ['wide', 'full']
            },
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
            edit: BaconIpsumEdit,
            save: BaconIpsumSave
        }
    );
})(window.wp);
