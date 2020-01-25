const JSON_RE = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const NAMESPACES = {
    'xlink:actuate': XLINK_NS,
    'xlink:arcrole': XLINK_NS,
    'xlink:href': XLINK_NS,
    'xlink:role': XLINK_NS,
    'xlink:show': XLINK_NS,
    'xlink:title': XLINK_NS,
    'xlink:type': XLINK_NS,
    'xml:base': XML_NS,
    'xml:lang': XML_NS,
    'xml:space': XML_NS
};

function stringifyData(data) {
	if (typeof data === 'object') {
        return JSON.stringify(data);
	}
	return data;
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
    if (name === 'class' || name === 'className') {
        return element.getAttribute('class');
    }
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
    if (!isSvg && name in element) {
        return element[name];
    }
    return element.getAttribute(name);
}

export default function attr(element, name, value) {
    if (typeof name === 'object') {
        return Object.keys(name).forEach((key) => attr(element, key, name[key]));
    }
    if (name.startsWith('on')) {
        element.addEventListener(name.slice(2).toLowerCase(), value);
        return;
    }
    const isSvg = element instanceof SVGElement;
    if (typeof value === 'function') {
        value = value(element, getCurrentValue(element, name, isSvg));
    }
    if ((name === 'class' || name === 'className') && Array.isArray(value)) {
        value = value.join(' ');
    }
    if (name === 'style') {
        if (typeof value === 'string') {
            element.style.cssText = value;
        } else {
            for (const key in value) {
                let style = value[key] == null ? '' : value[key];
                if (typeof style === 'number' && IS_NON_DIMENSIONAL.test(key) === false) {
                    style = style + 'px';
                }
                if (key.includes('-')) {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (name === 'data' || name === 'dataset') {
        for (const key in value) {
            element.dataset[key] = stringifyData(value[key]);
        }
    } else if (!isSvg && name !== 'form' && name !== 'list' && name in element) {
        element[name] = value == null ? '' : value;
    } else if (value == null || value === false) {
        element.removeAttribute(name);
    } else if (isSvg && name in NAMESPACES) {
        element.setAttributeNS(NAMESPACES[name], name, value);
    } else {
        element.setAttribute(name, value);
    }
}
