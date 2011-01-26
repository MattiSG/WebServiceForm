WebServiceForm
==============

Basically, a [MooTools](http://mootools.net) automatic asynchronous (“AJAX”) form creator. Transforms a plain form to an asynchronous one.

Differs from Form.Request in several important ways, which can be summed up in the fact that this WebServiceForm aims to help you develop frontends to APIs rather than simply getting updates from a server.

For example, while Form.Request aims to make updating an element with the reply to the submission straightforward, this class will let you handle it, and work only with status codes. It will also let you dynamically create the action URL from values in the form, letting you use clean [REST APIs](http://en.wikipedia.org/wiki/Representational_State_Transfer#RESTful_web_services).

Developer usage rationale
-------------------------

This class removes all the burden of catching submit events and replacing them with Requests. It also provides with all the CSS class-updating stuff you need to go directly to styling, and optionally offers default styling for quick prototyping.

The idea is to let you shift that API test form into a usable async one for free.

Features
--------

You will get:

* asynchronous submit (no page reload);
* submission blocking while first submit is done;
* destination URI (“action”) expansion with values from the form;
* CSS & submit values updates about the submission process.

As a bonus:

* default CSS for your form that stresses the submission process.

You will not get:

* form validation;
* server reply handling (an event will pass it to you, of course).

How to use
----------

**Dumb usage**

	WebServiceForm.applyTo('form'); //of course, the arg will be passed to $$, so pass it whatever $$ accepts
    
You can put this piece of code anywhere, it will take care of domready events itself.

**More precise usage**

	new WebServiceForm(myForm, [options]); //where myForm is an Element or ID
	
**Action expansion**

To use action expansion (replacing parts of the destination URL with values from the form), just write your action with the names of the inputs between brackets to get their values.

Example:

	<form id="messageForm" method="post" action="myAction/{userName}">
		<input type="text" name="userName" value="MyName" required/>
		<input type="text" name="message" value="My message" required/>
		<input type="submit" value="Send message"/>
	</form>
	
	/* Pressing submit will send a request to "myAction/MyName" with the parameters
	* {
	*	userName: "MyName",
	*	message: "My message"
	* }
	*/

Options
-------

* `resetOnSuccess`: time (in milliseconds) before the form should be reset after a successful update, or false if the form should not be reset. Defaults to 0 (immediate reset).
* `classes`: a hash containing the CSS classes to be applied to the form element. May contain:
	- `reset`:	when the form is to be submitted. Defaults to none.
	- `request`:	when the submission has been asked and a reply is being waited for. Defaults to "submitting".
	- `success`:	when a successful reply has been received from the server. Defaults to "success".
	- `failure`:	when an failure reply has been received from the server. Defaults to "failure".
	
	Set any of these to `false` to prevent the class from updating.
	
* `values`: a hash containing the values which the submit input should be updated with. Contains the same keys as the `classes` hash, with the following default values:
	- `reset`:	defaults to the original value of the submit input.
	- `request`:	defaults to "Sending…".
	- `success`:	defaults to "Thank you!".
	- `failure`:	defaults ot "Try again".
	
	Set any of these to `false` to prevent the value from updating.

Events
------

The following events may be fired by an instance of this class:

* `success`: see [`Request.onSuccess`](http://mootools.net/docs/core/Request/Request), same args and everything;
* `failure`: see [`Request.onSuccess`](http://mootools.net/docs/core/Request/Request), same args and everything;
* `submit`: right before the request is sent. Called with one parameter, the [`Request`](http://mootools.net/docs/core/Request/Request) instance that will be sent, so that you can control it and listen to fancier events (`loadstart`, `progress`…).

License
-------

[CC-BY](http://creativecommons.org/licenses/by/3.0/), i.e. "Do whatever you want as long as I am credited somewhere". Credit must be both given in the code and accessible to the end user. The end-user part may be in an "about" link or whatever, no need to make the reference prominent, but it has to be somehow accessible if someone's wondering.