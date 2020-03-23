// Type definitions for bytes 3.0
// Project: https://github.com/visionmedia/bytes.js
// Definitions by: Zhiyuan Wang <https://github.com/danny8002>
//                 Rickard Laurin <https://github.com/believer>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'bytes-iec' {
interface BytesOptions {
    decimalPlaces?: number;
    thousandsSeparator?: string;
    unitSeparator?: string;
    fixedDecimals?: boolean;
    unit?: string;
}

/**
 * Convert the given value in bytes into a string.
 */
function bytes(value: number, options?: BytesOptions): string;

/**
 * Parse string to an integer in bytes.
 */
function bytes(value: string): number;

namespace bytes {
    /**
     * Format the given value in bytes into a string.
     *
     * If the value is negative, it is kept as such.
     * If it is a float, it is rounded.
     */
    function format(value: number, options?: BytesOptions): string;

    /**
     * Parse the string value into an integer in bytes.
     *
     * If no unit is given, it is assumed the value is in bytes.
     */
    function parse(value: string | number): number;
}

export = bytes;
}
