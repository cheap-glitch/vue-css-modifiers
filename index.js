
/**
 * vue-css-modifiers/index.js
 * A tiny Vue directive to simplify the manipulation of CSS modifier classes
 *
 * Copyright 2019 cheap-glitch
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * Purpose with or without fee is hereby granted, provided that the above
 * Copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

// The directive will call the function on the 'bind' and 'update' hooks
module.exports = function(_el, _binding, _vnode)
{
	const name  = `"v-${_binding.name}"`;
	const value = _binding.value;

	if (value === undefined || value === null)
	{
		logError(`The value of ${name} is null or undefined`);
		return -1;
	}

	// If the value of the expression is a single string
	if (typeof value === 'string')
	{
		if (setClassByName(value, _el, _binding, _vnode) == -1)
			return -1;
	}
	// If the value of the expression is an array
	else if (Array.isArray(value))
	{
		// Check that all of its values are strings
		if (!value.every(__key => typeof __key === 'string'))
		{
			logError(`When the value of ${name} is an array, all of its values must be strings`);
			return -1;
		}

		for (let i=0; i<value.length; i++)
		{
			if (setClassByName(value[i], _el, _binding, _vnode) == -1)
				return -1;
		}
	}
	// If the value is an object
	else if (value === Object(value))
	{
		// Check that all of its values are booleans
		if (!Object.keys(value).every(__key => typeof value[__key] === 'boolean'))
		{
			logError(`When the value of ${name} is an object, all of its values must be booleans`);
			return -1;
		}

		// Add a class to the element for every key whose value is true
		Object.keys(value).forEach(function(__key)
		{
			// Ignore unchanged values
			if (_binding.oldValue && value[__key] === _binding.oldValue[__key])
				return;

			setElemClass(camel2Kebab(__key), value[__key], _el, _binding);
		});
	}
	else
	{
		logError(`The value of ${name} must either be a string, an array of strings or an object whose values are all booleans`);
		return -1;
	}

	return 0;
}

/**
 * Add/remove the class 'class-name' depending on the value of the property 'className'
 */
function setClassByName(_class, _el, _binding, _vnode)
{
	const prop  = kebab2Camel(_class);
	const value = _vnode.context._data[prop];

	// Check that the corresponding property is defined and is a boolean
	if (value === undefined || value === null)
	{
		logError(`Property "${prop}" is undefined or null`);
		return -1;
	}
	if (typeof value !== 'boolean')
	{
		logError(`Property "${prop}" must be a boolean`);
		return -1;
	}

	// Add/remove the class on the element depending on the value of the prop
	setElemClass(_class, value, _el, _binding);

	return 0;
}

/**
 * Add/remove a class on a DOM element
 */
function setElemClass(_class, _add, _el, _binding)
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
			className = className.match(/^is-/) ? className : `is-${className}`;
			break;

		// Make the modifiers suffixes of a base class name
		case 'bem':
			// If a base class is provided as an argument
			if ('arg' in _binding)
			{
				baseClass = _binding.arg;

				// If the base class is not set on the element, don't add the modifier
				if (!_el.classList.contains(baseClass)) return;
			}
			else
			{
				// Get all the class names that aren't modifiers themselves
				const classes = [..._el.classList].filter(__class => !__class.includes('--'));

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
 * Convert a kebab-cased string to camel case and conversely
 */
function kebab2Camel(_str) { return _str.replace(/-[a-z0-9]/g,     __match => __match.toUpperCase()[1]);    }
function camel2Kebab(_str) { return _str.replace(/(?:[A-Z]|\d+)/g, __match => `-${__match.toLowerCase()}`); }

/**
 * Output an error in the dev console
 */
function logError(_msg) { console.error(`[vue-css-modifiers]: ${_msg}`); }
