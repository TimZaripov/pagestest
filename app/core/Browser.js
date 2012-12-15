(function() {
    GP.Browser = {
        touch: (function() {
            var touchSupported = false;
            // WebKit, etc
            if ('ontouchstart' in document.documentElement) {
                return true;
            }
            // Firefox/Gecko
            var e = document.createElement('div');
            // If no support for basic event stuff, unlikely to have touch support
            if (!e.setAttribute || !e.removeAttribute) {
                return false;
            }
            e.setAttribute('ontouchstart', 'return;');
            if (typeof e['ontouchstart'] == 'function') {
                touchSupported = true;
            }
            e.removeAttribute('ontouchstart');
            e = null;
            return touchSupported;
        })()
    };
})();