/**
 * An example behave story.
 */

/**
 * 1. Start the spec with a given name.
 */
behave.story('Authentication')

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
.data({})

/**
 * 4. Standard setup methods.
 * <p>
 * Observables are implicity available.
 * <p>
 * Use Autowire the to inject wire components.
 */
.before({
	all : function() {
		console.info('setup called once before all tests');
	},
	each : function() {
		console.info('setup called before each tests');
	}
})

/**
 * 5. Standard teardown methods.
 * <p>
 * Observables are implicity available.
 * <p>
 * Use Autowire the to inject wire components.
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

.senario('login', function() {

	given('I am on the login page', function(/* @autowire */loginPage) {
		goto(loginPage);
	})

	.when('I enter a valid username', function(/* @autowire */ loginPage) {
		loginPage.password.value('guest');
	})
	.and('I enter a valid password', function(/* @autowire */ loginPage) {
		loginPage.password.value('123456');
	})
	.and('I submit', function(/* @autowire */ loginPage) {
		loginPage.submit.click();
	})
	.then.expect(function(/* @autowire */ loginPage) {
		return logingPage.title;
	}).to.eventually.equal('Home');

})

.endStory();