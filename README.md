WebServiceForm
==============

Basically, a (MooTools)[http://mootools.net] automatic asynchronous (“AJAX”) form creator. Transforms a plain form to an asynchronous one.

Differs from Form.Request in several important ways, which can be summed up in the fact that this WebServiceForm aims to provide a form-enhancer specifically targeted at —guess what— webservices, and not basic pages.

For example, while Form.Request aims to make updating an element with the reply to the submission straightforward, this class will let you do whatever you want with it, and work with status codes instead. It will also let you dynamically create the action URL from values in the form, letting you use precise REST APIs.

Developer rationale
-------------------

This class removes all the burden of catching submit events and replacing them with Requests. It also provides with all the class-updating stuff you need to go directly to styling. It helps you to develop frontends to APIs rather than simply getting updates from a server.

Features
--------

You will get:

* asynchronous submit (no page reload);
* submission blocking while first submit is done;
* destination URI (“action”) expansion with values from the form;
* CSS updates about the submission process.

As a bonus:

* default CSS for your form that stresses the submission process.

You will not get:

* form validation;
* server reply handling (an event will pass it to you, of course).

How to use
----------

Straightforward usage:

	MSGForm.enhance('form'); //of course, the arg will be passed to $$, so pass it whatever $$ accepts
    
You can put this piece of code anywhere, it will take care of domready events itself.

More precise usage:

	new MSGForm(myForm, [options]); //where myForm is an Element or ID

Options
-------

* classes

Events
------

- onComplete
- onFailure

License
-------

