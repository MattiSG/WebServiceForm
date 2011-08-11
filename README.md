WebServiceForm
==============

**A [MooTools](http://mootools.net) automatic asynchronous (“AJAX”) form creator by [Matti Schneider-Ghibaudo](http://mattischneider.fr).**

Basically, transforms a plain form to an asynchronous one with nice visual clues out of a single call. Meant mostly for **developing a frontend to an API where you care more about result codes than about actual content sent from the server**.

Differs from Form.Request in several important ways, which can be summed up in the fact that this WebServiceForm aims to help you develop frontends to APIs rather than simply getting updates from a server.

For example, while Form.Request aims to make updating an element with the reply to the submission straightforward, this class will let you handle it, and work only with status codes. It will also let you dynamically create the action URL from values in the form, letting you use clean [REST APIs](http://en.wikipedia.org/wiki/Representational_State_Transfer#RESTful_web_services).

- - - - - - - - - - - - - -

Presentation
============

Developer usage rationale
-------------------------

This class removes all the burden of catching submit events and replacing them with Requests. It also provides with all the CSS class-updating stuff you need to go directly to styling, and optionally offers default styling for quick prototyping.

The idea is to let you shift that API test form into a usable async one for free.

Features
--------

**You will get:**

* asynchronous submit (no page reload);
* submission blocking while first submit is done;
* destination URI (action attribute from the form) expansion with values from the form;
* CSS & submit button text updates about the submission process.

As a bonus:

* default CSS for your form that stresses the submission process.

**You will _not_ get:**

* form validation;
* server reply handling (an event will pass it to you, of course).

How to use
----------

**Dumb usage**

	WebServiceForm.applyToAll('form'); //of course, the arg will be passed to $$, so pass it whatever $$ accepts
    
You can put this piece of code anywhere, it will take care of domready events itself.

**More precise usage**

	new WebServiceForm(myForm[, options]); //where myForm is an Element or ID
	
**Action expansion**

To use action expansion (replacing parts of the destination URL with values from the form), just write your action with the names of the inputs between brackets to get their values.

Example:

	<form id="messageForm" method="post" action="myAction/{userName}">
		<input type="text" name="userName" value="MyName" required/>
		<input type="text" name="message" value="My message" required/>
		<input type="submit" value="Send message"/>
	</form>
	
	<!--
		Pressing submit will send a request to "myAction/MyName" with the parameters
		{
			userName: "MyName",
			message: "My message"
		}
	-->
	
Documentation
=============

Options
-------

* `resetOnSuccess`: time (in milliseconds) before the form should be reset after a successful update, or false if the form should not be reset. Defaults to 0 (immediate reset).
* `disableOnSubmit`: whether the inputs should be disabled while submissions of the form are forbidden.
	Can be either `false` (the default), `true` or "readonly", in which case the inputs won't be disabled but set to readonly (not compatible with all browsers).
* `classes`: a hash containing the CSS classes to be applied to the form element. May contain:
	- `reset`:	when the form is to be submitted. Defaults to none.
	- `submit`:	when the request has been sent and a reply is being waited for. Defaults to "submitting".
	- `success`:	when a successful reply has been received from the server. Defaults to "success".
	- `failure`:	when an failure reply has been received from the server. Defaults to "failure".
	
	Set any of these to `false` to prevent the class from updating.
	
* `values`: a hash containing the values which the submit input should be updated with. Contains the same keys as the `classes` hash, with the following default values:
	- `reset`:	defaults to the original value of the submit input.
	- `submit`:	defaults to "Sending…".
	- `success`:	defaults to "Thank you!".
	- `failure`:	defaults to "Try again".
	
	Set any of these to `false` to prevent the value from updating.
	
	These values also support value expansion, in the same way that the action expansion works. Example:
	
		<form id="accountForm" method="post" action="update/{acctNum}">
			<!-- … -->
			<input type="text" name="acctNum"/>
			<input type="submit" value="Update"/>
		</form>
		<script>
		new WebServiceForm('accountForm', {
			values: {
				submit: 'Trying to update account #{acctNum}',
				success: 'Successfully updated account #{acctNum}!'
			}
		});
		</script>

Events
------

The following events may be fired by an instance of this class:

* `success`: see [`Request.onSuccess`](http://mootools.net/docs/core/Request/Request), just forwarding the `Request` event, plus one last argument being the `WebServiceForm` instance that fired it.
	This event will be fired _before_ the form is reset, even if the delay for it is set to 0, so you can have a chance to get the values that were sent from the form.
* `failure`: see [`Request.onFailure`](http://mootools.net/docs/core/Request/Request), just forwarding the `Request` event, plus one last argument being the `WebServiceForm` instance that fired it.
* `submit`: right before the request is sent. Called with one parameter, the [`Request`](http://mootools.net/docs/core/Request/Request) instance that will be sent, so that you can control it and listen to fancier events (`loadstart`, `progress`…), plus one last argument being the `WebServiceForm` instance that fired it.
* `reset`: when the form is reset. One parameter: the `WebServiceForm` instance that fired the event.

Methods
-------

**Getters**

* `getForm()`: Returns the form to which this `WebServiceForm` is currenty attached.
* `getSubmit()`: Returns the submit input that this `WebServiceForm` updates.
* `isDisabled()`: Tells whether the form is currently disabled for submission (i.e. request has been sent and we're waiting for a reply) or not.

**Functions**

* `reset()`: Resets the form and focuses it.
* `disable()`: Forbids submission of the form, without updating the UI.
* `enable()`: Enables submission of the form, without updating the UI.

**Static**

* `applyToAll(elements[, options])`: Static global apply shortcut. Params:
	- `elements`: a `String` or `Element`, or whatever `$$` accepts. The forms to be enhanced with WebServiceForms.
	- `options`: _optional_, options to pass to the `WebServiceForms` instances.

**Bonus**

* `Element.asObject()`: returns a hash from this `Element`, with its keys being the names of descendant inputs and their corresponding values.

Compatibility
=============

MooTools
--------

This script depends on the JavaScript framework [MooTools](http://mootools.net).

This script is intended for MooTools 1.3, but a branch compatible with MooTools 1.2 is available too  :)

Browsers
--------

Tested and working under:

* Safari 5
* Firefox 3
* IE 6, 7, 8, 9ß (with [IETester](http://www.my-debugbar.com/wiki/IETester/HomePage)). IE 6 was very slow (5-6s latency locally) with async requests.

**Not working properly under Opera 10**: if one request succeeds, then all further ones pretend to succeed, even if the status codes show failure. This is most probably a problem in MooTools, but I don't have time to fix it right now.

Please contact me if you test it successfully in other browsers  :)

License
=======

[CC-BY](http://creativecommons.org/licenses/by/3.0/), i.e. "Do whatever you want as long as I am credited somewhere".
Credit must be both given in the code and accessible to the end user. The end-user part may be in an "about" link or whatever, no need to make the reference prominent, but it has to be somehow accessible if someone's wondering.