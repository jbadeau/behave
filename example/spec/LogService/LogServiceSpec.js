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

// properties are available via this
// inject wire components in in methods using @autowire
// all methods support returning promises for async support
// assertions are provided by sinon and chai adapters
// then.expect takes either function(description) or a value
.describe('.log', function() {
	it('should notify log listeners', function(/* @autowire */someComponent) {
		this.logService(INFO, 'i am a sweet logger');
	}).expect(this.logListener).to.eventually.be.calledWith({
		level : 1,
		message : 'i am a sweet logger'
	});

	it('should fail when called with an invalid log level', function() {
		this.logService(undefined, 'i am a naughty logger');
	}).expect(function(descriptor) {
		return descriptor.state;
	}).to.equal('rejected');
})

.endSpec();