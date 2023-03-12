const JSON_RE = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

function stringifyData(data) {
	if (typeof data === 'object') {
        return JSON.stringify(data);
	}
	return data;
}

function createClass(obj) {
    let output = '';
    if (typeof obj === 'string') {
        return obj;
    }
    if (Array.isArray(obj) && obj.length > 0) {
        for (let i = 0, len = obj.length, tmp; i < len; i++) {
            if ((tmp = createClass(obj[i])) !== '') {
                output += (output && ' ') + tmp;
            }
        }
    } else {
        for (const cls in obj) {
            if (obj[cls]) {
                output += (output && ' ') + cls;
            }
        }
    }
    return output;
}

function parseData(data) {
	if (data === 'true') {
		return true;
	}
	if (data === 'false') {
		return false;
	}
	if (data === 'null') {
		return null;
    }
    if (data === 'undefined') {
		return undefined;
	}
	if (data === +data + '') {
		return +data;
	}
	if (JSON_RE.test(data)) {
        try {
            return JSON.parse(data);
        } catch(e) {
            // eslint-disable no-empty
        }
	}
	return data;
}

function getCurrentValue(element, name, isSvg) {
    if (name === 'style') {
        return element.style.cssText.split(';').reduce((styles, style) => {
            if (style) {
                const parts = style.split(':');
                styles[parts[0].trim()] = parts[1].trim();
            }
            return styles;
        }, {});
    }
    if (name === 'data' || name === 'dataset') {
        const data = {};
        for (const prop in element.dataset) {
            data[prop] = parseData(element.dataset[prop]);
        }
        return data;
    }
    if (!isSvg) {
        if (name === 'class' || name === 'className') {
            return element.getAttribute('class');
        }
        if (name in element) {
            return element[name];
        }
    }
    return element.getAttribute(name);
}

function setStyle(element, name, value) {
    if (name.startsWith('--')) {
        element.style.setProperty(name, value == null ? '' : value);
    } else if (value == null) {
        element.style[name] = '';
    } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(name)) {
        element.style[name] = value;
    } else {
        element.style[name] = value + 'px';
    }
}

export default function attr(element, name, value) {
    if (typeof name === 'object') {
        return Object.keys(name).forEach((key) => attr(element, key, name[key]));
    }
    if (name.startsWith('on')) {
        name = (name.toLowerCase() in element) ? name.toLowerCase().slice(2) : name.slice(2);
        element.addEventListener(name, value);
        return;
    }
    const isSvg = element instanceof SVGElement;
    if (typeof value === 'function') {
        value = value(element, getCurrentValue(element, name, isSvg));
    }
    if (value != null && (name === 'class' || name === 'className')) {
        value = createClass(value);
    }
    if (name === 'style') {
        if (typeof value === 'string') {
            element.style.cssText = value;
        } else {
            for (const key in value) {
                setStyle(element, key, value[key]);
            }
        }
    } else if (name === 'data' || name === 'dataset') {
        for (const key in value) {
            element.dataset[key] = stringifyData(value[key]);
        }
    } else {
        if (
            !isSvg &&
            name !== 'width' &&
            name !== 'height' &&
            name !== 'href' &&
            name !== 'list' &&
            name !== 'form' &&
            name !== 'tabIndex' &&
            name !== 'download' &&
            name in element
        ) {
            try {
                element[name] = value == null ? '' : value;
                return;
            } catch (e) {} // eslint-disable-line no-empty
        }
        if (value != null && (value !== false || name.indexOf('-') != -1)) {
            element.setAttribute(name, value);
        } else {
            element.removeAttribute(name);
        }
    }
}
