MSGForm
==========

An automatic asynchronous (“AJAX”) form creator. Transforms a plain form to an asynchronous one, with multiple small benefits.

Developer rationale
-------------------

This class removes all the burden of catching submit events and replacing them with Requests. It also provides with all the class-updating stuff you need to go directly to styling.

Features
--------

You will get:

* asynchronous submit (no page reload);
* submission blocking while first submit is done;
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

