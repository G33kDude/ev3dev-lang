var utils = require('./utils.js');

var cStyleAutogenStart = /\/\/\s*~autogen *(.+)/;
var cStyleAutogenEnd = "//~autogen";

exports.autogenFenceComments = {
    '.ts': { start: cStyleAutogenStart, end: cStyleAutogenEnd },
    '.vala': { start: cStyleAutogenStart, end: cStyleAutogenEnd },
    '.cpp': { start: cStyleAutogenStart, end: cStyleAutogenEnd },
    '.h': { start: cStyleAutogenStart, end: cStyleAutogenEnd },
    '.java': { start: cStyleAutogenStart, end: cStyleAutogenEnd },
    '.md': { start: /<!--\s*~autogen *(.+)-->/, end: "<!-- ~autogen -->" },
    '.lua': { start: /--\s*~autogen *(.+)/, end: "-- ~autogen" },
    '.py': { start: /#\s*~autogen *(.+)/, end: "# ~autogen" }
}

exports.extraLiquidFilters = {
    //camel-cases the input string. If the parameter is an array, applies to all items.
    camel_case: function (input) {
        function camelCaseSingle(input) {
            return String(input).toLowerCase().replace(/[-|\s](.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        }
        
        if(typeof input == 'string')
            return camelCaseSingle(input);
        else
            return input.map(camelCaseSingle);
    },
    //replaces sections of whitespace with underscores
    underscore_spaces: function (input) {
        return String(input).replace(/\s/g, '_');
    },
    //replaces non-word characters with underscores
    underscore_non_wc: function (input) {
        return String(input).replace(/\W/g, '_');
    },
    //ternary switch statement (also converts undefined values to blank string automatically)
    ternary_if: function (bool, valueIfTrue, valueIfFalse) {
        return bool ? (valueIfTrue == undefined ? '' : valueIfTrue) : (valueIfFalse == undefined ? '' : valueIfFalse);
    },
    //gets a property from an object
    traverse_object: function (object, property) {
        return utils.getProp(object, Array.prototype.slice.call(arguments, 1).join("."));
    },
    //creates an array from the given arguments
    append_to_array: function (elements) {
        return Array.prototype.slice.call(arguments, 0);
    },
    //equality comparison (used to get around lack of grouping in liquid)
    eq: function (a, b) {
        return a == b;
    },
    prepend_all: function (array, prependStr) {
        return array.map(function(item) {
           return  prependStr + item;
        });
    },
    append_all: function (array, appendStr) {
        return array.map(function(item) {
           return  item + appendStr;
        });
    },
    select: function(array, property) {
        return array.map(function(item) {
           return utils.getProp(item, property); 
        });
    }
};