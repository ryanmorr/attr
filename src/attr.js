function getAttribute(element, name) {
    if (name === 'class' || name === 'className') {
        return element.className;
    }
    if (name === 'style') {
        return element.style.cssText.split(';').reduce((styles, item) => {
            if (item) {
                const parts = item.split(':');
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
    if (name in element) {
        return element[name];
    }
    return element.getAttribute(name);
}

export default function attr(element, name, value) {
    if (typeof name === 'object') {
        return Object.keys(name).forEach((key) => attr(element, key, name[key]));
    }
    if (value == null || value === false) {
        if (name in element) {
            element[name] = '';
        }
        element.removeAttribute(name);
        return;
    } else if (name.startsWith('on')) {
        element.addEventListener(name.slice(2).toLowerCase(), value);
        return;
    }
    if (typeof value === 'function') {
        value = value(element, getAttribute(element, name));
    }
    if (name === 'class' || name === 'className') {
        if (Array.isArray(value)) {
            value = value.join(' ');
        }
        element.className = value;
    } else if (name === 'style') {
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
    } else if (name in element) {
        element[name] = value;
    } else {
        element.setAttribute(name, value);
    }
}