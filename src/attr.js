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
    if (name === 'dataset') {
        const data = {};
        for (const prop in element.dataset) {
            data[prop] = element.dataset[prop];
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
                const style = value[key] == null ? '' : value[key];
                if (key.includes('-')) {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (name === 'dataset') {
        for (const key in value) {
            const data = value[key];
            if (data == null && key in element.dataset) {
                delete element.dataset[key]
            } else {
                element.dataset[key] = value[key];
            }
        }
    } else if (!isSvg && name in element) {
        element[name] = value == null ? '' : value;
    } else if (value == null || value === false) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, value);
    }
}