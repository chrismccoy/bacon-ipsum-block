/**
 * Bacon Ipsum Plugin
 * API Client and Block Registration
 */

/**
 * API Client
 */

(function (window) {
  'use strict';

  var apiFetch = window.wp.apiFetch;

  /**
   * API Client for Bacon Ipsum.
   */
  var BaconIpsumAPI = {
    /**
     * Generate bacon ipsum text.
     */
    generate: function (params) {
      return apiFetch({
        path: '/bacon-ipsum/v1/generate',
        method: 'POST',
        data: {
          type: params.type,
          paras: params.paras,
          start_with_lorem: params.startWithLorem,
        },
      }).then(function (response) {
        if (!response.success) {
          throw new Error('API request failed');
        }
        return response.data;
      });
    },
  };

  // Expose API to global scope
  window.BaconIpsumAPI = BaconIpsumAPI;
})(window);

/**
 * Block
 */

(function (wp) {
  'use strict';

  // WordPress dependencies
  var registerBlockType = wp.blocks.registerBlockType;
  var el = wp.element.createElement;
  var useState = wp.element.useState;
  var useEffect = wp.element.useEffect;
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
  var Notice = wp.components.Notice;

  var __ = wp.i18n.__;

  // Get API client from global scope
  var BaconIpsumAPI = window.BaconIpsumAPI;

  /**
   * Constants
   */
  var LIMITS = {
    MIN_PARAS: 1,
    MAX_PARAS: 10,
  };

  var MEAT_TYPES = {
    ALL_MEAT: 'all-meat',
    MEAT_AND_FILLER: 'meat-and-filler',
  };

  /**
   * Configuration options.
   */
  var OPTIONS = {
    meatType: [
      {
        label: __('All Meat', 'bacon-ipsum'),
        value: MEAT_TYPES.ALL_MEAT,
      },
      {
        label: __('Meat and Filler', 'bacon-ipsum'),
        value: MEAT_TYPES.MEAT_AND_FILLER,
      },
    ],
  };

  /**
   * Convert paragraphs array to HTML.
   */
  function paragraphsToHtml(paragraphs) {
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
      return '';
    }
    return paragraphs
      .map(function (para) {
        return '<p>' + para + '</p>';
      })
      .join('');
  }

  /**
   * Block Icon Component.
   */
  function BlockIcon() {
    return el(
      'svg',
      {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      el('path', {
        d:
          'M2 4c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0V4z',
        fill: 'currentColor',
      }),
      el('path', {
        d:
          'M2 10c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z',
        fill: 'currentColor',
      }),
      el('path', {
        d:
          'M2 16c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0 2.5-1 4 0v3c-1.5-1-2.5 1-4 0s-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0-2.5 1-4 0v-3z',
        fill: 'currentColor',
      })
    );
  }

  /**
   * Settings Panel Component.
   */
  function SettingsPanel(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;
    var onGenerate = props.onGenerate;
    var isLoading = props.isLoading;
    var hasContent = props.hasContent;

    return el(
      InspectorControls,
      null,
      el(
        PanelBody,
        {
          title: __('Bacon Settings', 'bacon-ipsum'),
          initialOpen: true,
        },
        el(SelectControl, {
          label: __('Meat Type', 'bacon-ipsum'),
          value: attributes.type,
          options: OPTIONS.meatType,
          onChange: function (value) {
            setAttributes({ type: value });
          },
          help: __(
            'Choose pure meat or meat mixed with filler text.',
            'bacon-ipsum'
          ),
        }),
        el(RangeControl, {
          label: __('Number of Paragraphs', 'bacon-ipsum'),
          value: attributes.paras,
          onChange: function (value) {
            setAttributes({ paras: value });
          },
          min: LIMITS.MIN_PARAS,
          max: LIMITS.MAX_PARAS,
        }),
        el(ToggleControl, {
          label: __(
            'Start with "Bacon ipsum dolor sit amet"',
            'bacon-ipsum'
          ),
          checked: attributes.startWithLorem,
          onChange: function (value) {
            setAttributes({ startWithLorem: value });
          },
        }),
        el(
          Button,
          {
            variant: hasContent ? 'secondary' : 'primary',
            onClick: onGenerate,
            disabled: isLoading,
            isDestructive: hasContent,
            className: 'bacon-ipsum-generate-button',
          },
          isLoading
            ? __('Generating...', 'bacon-ipsum')
            : hasContent
              ? __('Regenerate (Replaces Content)', 'bacon-ipsum')
              : __('Generate Bacon Ipsum', 'bacon-ipsum')
        )
      )
    );
  }

  /**
   * Empty State Component.
   */
  function EmptyState(props) {
    return el(
      Placeholder,
      {
        icon: el(BlockIcon),
        label: __('Bacon Ipsum', 'bacon-ipsum'),
        instructions: __(
          'Generate meaty lorem ipsum placeholder text. Configure settings in the sidebar and click Generate.',
          'bacon-ipsum'
        ),
      },
      el(
        Button,
        {
          variant: 'primary',
          onClick: props.onGenerate,
          disabled: props.isLoading,
        },
        props.isLoading
          ? __('Generating...', 'bacon-ipsum')
          : __('Generate Bacon Ipsum', 'bacon-ipsum')
      )
    );
  }

  /**
   * Loading State Component.
   */
  function LoadingState() {
    return el(
      'div',
      { className: 'bacon-ipsum-loading' },
      el(Spinner),
      el('p', null, __('Sizzling up some bacon...', 'bacon-ipsum'))
    );
  }

  /**
   * Content View Component.
   */
  function ContentView(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;
    var onGenerate = props.onGenerate;
    var isLoading = props.isLoading;

    var meatTypeLabel =
      attributes.type === MEAT_TYPES.ALL_MEAT
        ? __('All Meat', 'bacon-ipsum')
        : __('Meat & Filler', 'bacon-ipsum');

    var parasLabel =
      attributes.paras === 1
        ? __('1 paragraph', 'bacon-ipsum')
        : attributes.paras + ' ' + __('paragraphs', 'bacon-ipsum');

    return el(
      'div',
      { className: 'bacon-ipsum-content-wrapper' },
      el(RichText, {
        tagName: 'div',
        className: 'bacon-ipsum-content',
        multiline: 'p',
        value: attributes.content,
        onChange: function (value) {
          setAttributes({ content: value });
        },
        placeholder: __(
          'Your bacon ipsum will appear here...',
          'bacon-ipsum'
        ),
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
            flexWrap: 'wrap',
          },
        },
        el(
          Button,
          {
            variant: 'secondary',
            onClick: onGenerate,
            disabled: isLoading,
            isSmall: true,
            isDestructive: true,
          },
          __('Regenerate', 'bacon-ipsum')
        ),
        el(
          'span',
          {
            style: {
              fontSize: '12px',
              color: '#757575',
            },
          },
          '🥓 ' + meatTypeLabel + ' • ' + parasLabel
        ),
        el(
          'span',
          {
            style: {
              fontSize: '11px',
              color: '#999',
              fontStyle: 'italic',
              marginLeft: 'auto',
            },
          },
          __('Click text to edit', 'bacon-ipsum')
        )
      )
    );
  }

  /**
   * Edit Component.
   */
  function BaconIpsumEdit(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;

    var loadingState = useState(false);
    var isLoading = loadingState[0];
    var setIsLoading = loadingState[1];

    var errorState = useState(null);
    var error = errorState[0];
    var setError = errorState[1];

    var blockProps = useBlockProps({
      className: 'wp-block-bacon-ipsum-generator',
    });

    /**
     * Handle generation.
     */
    function handleGenerate() {
      setIsLoading(true);
      setError(null);

      BaconIpsumAPI.generate({
        type: attributes.type,
        paras: attributes.paras,
        startWithLorem: attributes.startWithLorem,
      })
        .then(function (paragraphs) {
          var htmlContent = paragraphsToHtml(paragraphs);
          setAttributes({ content: htmlContent });
          setIsLoading(false);
        })
        .catch(function (err) {
          setError(
            err.message || __('Unknown error occurred', 'bacon-ipsum')
          );
          setIsLoading(false);
        });
    }

    var hasContent = !!attributes.content;

    return el(
      'div',
      blockProps,
      el(SettingsPanel, {
        attributes: attributes,
        setAttributes: setAttributes,
        onGenerate: handleGenerate,
        isLoading: isLoading,
        hasContent: hasContent,
      }),
      error &&
        el(Notice, {
          status: 'error',
          isDismissible: true,
          onRemove: function () {
            setError(null);
          },
          children: __('Error: ', 'bacon-ipsum') + error,
        }),
      isLoading
        ? el(LoadingState)
        : !hasContent
          ? el(EmptyState, {
              onGenerate: handleGenerate,
              isLoading: isLoading,
            })
          : el(ContentView, {
              attributes: attributes,
              setAttributes: setAttributes,
              onGenerate: handleGenerate,
              isLoading: isLoading,
            })
    );
  }

  /**
   * Save Component.
   */
  function BaconIpsumSave(props) {
    var blockProps = useBlockProps.save({
      className: 'wp-block-bacon-ipsum-generator',
    });

    return el(
      'div',
      blockProps,
      el(RichText.Content, {
        tagName: 'div',
        className: 'bacon-ipsum-content',
        value: props.attributes.content,
      })
    );
  }

  /**
   * Register Block.
   */
  registerBlockType('bacon-ipsum/generator', {
    apiVersion: 2,
    title: __('Bacon Ipsum', 'bacon-ipsum'),
    description: __(
      'Generate meaty lorem ipsum placeholder text. Editable after generation.',
      'bacon-ipsum'
    ),
    category: 'text',
    icon: el(BlockIcon),
    keywords: [
      __('lorem', 'bacon-ipsum'),
      __('ipsum', 'bacon-ipsum'),
      __('placeholder', 'bacon-ipsum'),
      __('bacon', 'bacon-ipsum'),
      __('text', 'bacon-ipsum'),
    ],
    supports: {
      html: false,
      align: ['wide', 'full'],
      spacing: {
        margin: true,
        padding: true,
      },
    },
    attributes: {
      type: {
        type: 'string',
        default: 'all-meat',
      },
      paras: {
        type: 'number',
        default: 3,
      },
      startWithLorem: {
        type: 'boolean',
        default: true,
      },
      content: {
        type: 'string',
        default: '',
      },
    },
    example: {
      attributes: {
        content:
          '<p>Bacon ipsum dolor amet hamburger pork loin shoulder swine. Turducken salami ham hock bacon strip steak bresaola.</p><p>Landjaeger buffalo tongue pork chop. Kielbasa ham hock frankfurter, brisket t-bone strip steak hamburger.</p>',
      },
    },
    edit: BaconIpsumEdit,
    save: BaconIpsumSave,
  });
})(window.wp);
