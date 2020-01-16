import attr from '../../src/attr';

describe('attr', () => {
    let element;

    function getStyle(element, prop) {
        return window.getComputedStyle(element).getPropertyValue(prop);
    }

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should set an attribute', () => {
        attr(element, 'foo', 'bar');

        expect(element.getAttribute('foo')).to.equal('bar');
    });

    it('should set multiple attributes', () => {
        attr(element, {
            foo: 'bar',
            baz: 'qux'
        });

        expect(element.getAttribute('foo')).to.equal('bar');
        expect(element.getAttribute('baz')).to.equal('qux');
    });

    it('should set the class attribute', () => {
        attr(element, 'class', 'foo');
        expect(element.className).to.equal('foo');

        attr(element, 'className', 'bar')
        expect(element.className).to.equal('bar');
    });

    it('should set the class attribute with an array', () => {
        attr(element, 'class', ['foo', 'bar', 'baz']);
        expect(element.className).to.equal('foo bar baz');

        attr(element, 'className', ['a', 'b', 'c', 'd']);
        expect(element.className).to.equal('a b c d');
    });

    it('should remove an attribute by providing null, undefined, or false as the value', () => {
        attr(element, 'foo', 'bar');
        expect(element.hasAttribute('foo')).to.equal(true);

        attr(element, 'foo', null);
        expect(element.hasAttribute('foo')).to.equal(false);

        attr(element, 'class', 'baz');
        expect(element.hasAttribute('class')).to.equal(true);

        attr(element, 'class', undefined);
        expect(element.hasAttribute('class')).to.equal(false);

        attr(element, 'style', 'width: 10px');
        expect(element.hasAttribute('style')).to.equal(true);

        attr(element, 'style', false);
        expect(element.hasAttribute('style')).to.equal(false);
    });

    it('should set a boolean attribute to true', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false;

        expect(checkbox.checked).to.equal(false);
        attr(checkbox, 'checked', true);
        expect(checkbox.checked).to.equal(true);

        expect(checkbox.disabled).to.equal(false);
        attr(checkbox, 'disabled', true);
        expect(checkbox.disabled).to.equal(true);
    });

    it('should remove a boolean attribute by providing null, undefined, or false as the value', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.checked = true;
        attr(checkbox, 'checked', false);
        expect(checkbox.checked).to.equal(false);

        checkbox.checked = true;
        attr(checkbox, 'checked', null);
        expect(checkbox.checked).to.equal(false);

        checkbox.checked = true;
        attr(checkbox, 'checked', undefined);
        expect(checkbox.checked).to.equal(false);
    });

    it('should set a property', () => {
        const input = document.createElement('input');

        attr(input, 'value', 'foo');
        expect(input.value).to.equal('foo');
    });

    it('should unset a property by providing null or undefined as the value', () => {
        const input = document.createElement('input');

        attr(input, 'value', null);
        expect(input.value).to.equal('');

        attr(input, 'value', 'foo');
        expect(input.value).to.equal('foo');

        attr(input, 'value', undefined);
        expect(input.value).to.equal('');
    });

    it('should set CSS styles as a string', () => {
        attr(element, 'style', 'width: 32px; height: 21px');

        expect(getStyle(element, 'width')).to.equal('32px');
        expect(getStyle(element, 'height')).to.equal('21px');
    });

    it('should set CSS styles as a key/value map', () => {
        attr(element, 'style', {width: '74px', height: '17px'});

        expect(getStyle(element, 'width')).to.equal('74px');
        expect(getStyle(element, 'height')).to.equal('17px');
    });

    it('should support kebab-case for style property names', () => {
        attr(element, 'style', {'background-color': 'black'});

        expect(getStyle(element, 'background-color')).to.equal('rgb(0, 0, 0)');
    });

    it('should support camel-case for style property names', () => {
        attr(element, 'style', {'backgroundColor': 'blue'});

        expect(getStyle(element, 'background-color')).to.equal('rgb(0, 0, 255)');
    });

    it('should support CSS variables', () => {
        attr(element, 'style', {color: 'var(--color)', '--color': 'red'});

        expect(element.style.color).to.equal('var(--color)');
        expect(getStyle(element, 'color')).to.equal('rgb(255, 0, 0)');
        expect(getStyle(element, '--color')).to.equal('red');
    });

    it('should remove a CSS style by providing null, undefined, or an empty string as the value', () => {
        const defaultDisplay = getStyle(element, 'display');

        attr(element, 'style', {display: 'inline-block'});
        expect(getStyle(element, 'display')).to.equal('inline-block');

        attr(element, 'style', {display: null});
        expect(getStyle(element, 'display')).to.equal(defaultDisplay);

        attr(element, 'style', {display: 'flex'});
        expect(getStyle(element, 'display')).to.equal('flex');

        attr(element, 'style', {display: undefined});
        expect(getStyle(element, 'display')).to.equal(defaultDisplay);

        attr(element, 'style', {display: 'grid'});
        expect(getStyle(element, 'display')).to.equal('grid');

        attr(element, 'style', {display: ''});
        expect(getStyle(element, 'display')).to.equal(defaultDisplay);
    });

    it('should add an event listener', (done) => {
        const event = new MouseEvent('click');
        const onClick = (e) => {
            expect(e).to.equal(event);
            done();
        };

        attr(element, 'onclick', onClick);
        element.dispatchEvent(event);
    });

    it('should support camel-cased event names', (done) => {
        const event = new MouseEvent('mouseover');
        const onMouseOver = (e) => {
            expect(e).to.equal(event);
            done();
        };

        attr(element, 'onMouseOver', onMouseOver);
        element.dispatchEvent(event);
    });

    it('should set a data attribute', () => {
        attr(element, 'data-foo', 'bar');

        expect(element.dataset.foo).to.equal('bar');
        expect(element.getAttribute('data-foo')).to.equal('bar');
    });

    it('should set dataset', () => {
        attr(element, 'dataset', {
            foo: 'bar',
            baz: 'qux'
        });

        expect(element.dataset.foo).to.equal('bar');
        expect(element.dataset.baz).to.equal('qux');
        expect(element.getAttribute('data-foo')).to.equal('bar');
        expect(element.getAttribute('data-baz')).to.equal('qux');
    });

    it('should remove from dataset by providing null or undefined as the value', () => {
        attr(element, 'dataset', {
            foo: 'a',
            bar: 'b',
            baz: 'c',
            qux: 'd'
        });

        expect(element.dataset.foo).to.equal('a');
        expect(element.getAttribute('data-foo')).to.equal('a');

        attr(element, 'dataset', {
            foo: null,
        });

        expect(element.dataset.foo).to.equal(undefined);
        expect(element.hasAttribute('data-foo')).to.equal(false);

        attr(element, 'dataset', {
            bar: undefined,
        });

        expect(element.dataset.bar).to.equal(undefined);
        expect(element.hasAttribute('data-bar')).to.equal(false);
    });

    it('should convert a boolean value to string for dataset', () => {
        attr(element, 'dataset', {
            foo: true,
            baz: false
        });

        expect(element.dataset.foo).to.equal('true');
        expect(element.dataset.baz).to.equal('false');
        expect(element.getAttribute('data-foo')).to.equal('true');
        expect(element.getAttribute('data-baz')).to.equal('false');
    });
});
