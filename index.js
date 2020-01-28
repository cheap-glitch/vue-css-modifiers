
/**
 * vue-css-modifiers
 *
 * A tiny Vue directive to simplify the manipulation of CSS modifier classes.
 *
 * Copyright (c) 2019-present, cheap glitch
 *
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const AJV = require('ajv');

// Create the validator for values passed to the directive
const ajv       = new AJV();
const validator = ajv.compile({
	type: ['string', 'array', 'object'],

	// If the value is an array, all of its values must be strings
	items: { type: 'string' },

	// If the value is an object, all of its values must be booleans
	patternProperties: { '.': { type: 'boolean' } }
});

// The directive will call the function on the 'bind' and 'update' hooks
module.exports = function(el, binding, vnode, oldVnode)
{
	const name  = `"v-${binding.name}"`;
	const value = binding.value;

	if (value === undefined || value === null)
	{
		logError(`the value of ${name} is null or undefined`);
		return -1;
	}
	if (!validator(value))
	{
		logError(ajv.errorsText(validator.errors).replace(/^data/, 'value'));
		return -1;
	}

	/**
	 * String value
	 * ---------------------------------------------------------------------
	 */
	if (typeof value == 'string')
		return setClassByName(value, el, binding, vnode);

	/**
	 * Array value
	 * ---------------------------------------------------------------------
	 */
	if (Array.isArray(value))
	{
		for (const val of value)
			if (setClassByName(val, el, binding, vnode) == -1)
				return -1;

		return 0;
	}

	/**
	 * Object value
	 * ---------------------------------------------------------------------
	 */
	const isBEM       = ('bem' in binding.modifiers || binding.name == 'bem');
	const sameClasses = checkIfSameClasses(vnode, oldVnode);

	// Add a class to the element for every key whose value is true
	Object.keys(value).forEach(function(key)
	{
		// Ignore unchanged values
		if (binding.oldValue && value[key] === binding.oldValue[key] && (!isBEM || sameClasses))
			return;

		setElemClass(camel2Kebab(key), value[key], el, binding, vnode);
	});

	return 0;
}

/**
 * Add/remove the class 'class-name' depending on the value of the property 'className'
 */
function setClassByName(className, el, binding, vnode)
{
	const prop  = kebab2Camel(className);
	const value = vnode.context._data[prop];

	// Check that the corresponding property is defined
	if (value === undefined || value === null)
	{
		logError(`property "${prop}" is undefined or null`);
		return -1;
	}

	// Add/remove the class on the element depending on the value of the prop
	setElemClass(className, value, el, binding, vnode);

	return 0;
}

/**
 * Add/remove a class on a DOM element
 */
function setElemClass(className, add, el, binding, vnode)
{
	let baseClass = '';

	// Get the mode from the directive modifiers
	let mode = 'default';
	if ('is'  in binding.modifiers) mode = 'force-is-prefix';
	if ('bem' in binding.modifiers) mode = 'bem';

	// Enforce a mode if the name of the directive is that of the corresponding directive modifier
	if (binding.name == 'is')  mode = 'force-is-prefix';
	if (binding.name == 'bem') mode = 'bem';

	switch (mode)
	{
		// Add 'is-' at the beginning of every modifier
		// class name (unless the name already starts with '-is')
		case 'force-is-prefix':
			className = /^is-/.test(className) ? className : `is-${className}`;
			break;

		// Make the modifiers suffixes of a base class name
		case 'bem':
			// If a base class is provided as an argument
			if ('arg' in binding)
			{
				baseClass = binding.arg;

				// Don't add the modifier if the base class is absent from the element
				if (!vnode.elm._prevClass || !vnode.elm._prevClass.split(' ').includes(baseClass)) return;
			}
			else
			{
				// Get all the class names that aren't modifiers themselves
				const classes = vnode.elm._prevClass
					? vnode.elm._prevClass.split(' ').filter(prevClassName => !prevClassName.includes('--'))
					: [];

				// If there is no base class, don't add the modifier
				if (!classes.length) return;

				// Else, take the first class of the list
				baseClass = classes[0];
			}

			// Duplicate the name of the base class and add the modifier as its suffix
			className = `${baseClass}--${className.replace(/^is-/, '')}`
			break;
	}

	if (add) el.classList.add(className); else el.classList.remove(className);
}

/**
 * Return 'true' if the classes are the same between the two VNodes, 'false' otherwise
 */
function checkIfSameClasses(vnode, oldVnode)
{
	if (!oldVnode || !vnode.data.class || !oldVnode.data.class)
		return false;

	const classes    = vnode.data.class;
	const oldClasses = oldVnode.data.class;

	if (typeof classes != typeof oldClasses)
		return false;

	if (typeof classes == 'string')
		return classes === oldClasses;

	if (Array.isArray(classes))
		return (classes.length == oldClasses.length) && classes.every(className => oldClasses.includes(className));

	if (classes === Object(classes))
	{
		const keys    = Object.keys(classes);
		const oldKeys = Object.keys(oldClasses);

		return (keys.length == oldKeys.length) && keys.every(key => oldKeys.includes(key) && classes[key] === oldClasses[key])
	}

	return false;
}

/**
 * Convert a kebab-cased string to camel case and conversely
 */
function kebab2Camel(str) { return str.replace(/-[a-z0-9]/g,     match => match.toUpperCase()[1]);    }
function camel2Kebab(str) { return str.replace(/(?:[A-Z]|\d+)/g, match => `-${match.toLowerCase()}`); }

/**
 * Output an error in the dev console
 */
function logError(msg) { console.error(`[vue-css-modifiers]: ${msg}`); }
