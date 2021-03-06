'use strict';

/*
 * Helper
 */

// regex escape pattern
function escapePattern(pattern) {
    return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
}

/*
 * Format
 */

// remove whitespace from the front and end of str
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// remove whitespace from the front of str
function trimLeft(str) {
    return str.replace(/^\s+/, '');
}

// remove whitespace from the end of str
function trimRight(str) {
    return str.replace(/\s+$/, '');
}

// pad str with substr from the left
function padLeft(str, substr, length) {
    while (str.length < length) {
        str = substr + str;
    }
    return str;
}

// pads str with substr from the right
function padRight(str, substr, length) {
    while (str.length < length) {
        str += substr;
    }
    return str;
}

// remove extra whitespace (extra spaces, tabs, line breaks, etc)
function removeExtraWhitespace(str) {
    var substr = trim(str);
    return substr.replace(/\s+/g, ' ');
}

// remove all instances of substr in str
function remove(str, substr, caseSensitive) {
    var escapedStr = escapePattern(substr);
    var flags = caseSensitive ? 'g' : 'ig';
    return str.replace(new RegExp(escapedStr, flags), '');
}

// truncate to length with suffix
function truncate(str, len, suffix) {
    if (suffix === undefined) {
        suffix = '...';
    }
    len -= suffix.length;
    var trunc = str;
    if (trunc.length > len) {
        trunc = trunc.substr(0, len);
        var r = /[^\s]/;
        if (r.test(str.charAt(len))) {
            trunc = trimRight(trunc.replace(/\w+$|\s+$/, ''));
        }
        trunc += suffix;
    }
    return trunc;
}

// Capitalize the first word in a string or all words
function capitalize(str, all) {
    var substr = trimLeft(str);
    if (all) {
        return substr.replace(/^.|\b./g, function(match) {
            return match.toUpperCase();
        });
    } else {
        return substr.replace(/(^\w)/, function(match) {
            return match.toUpperCase();
        });
    }
}

// proper case str in sentence format
function properCase(str) {
    var newStr = str.toLowerCase().replace(/\b([^.?;!]+)/, capitalize);
    return newStr.replace(/\b[i]\b/, 'I');
}

// reverse character order
function reverse(str) {
    return str.split('').reverse().join('');
}

// reverse word order
function reverseWords(str) {
    return str.split(' ').reverse().join(' ');
}

// remove all HTML tags from str
function stripTags(str) {
    return str.replace(/<\/?[^>]+>/igm, '');
}

// swaps the case of str
function swapCase(str) {
    return str.replace(/(\w)/, function(newStr) {
        var lower = newStr.toLowerCase();
        var upper = newStr.toUpperCase();
        switch (newStr) {
            case lower:
                return upper;
            case upper:
                return lower;
            default:
                return newStr;
        }
    });
}

// formats seconds into HH:MM:SS
function timeCode(seconds, delim) {
    if (delim === undefined) {
        delim = ':';
    }
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);
    var hr = (h < 10 ? '0' + h : h) + delim;
    var mn = (m < 10 ? '0' + m : m) + delim;
    var sc = (s < 10 ? '0' + s : s);
    return hr + mn + sc;
}

/*
 * Query
 */

// whether str begins with substr
function beginsWith(str, substr) {
    return str.indexOf(substr) === 0;
}

// whether str contains any instances of substr
function contains(str, substr) {
    return str.indexOf(substr) !== -1;
}

// the number of times substr appears within str
function countOf(str, substr, caseSensitive) {
    var escapedStr = escapePattern(substr);
    var flags = (!caseSensitive) ? 'ig' : 'g';
    return str.match(new RegExp(escapedStr, flags)).length;
}

// whether str ends with substr
function endsWith(str, substr) {
    return str.lastIndexOf(substr) === str.length - substr.length;
}

// whether str contains any text
function hasText(str) {
    var substr = removeExtraWhitespace(str);
    return !!substr.length;
}

// whether str contains any characters
function isEmpty(str) {
    return !str.length;
}

// whether str is numeric
function isNumeric(str) {
    var regx = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
    return regx.test(str);
}

// the number of words in a string
function wordCount(str) {
    return str.match(/\b\w+\b/g).length;
}

/*
 * Substring
 */

// everything after the first occurrence of substr in str
function afterFirst(str, substr) {
    var index = str.indexOf(substr);
    if (index === -1) {
        return '';
    }
    index += substr.length;
    return str.substr(index);
}

