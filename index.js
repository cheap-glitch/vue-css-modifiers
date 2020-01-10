
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
module.exports = function(_el, _binding, _vnode, _oldVnode)
{
	const name  = `"v-${_binding.name}"`;
	const value = _binding.value;

	if (value === undefined || value === null)
	{
		logError(`the value of ${name} is null or undefined`);
		return -1;
	}
	if (!validator(value))
	{
		logError(ajv.errorsText().replace(/^data/, 'value'));
		return -1;
	}

	/**
	 * String value
	 * ---------------------------------------------------------------------
	 */
	if (typeof value == 'string')
		return setClassByName(value, _el, _binding, _vnode);

	/**
	 * Array value
	 * ---------------------------------------------------------------------
	 */
	if (Array.isArray(value))
	{
		for (let i=0; i<value.length; i++)
		{
			if (setClassByName(value[i], _el, _binding, _vnode) == -1)
				return -1;
		}

		return 0;
	}

	/**
	 * Object value
	 * ---------------------------------------------------------------------
	 */
	const isBEM       = ('bem' in _binding.modifiers === true || _binding.name == 'bem');
	const sameClasses = checkIfSameClasses(_vnode, _oldVnode);

	// Add a class to the element for every key whose value is true
	Object.keys(value).forEach(function(__key)
	{
		// Ignore unchanged values
		if (_binding.oldValue && value[__key] === _binding.oldValue[__key] && (!isBEM || sameClasses))
			return;

		setElemClass(camel2Kebab(__key), value[__key], _el, _binding, _vnode);
	});

	return 0;
}

/**
 * Add/remove the class 'class-name' depending on the value of the property 'className'
 */
function setClassByName(_class, _el, _binding, _vnode)
{
	const prop  = kebab2Camel(_class);
	const value = _vnode.context._data[prop];

	// Check that the corresponding property is defined
	if (value === undefined || value === null)
	{
		logError(`property "${prop}" is undefined or null`);
		return -1;
	}

	// Add/remove the class on the element depending on the value of the prop
	setElemClass(_class, value, _el, _binding, _vnode);

	return 0;
}

/**
 * Add/remove a class on a DOM element
 */
function setElemClass(_class, _add, _el, _binding, _vnode)
{
	let className = _class;
	let baseClass = '';

	// Get the mode from the directive modifiers
	let mode = 'default';
	if ('is'  in _binding.modifiers) mode = 'force-is-prefix';
	if ('bem' in _binding.modifiers) mode = 'bem';

	// Enforce a mode if the name of the directive is that of the corresponding directive modifier
	if (_binding.name == 'is')  mode = 'force-is-prefix';
	if (_binding.name == 'bem') mode = 'bem';

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
			if ('arg' in _binding)
			{
				baseClass = _binding.arg;

				// Don't add the modifier if the base class is absent from the element
				if (!_vnode.elm._prevClass || !_vnode.elm._prevClass.split(' ').includes(baseClass)) return;
			}
			else
			{
				// Get all the class names that aren't modifiers themselves
				const classes = _vnode.elm._prevClass
					? _vnode.elm._prevClass.split(' ').filter(__class => !__class.includes('--'))
					: [];

				// If there is no base class, don't add the modifier
				if (classes.length == 0) return;

				// Else, take the first class of the list
				baseClass = classes[0];
			}

			// Duplicate the name of the base class and add the modifier as its suffix
			className = `${baseClass}--${className.replace(/^is-/, '')}`
			break;
	}

	if (_add) _el.classList.add(className); else _el.classList.remove(className);
}

/**
 * Return 'true' if the classes are the same between the two VNodes, 'false' otherwise
 */
function checkIfSameClasses(_vnode, _oldVnode)
{
	if (!_oldVnode || !_vnode.data.class || !_oldVnode.data.class)
		return false;

	const classes    = _vnode.data.class;
	const oldClasses = _oldVnode.data.class;

	if (typeof classes != typeof oldClasses)
		return false;

	if (typeof classes == 'string')
		return classes === oldClasses;

	if (Array.isArray(classes))
		return (classes.length == oldClasses.length) && classes.every(_class => oldClasses.includes(_class));

	if (classes === Object(classes))
	{
		const keys    = Object.keys(classes);
		const oldKeys = Object.keys(oldClasses);

		return (keys.length == oldKeys.length) && keys.every(_key => oldKeys.includes(_key) && classes[_key] === oldClasses[_key])
	}

	return false;
}

/**
 * Convert a kebab-cased string to camel case and conversely
 */
function kebab2Camel(_str) { return _str.replace(/-[a-z0-9]/g,     __match => __match.toUpperCase()[1]);    }
function camel2Kebab(_str) { return _str.replace(/(?:[A-Z]|\d+)/g, __match => `-${__match.toLowerCase()}`); }

/**
 * Output an error in the dev console
 */
function logError(_msg) { console.error(`[vue-css-modifiers]: ${_msg}`); }
