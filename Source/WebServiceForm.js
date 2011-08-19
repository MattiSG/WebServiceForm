/**!
*WebServiceForm MooTools Class
*
*@author	Matti Schneider-Ghibaudo
*/
/*
*@version	0.4
*
*@dependencies
*	MooTools 1.2
*
*@license
* (CC-BY)[http://creativecommons.org/licenses/by/3.0/], i.e. "Do whatever you want as long as I am credited somewhere". Credit must be both given in the code and accessible to the end user.
*/


var WebServiceForm = new Class({
	Implements: [Events, Options],
	
	options: {
		/**Time (in milliseconds) before the form should go back to normal after a successful update, or false if the form should not be reset.
		*/
		resetOnSuccess:	0,
		/**Whether the inputs should be disabled while submissions of the form are forbidden.
		*Can be either false (default), true or "readonly", in which case the inputs won't be disabled but set to readonly (not compatible with all browsers).
		*/
		disableInputs: false,
		classes: {
			reset:		'',
			submit:		'submitting',
			success:	'success',
			failure:	'failure'
		},
		values: {
			reset:		false,
			submit:		'Sending…',
			success:	'Thank you!',
			failure:	'Try again'
		},
		/**Second arg to all substitution calls (action attribute of the form, submit values…).
		*Defaults to the default value of substitute (at time of writing, means that you should write the names of the inputs you want to be expanded to their values between {brackets}).
		*
		*@see	String.substitute
		*/
		substituteRegExp:	0 //0 so that it is ignored (shorter than "undefined")
	},
	
/*
	form: Element, //private
	submit: Element, //private
	request: Request, //private
*/
	
	/**
	*@param	el	Element	either a form (simple init, API-compatible) or a submit button (for advanced forms with several submit inputs)
	*/
	initialize: function init(el, opts) {
		this.setOptions(opts);
		
		el = $(el);
		if (el.get('tag') == 'form') {
			this.form = el;
			this.submit = el.getElement('input[type=submit]');
		} else {
			this.submit = el;
			this.form = el.getParents('form')[0];
		}
		
		if (! this.options.values.reset)
			this.options.values.reset = this.submit.get('value');
		
		this.request = new Request({
			url: this.form.get('action'),
			method: this.form.get('method') || 'post',
			noCache: true
		}).addEvents({
			success: function(text, xml) {
				this.show('success', [text, xml]);
				if (this.options.resetOnSuccess !== false)
					this.reset.delay(this.options.resetOnSuccess, this);
			}.bind(this),
			failure: function(xhr) {
				this.enable();
				this.show('failure', xhr);
			}.bind(this)
		});
		
		this.form.addEvent('submit', this.submitHandler.bind(this));
	},
	
	getForm: function getForm() {
		return this.form;
	},
	
	getSubmit: function getSubmit() {
		return this.submit;
	},
	
	/**Called when the form is submitted.
	*@private
	*/
	submitHandler: function submitHandler() {
		//forbid rage-submit
		if (this.isDisabled())
			return false;
			
		this.disable();
		this.makeRequest();
		
		this.show('submit', this.request);
		
		this.request.send({
			data: this.form
		});
		return false; //forbid default redirection
	},

	/**Creates the request, with action expansion.
	*@private
	*/
	makeRequest: function makeRequest() {
		this.request.setOptions({
			url: this.form.get('action').substitute(this.form.asObject(), this.options.actionRegExp)
		});
	},
	
	/**Resets the form, enables it and focuses it.
	*/
	reset: function reset() {
		this.enable();
		this.form.reset();
		this.form.getElements('input')[0].focus();
		return this.show('reset');
	},
	
	/**Sets the form to the given status, updating its CSS class and submit value, and firing the corresponding event.
	*@private
	*
	*@param				status	must be one of the keys in options.values and options.classes
	*@param (optional)	params	the optional params to pass to the fired event
	*/
	show: function show(status, params) {
		if (this.options.classes[status] === undefined) //checking that the status is a valid one
			throw 'Unknown status "' + status + '"';
		
		if (this.options.classes[status] !== false)
			this.form.set('class', this.options.classes[status]);
		
		if (this.options.values[status] !== false)
			this.submit.set('value', this.options.values[status].substitute(this.form.asObject(), this.options.actionRegExp));
		
		$splat(params).push(this);
		this.fireEvent(status, params); //1.2 compat: Array.from -> $splat
		
		return this;
	},
	
	/**Tells whether the form is currently disabled for submission (i.e. request has been sent and we're waiting for a reply) or not.
	*/
	isDisabled: function isDisabled() {
		return (this.submit.retrieve('data-disabled') == 'disabled') //no use of actual disabled because disabled inputs can't be styled, and become unreadable
	},
	
	/**Forbids submission of the form, without updating the UI.
	*/
	disable: function disable() {
		this.setEnabled(false);
		return this;
	},
	
	/**Enables submission of the form, without updating the UI.
	*/
	enable: function enable() {
		this.setEnabled(true);
		return this;
	},
	
	/**
	*@private
	*/
	setEnabled: function setEnabled(enable) {
		this.submit.store('data-disabled', (enable ? '' : 'disabled')); //no use of actual disabled because disabled inputs can't be styled, and become unreadable
		var disableInputs = this.options.disableInputs;
		if (disableInputs) {
			var attribute = (disableInputs === 'readonly' ? 'readonly' : 'disabled');
			this.form.getElements('input, select, textarea').each(function(input) {
				input.set(attribute, (enable ? '' : attribute));
			});
		}	
	}
});


/**Static global apply shortcut.
*/
WebServiceForm.applyToAll = function WebServiceFormStartup(elements, options) {
	window.addEvent('domready', function() {
		$$(elements || 'form').each(function(el) {
			new WebServiceForm(el, options);
		});
	});
}

/**Returns a hash from this Element, with its keys being the names of descendant inputs and their corresponding values.
*
*Adapted from Dimitar Christoff at http://stackoverflow.com/questions/2166042/how-to-convert-form-data-to-object-using-mootools
*/
Element.implement({
	asObject: function asObject() {
		var result = {};
		var toIgnore = ['submit', 'reset', 'file'];
		this.getElements('input, select, textarea').each(function(input) {
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
