// all code snippets are from https://js-antidebug.github.io/

original_content = `<style>
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-family: Palatino, Times;
    font-size: 3em;
    color: darkgreen;
}
</style>
<p class="center">Original Content</p>
`

modified_content = `<style>
    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
        font-family: Palatino, Times;
        font-size: 3em;
        color: darkred;
    }
</style>
<p class="center">Modified Content</p>
`

shortcut = `
window.addEventListener('keydown', function(event){ 
    console.log(event);
    if (event.key == "F12" || ((event.ctrlKey || event.altKey) && (event.code == "KeyI" || event.key == "KeyJ" || event.key == "KeyU"))) {
        event.preventDefault(); 
        return false;
    }
});
window.addEventListener('contextmenu', function(event){ 
    event.preventDefault();
    return false;
});
`

trigbreak = `
function debug() {
    debugger;
    setTimeout(debug, 1);
}
debug();
`

conclear = `
function clear() {
    console.clear();
    setTimeout(clear, 10);
}
clear();
`

modbuilt = `
var _0x4bde55 = function () {
    var _0x16e614 = !![];
    return function (_0x41e722, _0xf342eb) {
        var _0x280f64 = _0x16e614 ? function () {
            if (_0xf342eb) {
                var _0x24a5ce = _0xf342eb['apply'](_0x41e722, arguments);
                _0xf342eb = null;
                return _0x24a5ce;
            }
        } : function () {
        };
        _0x16e614 = ![];
        return _0x280f64;
    };
}();
var _0x54fe5d = _0x4bde55(this, function () {
    var _0xb720ec = function () {
    };
    var _0x217a18;
    try {
        var _0xc3cc4a = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');');
        _0x217a18 = _0xc3cc4a();
    } catch (_0x228a20) {
        _0x217a18 = window;
    }
    if (!_0x217a18['console']) {
        _0x217a18['console'] = function (_0x2266c8) {
            var _0x104cf8 = {};
            _0x104cf8['log'] = _0x2266c8;
            _0x104cf8['warn'] = _0x2266c8;
            _0x104cf8['debug'] = _0x2266c8;
            _0x104cf8['info'] = _0x2266c8;
            _0x104cf8['error'] = _0x2266c8;
            _0x104cf8['exception'] = _0x2266c8;
            _0x104cf8['table'] = _0x2266c8;
            _0x104cf8['trace'] = _0x2266c8;
            return _0x104cf8;
        }(_0xb720ec);
    } else {
        _0x217a18['console']['log'] = _0xb720ec;
        _0x217a18['console']['warn'] = _0xb720ec;
        _0x217a18['console']['debug'] = _0xb720ec;
        _0x217a18['console']['info'] = _0xb720ec;
        _0x217a18['console']['error'] = _0xb720ec;
        _0x217a18['console']['exception'] = _0xb720ec;
        _0x217a18['console']['table'] = _0xb720ec;
        _0x217a18['console']['trace'] = _0xb720ec;
    }
});
_0x54fe5d();
console['log']('This\x20message\x20will\x20not\x20appear,\x20as\x20the\x20console\x20is\x20disabled!');
`

widthdiff = `
/*!
https://github.com/sindresorhus/devtools-detect
By Sindre Sorhus
MIT License
*/
(function () {
	'use strict';

	const devtools = {
		isOpen: false,
		orientation: undefined
	};

	const threshold = 160;

	const emitEvent = (isOpen, orientation) => {
        if(isOpen){
            document.close();
            document.write(\`${modified_content}\`);
        }
	};

	setInterval(() => {
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		const orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (
			!(heightThreshold && widthThreshold) &&
			((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
		) {
			if (!devtools.isOpen || devtools.orientation !== orientation) {
				emitEvent(true, orientation);
			}

			devtools.isOpen = true;
			devtools.orientation = orientation;
		} else {
            console.log(devtools.isOpen);
			if (devtools.isOpen) {
				emitEvent(false, undefined);
			}

			devtools.isOpen = false;
			devtools.orientation = undefined;
		}
	}, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
})();
`

monbreak = `
addEventListener("load", () => {
    var threshold = 500;
    const measure = () => {
        const start = performance.now();
        debugger;
        const time = performance.now() - start;
        if (time > threshold) {
            document.close();
            document.write(\`${modified_content}\`);
        }
    }
    setInterval(measure, 300);
});
`

newbreak = `
var timeSinceLast;
addEventListener("load", () => {
    var threshold = 1000;
    const measure = () => {
        if (!timeSinceLast) {
            timeSinceLast = performance.now();
        }
        const diff = performance.now() - timeSinceLast;
        if (diff > threshold) {
            document.close();
            document.write(\`${modified_content}\`);
        }
        timeSinceLast = performance.now();
    }
    setInterval(measure, 300);
});
`

conspam = `
var baseline;
function measure() {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
        console.log(i);
        console.clear();
    }
    const time = performance.now() - start;
    if (baseline === undefined) {
        baseline = time;
    }
    else if (time > baseline * 3) {
        document.close();
        document.write(\`${modified_content}\`);
        return;
    }
    setTimeout(measure, 1000);
}
measure();
`

function obfuscate(res) {

    res = JavaScriptObfuscator.obfuscate(
        res,
        {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        }
    );
    return res.getObfuscatedCode();
}