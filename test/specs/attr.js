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

    it('should alias className to class', () => {
        attr(element, 'className', 'foo');
        
        expect(element.className).to.equal('foo');
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

    it('should not add "px" suffix for custom properties', () => {
        attr(element, 'style', {'--foo': '100px', width: 'var(--foo)'});

        expect(element.style.width).to.equal('var(--foo)');
        expect(getStyle(element, '--foo')).to.equal('100px');
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

    it('should alias dataset to data', () => {
        attr(element, 'dataset', {
            a: 'foo',
            b: true,
            c: [1, 2, 3]
        });

        expect(element.dataset.a).to.equal('foo');
        expect(element.dataset.b).to.equal('true');
        expect(element.dataset.c).to.equal(JSON.stringify([1, 2, 3]));
    });

    it('should support functions for attributes', () => {
        const callback1 = sinon.spy(() => 'bar');
        attr(element, 'foo', callback1);

        expect(element.getAttribute('foo')).to.equal('bar');
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(element);
        expect(callback1.args[0][1]).to.equal(null);

        const callback2 = sinon.spy(() => 'baz');
        attr(element, 'foo', callback2);

        expect(element.getAttribute('foo')).to.equal('baz');
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(element);
        expect(callback2.args[0][1]).to.equal('bar');

        const callback3 = sinon.spy(() => null);
        attr(element, 'foo', callback3);

        expect(element.hasAttribute('foo')).to.equal(false);
        expect(callback3.callCount).to.equal(1);
        expect(callback3.args[0][0]).to.equal(element);
        expect(callback3.args[0][1]).to.equal('baz');
    });

    it('should support functions for classes', () => {
        const callback1 = sinon.spy(() => 'bar');
        attr(element, 'className', callback1);

        expect(element.className).to.equal('bar');
        expect(element.getAttribute('class')).to.equal('bar');
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(element);
        expect(callback1.args[0][1]).to.equal(null);

        const callback2 = sinon.spy(() => 'baz');
        attr(element, 'class', callback2);

        expect(element.className).to.equal('baz');
        expect(element.getAttribute('class')).to.equal('baz');
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(element);
        expect(callback2.args[0][1]).to.equal('bar');
    });

    it('should support functions for boolean attributes', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const callback1 = sinon.spy(() => true);
        attr(checkbox, 'checked', callback1);

        expect(checkbox.checked).to.equal(true);
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(checkbox);
        expect(callback1.args[0][1]).to.equal(false);

        const callback2 = sinon.spy(() => false);
        attr(checkbox, 'checked', callback2);

        expect(checkbox.checked).to.equal(false);
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(checkbox);
        expect(callback2.args[0][1]).to.equal(true);
    });

    it('should support functions for properties', () => {
        const input = document.createElement('input');

        const callback1 = sinon.spy(() => 'foo');
        attr(input, 'value', callback1);

        expect(input.value).to.equal('foo');
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(input);
        expect(callback1.args[0][1]).to.equal('');

        const callback2 = sinon.spy(() => 'bar');
        attr(input, 'value', callback2);

        expect(input.value).to.equal('bar');
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(input);
        expect(callback2.args[0][1]).to.equal('foo');
    });

    it('should support functions for styles', () => {
        const callback1 = sinon.spy(() => 'width: 1px; height: 1px;');
        attr(element, 'style', callback1);

        expect(element.style.cssText).to.equal('width: 1px; height: 1px;');
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(element);
        expect(callback1.args[0][1]).to.deep.equal({});

        const callback2 = sinon.spy(() => {
            return {width: '2px', height: '2px'};
        });
        attr(element, 'style', callback2);

        expect(element.style.cssText).to.equal('width: 2px; height: 2px;');
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(element);
        expect(callback2.args[0][1]).to.deep.equal({width: '1px', height: '1px'});
    });

    it('should support functions for data', () => {
        const callback1 = sinon.spy(() => {
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
        attr(element, 'data', callback1);

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
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.equal(element);
        expect(callback1.args[0][1]).to.deep.equal({});

        const callback2 = sinon.spy(() => {
            return {
                d: 1234,
                g: {foo: 'baz'},
                h: [1, 2, 3, 4, 5],
                k: 'qux'
            };
        });
        attr(element, 'dataset', callback2);

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
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.equal(element);
        expect(callback2.args[0][1]).to.deep.equal({
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

        const callback = sinon.spy(() => ({}));
        attr(element, 'data', callback);

        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.equal(element);
        expect(callback.args[0][1]).to.deep.equal({
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

        const callback = sinon.spy(() => ({}));
        attr(element, 'data', callback);

        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.equal(element);
        expect(callback.args[0][1]).to.deep.equal({
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

        const callback = sinon.spy(() => 'bar');
        attr(element, 'class', callback);

        expect(element.getAttribute('class')).to.equal('bar');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.equal(element);
        expect(callback.args[0][1]).to.equal('foo');

        attr(element, 'class', null);
        expect(element.hasAttribute('class')).to.equal(false);
    });

    it('should support the input list attribute', () => {
        const input = document.createElement('input');

        attr(input, 'list', 'foo');
        expect(input.getAttribute('list')).to.equal('foo');
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

    it('should support the form attribute', () => {
        const form = document.createElement('form');
        form.id = 'foo';
        const input = document.createElement('input');
        form.appendChild(input);
        document.body.appendChild(form);

        attr(input, 'form', 'foo');

		expect(input).to.have.property('form', form);

        document.body.removeChild(form);
	});

    it('should support the download attribute', () => {
		attr(element, 'download', '');

		expect(element.getAttribute('download')).to.equal('');

		attr(element, 'download', null);

		expect(element.getAttribute('download')).to.equal(null);
	});

    it('should clear falsy input values', () => {
        const input = document.createElement('input');

        attr(input, 'value', 0);
        expect(input).to.have.property('value', '0');

        attr(input, 'value', false);
        expect(input).to.have.property('value', 'false');

        attr(input, 'value', null);
        expect(input).to.have.property('value', '');

        attr(input, 'value', undefined);
		expect(input).to.have.property('value', '');
	});

    it('should support falsy DOM properties', () => {
        const input = document.createElement('input');
        const table = document.createElement('table');

        attr(input, 'value', false);
        attr(table, 'border', false);

        expect(input.outerHTML).to.equal('<input>');
        expect(table.outerHTML).to.equal('<table border="false"></table>');

        attr(input, 'value', null);
        attr(table, 'border', null);

        expect(input.outerHTML).to.equal('<input>');
        expect(table.outerHTML).to.equal('<table border=""></table>');

        attr(input, 'value', undefined);
        attr(table, 'border', undefined);

        expect(input.outerHTML).to.equal('<input>');
        expect(table.outerHTML).to.equal('<table border=""></table>');
    });

    it('should set an enumerable boolean attribute', () => {
        const input = document.createElement('input');

        attr(input, 'spellcheck', false);

		expect(input.spellcheck).to.equal(false);
	});

    it('should support false string aria attributes', () => {
        attr(element, 'aria-checked', 'false');

		expect(element.getAttribute('aria-checked')).to.equal('false');
	});

	it('should support false aria attributes', () => {
		attr(element, 'aria-checked', false);

		expect(element.getAttribute('aria-checked')).to.equal('false');
	});

	it('should support false data attributes', () => {
		attr(element, 'data-checked', false);

		expect(element.getAttribute('data-checked')).to.equal('false');
	});

	it('should set checked attribute on custom elements without checked property', () => {
        const el = document.createElement('foo-bar');

        attr(el, 'checked', true);

		expect(el.outerHTML).to.equal('<foo-bar checked="true"></foo-bar>');
	});

	it('should set value attribute on custom elements without value property', () => {
        const el = document.createElement('foo-bar');

        attr(el, 'value', 'test');

		expect(el.outerHTML).to.equal('<foo-bar value="test"></foo-bar>');
	});

	it('should mask value on password input elements', () => {
        const input = document.createElement('input');

        attr(input, 'type', 'password');
        attr(input, 'value', 'foo');

		expect(input.outerHTML).to.equal('<input type="password">');
	});

	it('should unset href if null or undefined', () => {
        const anchor = document.createElement('a');

        attr(anchor, 'href', '#');
        expect(anchor.hasAttribute('href')).to.equal(true);

        attr(anchor, 'href', null);
        expect(anchor.hasAttribute('href')).to.equal(false);

        attr(anchor, 'href', undefined);
        expect(anchor.hasAttribute('href')).to.equal(false);

        attr(anchor, 'href', '');
        expect(anchor.hasAttribute('href')).to.equal(true);
	});

    it('should not set tagName', () => {
		expect(() => attr(element, 'tagName', 'span')).not.to.throw();
	});

    it('should not throw when setting size to an invalid value', () => {
        const input = document.createElement('input');
        document.body.appendChild(input);

		expect(() => attr(input, 'size', null)).to.not.throw();
		expect(() => attr(input, 'size', undefined)).to.not.throw();
		expect(() => attr(input, 'size', 0)).to.not.throw();

        document.body.removeChild(input);
	});
});
