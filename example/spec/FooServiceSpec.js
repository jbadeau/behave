/**
 * An example behave specification.
 */
/**
 * 1. Start the spec with a given name.
 */
behave.spec('FooService')

/**
 * 2. load 1-n wire context files and/or object literals.
 *
 * <p>
 * ('context') or ({}) or ['context', {}, ...]
 *
 * <p>
 * The context lives throughout the duration of the spec and it's properties can
 * be accessed in the spec using the autowire annotation.
 */
.wire(['./root'])

/**
 * 3. Declare data properties which are made implicity available to setup and
 * test methods.
 *
 * <p>
 * Is there some usecase for observables here? For example all non functions are
 * observed for value changes and all functions are observered for invocations.
 *
 * <p>
 * An example use case could be weaving some function invocation advice so that
 * one does not need to test async handlers like:
 *
 * <p>
 *
 * <code>
 * function fooListener(event) {
 *     expect(event === 'foo');
 *     done();
 * }
 * </code>
 *
 * but rather like : <code>
 * expect(fooListener).to.eventually.be.calledWith('foo');
 * </code>
 * expect is notif
 *
 */
.data({
    fooService: null,
    fooListener: null
})

/**
 * 4. Standard setup methods.
 *
 * <p>
 * Data properties are implicity available.
 *
 * <p>
 * Use autowire to inject wire components.
 */
.before({
    all: function () {
        console.info('called once before all tests');
    },
    each: function ( /* @autowire */ logFactory) {
        console.info('called before each tests');
        this.fooService.set(logFactory.newInstance());
        this.fooListener = spy(); // sinon spy
    }
})

/**
 * 5. Standard teardown methods.
 *
 * <p>
 * Observables are implicity available.
 *
 * <p>
 * Use autowire to inject wire components.
 */
.after({
    all: {
        console.info('called once before all tests');
    },
    each: {
        console.info('called after each test');
    }
})

/**
 * Describe tests.
 *
 * <p>
 * Data properties are implicity available
 *
 * <p>
 * Use autowire the to inject wire components.
 *
 * <p>
 * It methods support returning promises
 *
 * <p>
 * Expect methods support either a settle resolver function, a value or empty()
 *
 * <p>
 * Assert expectations using chai + sinon assertions
 */
.describe('.foo', function () {

    // basic resolve expectation. An exception or rejected promise fails test.
    it('should succeed when called with a valid message', function () {
        return this.fooService.foo('bar'); // returns a resolved promise
    })
    .so.expect()
    .to.resolve();

    // basic reject expectation. Anything but an exception or rejected promise
    // fails the test
    it('should fail when called without a message', function () {
        return this.fooService.foo(); // returns a rejected promise
    })
    .so.expect()
    .to.reject();

    // expect that fooListener (observed sinon spy) is called
    it('should notify foo listeners', function () {
        this.fooService.foo('foo');
    })
    .so.expect(this.fooListener)
    .to.be.calledWith('foo');

    // chaining promises in it and using sinon to check each call
    it('should notify foo listeners', function () {
        this.fooService.foo('foo', 'bar')
        .then(this.fooService.foo.bind(123456));
    })
    .so.expect(this.fooListener)
    .to.be.calledWith('foo', 'bar')
    .then.to.be.calledWith(12345);


    // evaulate the description (when.settle)
    it('should fail when called without an invalid message', function () {
        return this.fooService.foo(null); // returns a rejected promise
    })
    .so.expect(function (descriptor) {
        return descriptor.reason;
    })
    .to.equal('invalid message: null');
   
})

/**
 * Is nesting support really needed?
 */
.describe('.someLogFunction', function () {

    /**
     * Wire child context that will be automatically destroyed on exit of this
     * describe.
     */
    wire('child')

    /**
     * Mixin child properties that will be automatically removed on exit of this
     * describe. Properties will shadow (not replace) same named parent
     * properties.
     */
    .data()

    //
    .before()

    //
    .after();

    describe('given some context', function () {
    	
        it('should do something', function () {
            return this.fooService.foo();
        })
        .so.expect().to.eventually.equal('bar');
        
    });
})

.endSpec();