<?php
/**
 * Cache Manager for API responses.
 */

namespace BaconIpsum;

defined('ABSPATH') || exit;

/**
 * Cache Manager Class.
 */
class Cache_Manager {
    /**
     * Cache group name.
     */
    private const CACHE_GROUP = 'bacon_ipsum';

    /**
     * Cache expiration time in seconds (1 hour).
     */
    private const CACHE_EXPIRATION = HOUR_IN_SECONDS;

    /**
     * Generate cache key.
     */
    public function generate_key($type, $paras, $start_with_lorem) {
        return sprintf(
            'bacon_%s_%d_%s',
            $type,
            $paras,
            $start_with_lorem ? 'lorem' : 'no_lorem'
        );
    }

    /**
     * Get cached data.
     */
    public function get($key) {
        return wp_cache_get($key, self::CACHE_GROUP);
    }

    /**
     * Set cached data.
     */
    public function set($key, $data) {
        return wp_cache_set(
            $key,
            $data,
            self::CACHE_GROUP,
            self::CACHE_EXPIRATION
        );
    }

    /**
     * Delete cached data.
     */
    public function delete($key) {
        return wp_cache_delete($key, self::CACHE_GROUP);
    }

    /**
     * Flush all cached data for this plugin.
     */
    public function flush() {
        return wp_cache_flush_group(self::CACHE_GROUP);
    }
}
