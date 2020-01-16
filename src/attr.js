export default function attr(element, name, value) {
    if (typeof name === 'object') {
        return Object.keys(name).forEach((key) => attr(element, key, name[key]));
    }
    if (value == null || value === false) {
        if (name in element) {
            element[name] = '';
        }
        element.removeAttribute(name);
    } else if (name === 'class' || name === 'className') {
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
    } else if (name in element) {
        element[name] = value;
    } else {
        element.setAttribute(name, value);
    }
}
