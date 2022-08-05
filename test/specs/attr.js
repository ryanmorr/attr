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

        expect(element.foo).to.equal(undefined);
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

    it('should not set an attribute with a falsy value', () => {
        attr(element, {
            a: null,
            b: undefined,
            c: false,
            d: NaN,
            e: 0
        });

        expect(element.getAttribute('a')).to.equal(null);
        expect(element.getAttribute('b')).to.equal(null);
        expect(element.getAttribute('c')).to.equal(null);
        expect(element.getAttribute('d')).to.equal('NaN');
        expect(element.getAttribute('e')).to.equal('0');
    });

    it('should remove an attribute by providing null, undefined, or false as the value', () => {
        attr(element, 'foo', 'a');
        expect(element.hasAttribute('foo')).to.equal(true);

        attr(element, 'foo', null);
        expect(element.hasAttribute('foo')).to.equal(false);

        attr(element, 'bar', 'b');
        expect(element.hasAttribute('bar')).to.equal(true);

        attr(element, 'bar', undefined);
        expect(element.hasAttribute('bar')).to.equal(false);

        attr(element, 'baz', 'c');
        expect(element.hasAttribute('baz')).to.equal(true);

        attr(element, 'baz', false);
        expect(element.hasAttribute('baz')).to.equal(false);
    });

    it('should set the class attribute', () => {
        attr(element, 'class', 'foo');
        expect(element.className).to.equal('foo');
        expect(element.getAttribute('class')).to.equal('foo');

        attr(element, 'className', 'bar');
        expect(element.className).to.equal('bar');
        expect(element.getAttribute('class')).to.equal('bar');
    });

    it('should set the class attribute with an array', () => {
        attr(element, 'class', ['foo', 'bar', 'baz']);
        expect(element.className).to.equal('foo bar baz');
        expect(element.getAttribute('class')).to.equal('foo bar baz');

        attr(element, 'className', ['a', 'b', 'c', 'd']);
        expect(element.className).to.equal('a b c d');
        expect(element.getAttribute('class')).to.equal('a b c d');
    });
    
    it('should set the class attribute with an object', () => {
        attr(element, 'class', {foo: true, bar: false, baz: true});
        expect(element.className).to.equal('foo baz');
        expect(element.getAttribute('class')).to.equal('foo baz');

        attr(element, 'className', {foo: false, bar: true, baz: true, qux: true});
        expect(element.className).to.equal('bar baz qux');
        expect(element.getAttribute('class')).to.equal('bar baz qux');
    });

    it('should remove the class attribute by providing null or undefined as the value', () => {
        attr(element, 'class', 'foo');
        expect(element.hasAttribute('class')).to.equal(true);

        attr(element, 'class', null);
        expect(element.className).to.equal('');
        expect(element.hasAttribute('class')).to.equal(false);

        attr(element, 'class', 'b');
        expect(element.hasAttribute('class')).to.equal(true);

        attr(element, 'class', undefined);
        expect(element.className).to.equal('');
        expect(element.hasAttribute('class')).to.equal(false);
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

    it('should set a boolean attribute to false', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.disabled = true;

        expect(checkbox.checked).to.equal(true);
        attr(checkbox, 'checked', false);
        expect(checkbox.checked).to.equal(false);

        expect(checkbox.disabled).to.equal(true);
        attr(checkbox, 'disabled', false);
        expect(checkbox.disabled).to.equal(false);
    });

    it('should not change the defaultValue of boolean attributes', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('checked', '');

        expect(checkbox.checked).to.equal(true);
        expect(checkbox.hasAttribute('checked')).to.equal(true);
        expect(checkbox.getAttribute('checked')).to.equal('');

        attr(checkbox, 'checked', false);
        expect(checkbox.checked).to.equal(false);
        expect(checkbox.hasAttribute('checked')).to.equal(true);
        expect(checkbox.getAttribute('checked')).to.equal('');
    });

    it('should set a property', () => {
        const input = document.createElement('input');

        attr(input, 'value', 'foo');
        expect(input.value).to.equal('foo');
    });

    it('should unset a property by providing null or undefined as the value', () => {
        const input = document.createElement('input');

        attr(input, 'value', 0);
        expect(input.value).to.equal('0');

        attr(input, 'value', null);
        expect(input.value).to.equal('');

        attr(input, 'value', false);
        expect(input.value).to.equal('false');

        attr(input, 'value', undefined);
        expect(input.value).to.equal('');

        attr(input, 'value', NaN);
        expect(input.value).to.equal('NaN');
    });

    it('should not change the defaultValue of properties', () => {
        const input = document.createElement('input');
        input.setAttribute('value', 'foo');

        expect(input.value).to.equal('foo');
        expect(input.hasAttribute('value')).to.equal(true);
        expect(input.getAttribute('value')).to.equal('foo');

        attr(input, 'value', 'bar');
        expect(input.value).to.equal('bar');
        expect(input.hasAttribute('value')).to.equal(true);
        expect(input.getAttribute('value')).to.equal('foo');
    });

    it('should set CSS styles as a string', () => {
        attr(element, 'style', 'width: 32px; height: 21px');

        expect(element.style.cssText).to.equal('width: 32px; height: 21px;');
    });

    it('should set CSS styles as a key/value map', () => {
        attr(element, 'style', {width: '74px', height: '17px'});

        expect(element.style.cssText).to.equal('width: 74px; height: 17px;');
    });

    it('should support kebab-case for style property names', () => {
        attr(element, 'style', {'background-color': 'black'});

        expect(element.style.cssText).to.equal('background-color: black;');
    });

    it('should support camel-case for style property names', () => {
        attr(element, 'style', {'backgroundColor': 'blue'});

        expect(element.style.cssText).to.equal('background-color: blue;');
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

    it('should use pixels for units by default', () => {
        attr(element, 'style', {
            width: '2em',
            gridRowStart: 1,
            'padding-top': 5,
            'padding-bottom': '0.7ex',
            top: 100,
            left: '100%'
        });

        expect(element.style.cssText).to.equal('width: 2em; grid-row-start: 1; padding-top: 5px; padding-bottom: 0.7ex; top: 100px; left: 100%;');
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

    it('should set data and convert primitives and objects to strings', () => {
        attr(element, 'data', {
            a: 'foo',
            b: true,
            c: false,
            d: 123,
            e: null,
            f: undefined,
            g: {foo: 'bar'},
            h: [1, 2, 3]
        });

        expect(element.dataset.a).to.equal('foo');
        expect(element.dataset.b).to.equal('true');
        expect(element.dataset.c).to.equal('false');
        expect(element.dataset.d).to.equal('123');
        expect(element.dataset.e).to.equal('null');
        expect(element.dataset.f).to.equal('undefined');
        expect(element.dataset.g).to.equal(JSON.stringify({foo: 'bar'}));
        expect(element.dataset.h).to.equal(JSON.stringify([1, 2, 3]));
    });

    it('should support thunks for attributes', () => {
        const thunk1 = sinon.spy(() => 'bar');
        attr(element, 'foo', thunk1);

        expect(element.getAttribute('foo')).to.equal('bar');
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(element);
        expect(thunk1.args[0][1]).to.equal(null);

        const thunk2 = sinon.spy(() => 'baz');
        attr(element, 'foo', thunk2);

        expect(element.getAttribute('foo')).to.equal('baz');
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(element);
        expect(thunk2.args[0][1]).to.equal('bar');

        const thunk3 = sinon.spy(() => null);
        attr(element, 'foo', thunk3);

        expect(element.hasAttribute('foo')).to.equal(false);
        expect(thunk3.callCount).to.equal(1);
        expect(thunk3.args[0][0]).to.equal(element);
        expect(thunk3.args[0][1]).to.equal('baz');
    });

    it('should support thunks for classes', () => {
        const thunk1 = sinon.spy(() => 'bar');
        attr(element, 'className', thunk1);

        expect(element.className).to.equal('bar');
        expect(element.getAttribute('class')).to.equal('bar');
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(element);
        expect(thunk1.args[0][1]).to.equal(null);

        const thunk2 = sinon.spy(() => 'baz');
        attr(element, 'class', thunk2);

        expect(element.className).to.equal('baz');
        expect(element.getAttribute('class')).to.equal('baz');
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(element);
        expect(thunk2.args[0][1]).to.equal('bar');
    });

    it('should support thunks for boolean attributes', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const thunk1 = sinon.spy(() => true);
        attr(checkbox, 'checked', thunk1);

        expect(checkbox.checked).to.equal(true);
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(checkbox);
        expect(thunk1.args[0][1]).to.equal(false);

        const thunk2 = sinon.spy(() => false);
        attr(checkbox, 'checked', thunk2);

        expect(checkbox.checked).to.equal(false);
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(checkbox);
        expect(thunk2.args[0][1]).to.equal(true);
    });

    it('should support thunks for properties', () => {
        const input = document.createElement('input');

        const thunk1 = sinon.spy(() => 'foo');
        attr(input, 'value', thunk1);

        expect(input.value).to.equal('foo');
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(input);
        expect(thunk1.args[0][1]).to.equal('');

        const thunk2 = sinon.spy(() => 'bar');
        attr(input, 'value', thunk2);

        expect(input.value).to.equal('bar');
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(input);
        expect(thunk2.args[0][1]).to.equal('foo');
    });

    it('should support thunks for styles', () => {
        const thunk1 = sinon.spy(() => 'width: 1px; height: 1px;');
        attr(element, 'style', thunk1);

        expect(element.style.cssText).to.equal('width: 1px; height: 1px;');
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(element);
        expect(thunk1.args[0][1]).to.deep.equal({});

        const thunk2 = sinon.spy(() => {
            return {width: '2px', height: '2px'};
        });
        attr(element, 'style', thunk2);

        expect(element.style.cssText).to.equal('width: 2px; height: 2px;');
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(element);
        expect(thunk2.args[0][1]).to.deep.equal({width: '1px', height: '1px'});
    });

    it('should support thunks for data', () => {
        const thunk1 = sinon.spy(() => {
            return {
                a: 'foo',
                b: true,
                c: false,
                d: 123,
                e: null,
                f: undefined,
                g: {foo: 'bar'},
                h: [1, 2, 3],
                i: ' ',
                j: ''
            };
        });
        attr(element, 'data', thunk1);

        expect(element.dataset.a).to.equal('foo');
        expect(element.dataset.b).to.equal('true');
        expect(element.dataset.c).to.equal('false');
        expect(element.dataset.d).to.equal('123');
        expect(element.dataset.e).to.equal('null');
        expect(element.dataset.f).to.equal('undefined');
        expect(element.dataset.g).to.equal(JSON.stringify({foo: 'bar'}));
        expect(element.dataset.h).to.equal(JSON.stringify([1, 2, 3]));
        expect(element.dataset.i).to.equal(' ');
        expect(element.dataset.j).to.equal('');
        expect(thunk1.callCount).to.equal(1);
        expect(thunk1.args[0][0]).to.equal(element);
        expect(thunk1.args[0][1]).to.deep.equal({});

        const thunk2 = sinon.spy(() => {
            return {
                d: 1234,
                g: {foo: 'baz'},
                h: [1, 2, 3, 4, 5],
                k: 'qux'
            };
        });
        attr(element, 'dataset', thunk2);

        expect(element.dataset.a).to.equal('foo');
        expect(element.dataset.b).to.equal('true');
        expect(element.dataset.c).to.equal('false');
        expect(element.dataset.d).to.equal('1234');
        expect(element.dataset.e).to.equal('null');
        expect(element.dataset.f).to.equal('undefined');
        expect(element.dataset.g).to.equal(JSON.stringify({foo: 'baz'}));
        expect(element.dataset.h).to.equal(JSON.stringify([1, 2, 3, 4, 5]));
        expect(element.dataset.i).to.equal(' ');
        expect(element.dataset.j).to.equal('');
        expect(element.dataset.k).to.equal('qux');
        expect(thunk2.callCount).to.equal(1);
        expect(thunk2.args[0][0]).to.equal(element);
        expect(thunk2.args[0][1]).to.deep.equal({
            a: 'foo',
            b: true,
            c: false,
            d: 123,
            e: null,
            f: undefined,
            g: {foo: 'bar'},
            h: [1, 2, 3],
            i: ' ',
            j: ''
        });
    });

    it('should not convert numeric strings if it changes its representation', () => {
        attr(element, 'data', () => {
            return {
                a: '5',
                b: '5.5',
                c: '5.5E3',
                d: '5.574E9',
                e: '0x42',
                f: '5..5',
                g: '-.',
                h: '123456789123456789123456789'
            };
        });

        const thunk = sinon.spy(() => ({}));
        attr(element, 'data', thunk);

        expect(thunk.callCount).to.equal(1);
        expect(thunk.args[0][0]).to.equal(element);
        expect(thunk.args[0][1]).to.deep.equal({
            a: 5,
            b: 5.5,
            c: '5.5E3',
            d: '5.574E9',
            e: '0x42',
            f: '5..5',
            g: '-.',
            h: '123456789123456789123456789'
        });
    });

    it('should not convert invalid JSON', () => {
        attr(element, 'data', () => {
            return {
                a: '{123}',
                b: '[abc]',
                c: ' {}',
                d: '[] '
            };
        });

        const thunk = sinon.spy(() => ({}));
        attr(element, 'data', thunk);

        expect(thunk.callCount).to.equal(1);
        expect(thunk.args[0][0]).to.equal(element);
        expect(thunk.args[0][1]).to.deep.equal({
            a: '{123}',
            b: '[abc]',
            c: ' {}',
            d: '[] '
        });
    });

    it('should support SVG elements', () => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        attr(element, 'width', 100);
        attr(element, 'height', 150);

        expect(element.getAttribute('width')).to.equal('100');
        expect(element.getAttribute('height')).to.equal('150');

        attr(element, 'class', 'foo');
        expect(element.getAttribute('class')).to.equal('foo');

        const thunk = sinon.spy(() => 'bar');
        attr(element, 'class', thunk);

        expect(element.getAttribute('class')).to.equal('bar');
        expect(thunk.callCount).to.equal(1);
        expect(thunk.args[0][0]).to.equal(element);
        expect(thunk.args[0][1]).to.equal('foo');

        attr(element, 'class', null);
        expect(element.hasAttribute('class')).to.equal(false);
    });

    it('should support attribute namespaces', () => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        expect(element.getAttribute('xlink:href')).to.equal(null);
        attr(element, 'xlink:href', 'foo');
        expect(element.getAttribute('xlink:href')).to.equal('foo');
    });

    it('should support the input list attribute', () => {
        const input = document.createElement('input');

        attr(input, 'list', 'foo');
        expect(input.getAttribute('list')).to.equal('foo');
    });

    it('should support the input form attribute', () => {
        const input = document.createElement('input');

        attr(input, 'form', 'foo');
        expect(input.getAttribute('form')).to.equal('foo');
    });

    it('should support innerHTML', () => {
        attr(element, 'innerHTML', '<span></span>');
        expect(element.innerHTML).to.equal('<span></span>');

        attr(element, 'innerHTML', null);
        expect(element.innerHTML).to.equal('');
    });

    it('should select option elements', () => {
        element.innerHTML = `
            <select>
                <option selected>foo</option>
                <option>bar</option>
            </select>
        `;

        const options = element.querySelectorAll('option');
        attr(options[1], 'selected', true);
        expect(options[0].selected).to.equal(false);
        expect(options[1].selected).to.equal(true);
    });
});
