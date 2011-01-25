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

Straightforward usage:

	WebServiceForm.applyTo('form'); //of course, the arg will be passed to $$, so pass it whatever $$ accepts
    
You can put this piece of code anywhere, it will take care of domready events itself.

More precise usage:

	new WebServiceForm(myForm, [options]); //where myForm is an Element or ID

Options
-------

* classes

Events
------

- onComplete
- onFailure

License
-------

[CC-BY](http://creativecommons.org/licenses/by/3.0/), i.e. "Do whatever you want as long as I am credited somewhere". Credit must be both given in the code and accessible to the end user. The end-user part may be in an "about" link or whatever, no need to make the reference prominent, but it has to be somehow accessible if someone's wondering.