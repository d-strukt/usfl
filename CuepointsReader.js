'use strict';

function CuepointsReader() {
    var cuepointsReader;
    var dispatch;
    var list = [];
    var currentPosition = 0;
    var lastPosition = -1;
    var tolerance = 0.2;

    var add = function(position, name, data) {
        list.push({
            position: position,
            name: name,
            data: data
        });

        list.sort(function(a, b) {
            return a.position - b.position;
        });

        return cuepointsReader;
    };

    var onCuepoint = function(fn, thisArg) {
        if (fn) {
            dispatch = thisArg ? fn.bind(thisArg) : fn;
        } else {
            dispatch = null;
        }
        return cuepointsReader;
    };

    var removeAll = function() {
        list.length = 0;
        return reset();
    };

    var reset = function() {
        currentPosition = 0;
        lastPosition = -1;
        return cuepointsReader;
    };

    var setTolerance = function(value) {
        tolerance = value;
        return cuepointsReader;
    };

    var update = function(position) {
        currentPosition = position;
        check(currentPosition, lastPosition);
        lastPosition = currentPosition;
        return cuepointsReader;
    };

    var check = function(currentPos, lastPos) {
        if (currentPos <= lastPos) {
            return;
        }
        if (typeof dispatch !== 'function') {
            return;
        }

        list.some(function(item) {
            if (inRange(item.position, currentPos, lastPos)) {
                dispatch(item);
                return true;
            }
        });
    };

    var inRange = function(cuepointPos, currentPos, lastPos) {
        if (cuepointPos > currentPos) {
            return false;
        }
        if (cuepointPos <= lastPos) {
            return false;
        }

        var diff = cuepointPos - currentPos;
        if (diff < 0) {
            diff = -diff;
        }
        return diff <= tolerance;
    };

    cuepointsReader = Object.freeze({
        add: add,
        onCuepoint: onCuepoint,
        removeAll: removeAll,
        reset: reset,
        setTolerance: setTolerance,
        update: update
    });

    return cuepointsReader;
}

module.exports = CuepointsReader;
