import attr from '../../src/attr';

describe('attr', () => {
    let element;

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
});
