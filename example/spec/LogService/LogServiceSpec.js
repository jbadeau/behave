behave.spec('refs')

// wire 1-n context files like
// ('context') or ({}) or ['context', {}, ...]
// load factories, services, mock objects, ...
.wire('LogService')

// objects under test
.props({
	logService : null,
	logListener : null
})

// setup -> weave
// inject wire components using @autowire
// all methods support returning promises for async support
.before({
	all : {
		setup : function() {
			console.info('setup called once before all tests');
		},
		weave : function() {
			console.info('weave called once before all tests');
		}
	},
	each : {
		setup : function(/* @autowire */logFactory) {
			console.info('setup called before each tests');
			this.logService = logFactory.newInstance();
			this.logListener = function(logEntry) {
			};
		},
		weave : function() {
			console.info('weave called before each tests');
			// .advise uses meld and tracks removers for automatic removal
			advise.on(this.logFactory.log, onFunction);
		}
	}
})

// properties are available via this
// setup -> weave
// inject wire components using @autowire
// all methods support returning promises for async support
.after({
	all : {
		setup : function() {
			console.info('setup called once after all tests');
		},
		weave : function() {
			console.info('weave called once after all tests');
		}
	},
	each : {
		teardown : function() {
		},
		weave : function() {
			console.info('weave called after each tests');
		}
	}
})

// - properties are available via this
// - inject wire components in in methods using @autowire
// - all methods support returning promises for async support
// - assertions are provided by sinon and chai adapters
// - so.expect takes either a when.settle handler (function(descriptor ){}) or a
// value(someValue) or empty()
.describe('.log', function() {
	it('should notify log listeners', function() {
		this.logService(INFO, 'i am a sweet logger');
	}).so.expect(this.logListener).to.eventually.be.calledWith({
		level : 1,
		message : 'i am a sweet logger'
	});

	it('should fail when called with an invalid log level', function() {
		this.logService(undefined, 'i am a naughty logger');
	}).so.expect(function(descriptor) {
		return descriptor.state;
	}).to.equal('rejected');

	it('should fail when called with no message', function() {
		this.logService(undefined, 'i am a naughty logger');
	}).so.expect().to.reject();
})

// - nesting support
.describe('.someFunction', function() {
	describe('given some context', function() {
		it('should do something', function(/* @autowire */foo) {
			return foo();
		}).so.expect().to.equal('bar');
	});
})

.endSpec();