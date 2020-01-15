export default function attr(element, name, value) {
    if (typeof name === 'object') {
        return Object.keys(name).forEach((key) => attr(element, key, name[key]));
    }
    if (name === 'class' || name === 'className') {
        if (Array.isArray(value)) {
            value = value.join(' ');
        }
        element.className = value;
    } else {
        element.setAttribute(name, value);
    }
}
