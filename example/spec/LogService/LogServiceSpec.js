/**
 * An example behave specification.
 */

/**
 * 1. Start the spec with a given name.
 */
behave.spec('LogService')

/**
 * 2. load 1-n wire context files and/or object literals.
 * <p>
 * ('context') or ({}) or ['context', {}, ...]
 * <p>
 * The context lives throughout the duration of the spec and it's properties can
 * be accessed in the spec using the autowire annotation.
 */
.wire([ './root' ])

/**
 * 3. Declare data properties which are made implicity available.
 * <p>
 * Is there some usecase for observables here
 */
.data({
	logService : null,
	logListener : null
})

/**
 * 4. Standard setup methods.
 * <p>
 * Observables are implicity available.
 * <p>
 * Use autowire the to inject wire components.
 */
.before({
	all : function() {
		console.info('setup called once before all tests');
	},
	// inject logFactory from wire context
	each : function(/* @autowire */logFactory) {
		console.info('setup called before each tests');
		this.logService.set(logFactory.newInstance());
		// sinon spy
		this.logListener = spy();
	}
})

/**
 * 5. Standard teardown methods.
 * <p>
 * Observables are implicity available.
 * <p>
 * Use autowire the to inject wire components.
 */
.after({
	all : {
		teardown : function() {
			console.info('setup called once after all tests');
		}
	},
	each : {
		teardown : function() {
		}
	}
})

/**
 * Describe tests.
 * <p>
 * Observables are implicity available
 * <p>
 * Use autowire the to inject wire components.
 * <p>
 * it methods support returning promises
 * <p>
 * expect methods support either a settle resolver function, a value or empty()
 * <p>
 * assert expectations using chai + sinon assertions
 */
.describe('.log', function() {

	// basic resolve expectation. An exception or rejected promise fails test.
	it('should not fail', function() {
		this.logService(INFO, 'i am a sweet logger');
	}).so.expect().to.eventually.resolve();

	// basic reject expectation. Anything but an exception or rejected promise
	// fails the test
	it('should fail when called with an invalid log level', function() {
		this.logService(undefined, 'i am a naughty logger');
	}).so.expect().to.eventually.reject();

	// expect that the logListener (sinon spy) is called with some data
	it('should notify log listeners', function() {
		this.logService(INFO, 'i am a sweet logger');
	})
	so.expect(this.logListener).to.eventually.be.calledWith({
		level : 1,
		message : 'i am a sweet logger'
	});

	// expect that the resolved value or promise contains
	it('should fail when called with an invalid log level', function() {
		this.logService(undefined, 'i am a naughty logger');
	}).so.expect(function(descriptor) {
		return descriptor.reason;
	}).to.eventually.equal('invalid log level');

})

// - nesting support
.describe('.someLogFunction', function() {

	// Wire child context that will be automatically destroyed on exit of
	// describe.
	wire('child')

	// Mixin child properties that will be automatically removed on exit of
	// describe. Properties will shade (not replace) same named parent
	// properties.
	.data()

	//
	.before()

	//
	.after();

	describe('given some context', function() {
		it('should do something', function() {
			return this.logService.foo();
		}).so.expect().to.eventually.equal('bar');
	});
})

.endSpec();