// everything after the last occurence of substr in str
function afterLast(str, substr) {
    var index = str.lastIndexOf(substr);
    if (index === -1) {
        return '';
    }
    index += substr.length;
    return str.substr(index);
}

// everything before the first occurrence of substr in str
function beforeFirst(str, substr) {
    var index = str.indexOf(substr);
    if (index === -1) {
        return '';
    }
    return str.substr(0, index);
}

// everything before the last occurrence of substr in the string.
function beforeLast(str, substr) {
    var index = str.lastIndexOf(substr);
    if (index === -1) {
        return '';
    }
    return str.substr(0, index);
}

// everything after the first occurance of start and before the first occurrence of end
function between(str, start, end) {
    var substr = '';
    var startIndex = str.indexOf(start);
    if (startIndex !== -1) {
        startIndex += start.length;
        var endIndex = str.indexOf(end, startIndex);
        if (endIndex !== -1) {
            substr = str.substr(startIndex, endIndex - startIndex);
        }
    }
    return substr;
}

/*
 * Utility
 */

// Utility method that intelligently breaks up your string,
// allowing you to create blocks of readable text.
// This method returns you the closest possible match to the delim paramater,
// while keeping the text length within the len paramter.
// If a match can't be found in your specified length an  '...' is added to that block,
// and the blocking continues untill all the text is broken apart.
function block(str, len, delim) {
    if (delim === undefined) {
        delim = '.';
    }
    var arr = [];

    if (!str || !contains(str, delim)) {
        return arr;
    }
    if (delim === ' ') {
        str += delim;
    }

    var chrIndex = 0;
    var strLen = str.length;
    var replPatt = new RegExp('[^' + escapePattern(delim) + ']+$');
    while (chrIndex < strLen) {
        var subString = str.substr(chrIndex, len);
        if (!contains(subString, delim)) {
            arr.push(truncate(subString, subString.length));
            chrIndex += subString.length;
        }
        subString = subString.replace(replPatt, '');
        arr.push(trim(subString));
        chrIndex += subString.length;
    }
    return arr;
}

// Levenshtein distance (editDistance) is a measure of the similarity between two strings,
// The distance is the number of deletions, insertions, or substitutions required to
// transform source into target.
function editDistance(source, target) {
    var i;

    if (source === null) {
        source = '';
    }
    if (target === null) {
        target = '';
    }

    if (source === target) {
        return 0;
    }

    var d = [];
    var cost;
    var n = source.length;
    var m = target.length;
    var j;

    if (n === 0) {
        return m;
    }
    if (m === 0) {
        return n;
    }

    for (i = 0; i <= n; i++) {
        d[i] = [];
    }
    for (i = 0; i <= n; i++) {
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }

    for (i = 1; i <= n; i++) {

        var si = source.charAt(i - 1);
        for (j = 1; j <= m; j++) {

            var tj = target.charAt(j - 1);

            if (si === tj) {
                cost = 0;
            } else {
                cost = 1;
            }

            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

// percentage of similiarity from 0 to 1
function similarity(a, b) {
    var e = editDistance(a, b);
    var m = Math.max(a.length, b.length);
    if (m === 0) {
        return 1;
    } else {
        return (1 - e / m);
    }
}


var StringUtils = {
    // helper:
    'escapePattern': escapePattern,

    // format:
    'trim': trim,
    'trimLeft': trimLeft,
    'trimRight': trimRight,
    'padLeft': padLeft,
    'padRight': padRight,
    'removeExtraWhitespace': removeExtraWhitespace,
    'remove': remove,
    'truncate': truncate,
    'capitalize': capitalize,
    'properCase': properCase,
    'reverse': reverse,
    'reverseWords': reverseWords,
    'stripTags': stripTags,
    'swapCase': swapCase,
    'timeCode': timeCode,

    // query:
    'beginsWith': beginsWith,
    'contains': contains,
    'countOf': countOf,
    'endsWith': endsWith,
    'hasText': hasText,
    'isEmpty': isEmpty,
    'isNumeric': isNumeric,
    'wordCount': wordCount,

    // substring:
    'afterFirst': afterFirst,
    'afterLast': afterLast,
    'beforeFirst': beforeFirst,
    'beforeLast': beforeLast,
    'between': between,

    // utility:
    'block': block,
    'editDistance': editDistance,
    'similarity': similarity
};

if (typeof module === 'object' && module.exports) {
    module.exports = StringUtils;
}
