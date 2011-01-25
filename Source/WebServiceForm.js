/**!
*WebServiceForm MooTools Class
*
*@author	Matti Schneider-Ghibaudo
*/
/*
*@version	0.2
*
*@dependencies
*	MooTools 1.3
*
*@license
* (CC-BY)[http://creativecommons.org/licenses/by/3.0/], i.e. "Do whatever you want as long as I am credited somewhere". Credit must be both given in the code and accessible to the end user.
*/


var WebServiceForm = new Class({
	Implements: [Events, Options],
	
	options: {
		/**Time before the form should go back to normal after a successful update, or false if the form should not be reset.
		*/
		resetOnSuccess:	0,
		classes: {
			reset:		'',
			request:	'submitting',
			success:	'success',
			failure:	'failure'
		},
		values: {
			reset:		'Send',
			request:	'Sending…',
			success:	'Thank you!',
			failure:	'Try again'
		},
		/**Second arg to the substitute(inputNamesToValues) call upon the "action" attribute of the form.
		*Defaults to the default value of substitute (at time of writing, means that you should write the names of the inputs you want to be expanded to their values between {brackets}).
		*
		*@see	String.substitute
		*/
		actionRegExp:	0 //0 so that it is ignored (shorter than "undefined")
	},
	
/*
	form: Element,
	submit: Element,
	request: Reqest,
*/
	
	initialize: function init(form, opts) {
		this.setOptions(opts);
		this.form = $(form);
		this.submit = this.form.getChildren('input[type=submit]:last-child')[0]; //consider that the submit element to block is the last one in the form
		
		this.request = new Request({
			url: this.form.get('action'),
			method: this.form.get('method') || 'post',
			noCache: true
		}).addEvents({
			success: function(replyText) {
				this.show('success');
				if (this.options.resetOnSuccess !== false)
					this.reset.delay(this.options.resetOnSuccess, this);
			}.bind(this),
			failure: function() {
				this.show('failure');
				this.enable();
			}.bind(this)
		});
		
		this.form.addEvent('submit', function(e) {
			//forbid rage-submit
			if (this.isDisabled())
				return false;
				
			this.disable();
			this.makeRequest();
			this.request.send({
				data: this.form
			});
			return false; //forbid default redirection
		}.bind(this));
	},
	
	makeRequest: function makeRequest() {
		this.request.setOptions({
			url: this.form.get('action').substitute(this.form.asObject(), this.options.actionRegExp)
		});
	},
	
	reset: function reset() {
		this.enable();
		this.form.reset();
		this.form.getElements('input')[0].focus();
		return this.show('reset');
	},
	
	/**
	*@param				status	must be one of the keys in options.values and options.classes
	*@param (optional)	params	the optional params to pass to 
	*/
	show: function show(status, params) {
		this.form.set('class', this.options.classes[status]);
		this.submit.set('value', this.options.values[status]);
		return this;
	},
	
	isDisabled: function isDisabled() {
		return (this.submit.retrieve('data-disabled') == 'disabled') //no use of actual disabled because disabled inputs can't be styled, and become unreadable
	},
	
	disable: function disable() {
		this.submit.store('data-disabled', 'disabled'); //no use of actual disabled because disabled inputs can't be styled, and become unreadable
		return this;
	},
	
	enable: function enable() {
		this.submit.store('data-disabled', '');
		return this;
	}
});

WebServiceForm.apply = function WebServiceFormStartup(elements, options) {
	window.addEvent('domready', function() {
		$$(elements).each(function(el) {
			new WebServiceForm(el, options);
		});
	});
}

/*
*Adapted from Dimitar Christoff at http://stackoverflow.com/questions/2166042/how-to-convert-form-data-to-object-using-mootools
*/
Element.implement({
	asObject: function asObject() {
		var result = {};
		var toIgnore = ['submit', 'reset', 'file'];
		this.getElements('input, select, textarea', true).each(function(input) {
			var type = input.get('type');
			var name = input.get('name');
			if (! name || toIgnore.contains(type) || input.get('disabled'))
				return;
				
			var value;
			if (input.get('tag') == 'select') {
				value = input.getSelected().map(function(selected) {
					return selected.get('value');
				})
			} else if (type == 'radio' || type == 'checkbox') {
				value = !! input.get('checked');
			} else {
				value = input.get('value');
			}

			result[name] = value;
		});
		return result;
	}
});