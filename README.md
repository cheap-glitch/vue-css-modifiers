# 🖌️ vue-css-modifiers

[![License](https://shields.io/github/license/cheap-glitch/vue-css-modifiers)](LICENSE)
[![Latest release](https://shields.io/github/v/release/cheap-glitch/vue-css-modifiers?sort=semver&label=latest%20release&color=green)](https://github.com/cheap-glitch/vue-css-modifiers/releases/latest)
[![Coverage status](https://shields.io/coveralls/github/cheap-glitch/vue-css-modifiers)](https://coveralls.io/github/cheap-glitch/vue-css-modifiers)

**vue-css-modifiers** provides  a tiny, zero-dependencies directive  to simplify
the manipulation of CSS modifier classes.

For example, the following template:

```html
<template>
	<div
		:class="{ 'is-hidden': isHidden, 'is-nav-sticky': isNavSticky }"
	>
	</div>
</template>
```

can be shortened to:

```html
<template>
	<div v-mods="{ isHidden, isNavSticky }"></div>
</template>
```

The modifier classes merge seamlessly with other static and dynamic classes. You
can also easily enforce the style of  your choosing (`is-` or BEM) with a simple
directive modifier.

Using a  different directive to declare  CSS modifiers also brings  the indirect
benefit of a clear separation between the main classes and their modifiers.

## Installation

```
npm i vue-css-modifiers
```

## Usage

Import and register the directive in the entry point of your app:

```javascript
// main.js

import Vue from 'vue';
import VueCSSModifiers from 'vue-css-modifiers';

Vue.directive('mods', VueCSSModifiers);
// […]
```

Call the directive using one of the following expressions:
 * a string denoting a class name
 * an array of strings denoting some class names
 * an object whose keys are properties and values booleans

Examples:

```html
<template>
	<!-- With the string expression, the class name will be
	     added/removed if the property with the corresponding
	     camel case name is true/false -->
	<div v-mods="'is-hidden'"></div>
	<!-- Output: <div class="is-hidden"></div> -->

	<!-- Same thing but with several classes -->
	<div v-mods="['is-hidden', 'is-flipped', 'is-height-fixed']"></div>
	<!-- Output: <div class="is-hidden is-height-fixed"></div> -->

	<!-- With an object expression, the names of the properties will be
	     converted to kebab case -->
	<div v-mods="{ isNavSticky, isSpinning: name === 'spinner' }"></div>
	<!-- Output: <div class="is-height-fixed is-spinning"></div> -->

	<!-- Works with both props and data -->
	<div v-mods="{ isOpened, isNavSticky }"></div>
	<!-- Output: <div class="is-opened is-height-fixed"></div> -->
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true,
			},
			isOpened: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				isHidden: true,
				isFlipped: false,
				isNavSticky: true,
			};
		},
	};
</script>
```

### Syntax modifiers

Use the `is` modifier to automatically prefix all modifier classes with `is-`:

```html
<div v-mods.is="{ hidden, isNavSticky }"></div>
<!-- Output: <div class="is-hidden, is-height-fixed"></div> -->
```

Use the `bem` modifier  to add the modifier class as a  suffix to another class.
This base class can either be  defined explicitly  through a directive argument,
or left implicit (in that case, the directive will use the first class it founds
that is not a BEM modifier). Either way, if the base class is not present on the
element, the modifier will not be added.

```html
<!-- Implicit base class -->
<div class="navbar" v-mods.bem="{ hidden }"></div>
<!-- Output: <div class="navbar navbar––hidden"></div> -->

<!-- Explicit base class -->
<div class="left sidebar" v-mods:sidebar.bem="{ hidden }"></div>
<!-- Output: <div class="left sidebar sidebar––hidden"></div> -->

<!-- Dynamic base class -->
<div :class="`menu-${menuPos}`" v-mods:menu-top.bem="{ hidden }"></div>
<!-- Output:
       <div class="menu-bottom"></div>               (menuPos === 'bottom')
       <div class="menu-top menu-top––hidden"></div> (menuPos === 'top')
-->

<!-- Dynamic base class with dynamic argument -->
<div :class="`navbar-${navbarPos}`" v-mods:[`navbar-${navbarPos}`].bem="{ hidden }">
</div>
<!-- Output: <div class="navbar-left navbar-left––hidden"></div> -->
```

### Using `is-` or BEM syntax by default

If you  register the  directive with  the name  `is` or  `bem`, it  will discard
modifiers and always enforce the respective syntax.

```javascript
// main.js

import Vue from 'vue';
import VueCSSModifiers from 'vue-css-modifiers';

Vue.directive('is',  VueCSSModifiers);
Vue.directive('bem', VueCSSModifiers);
// […]
```

```html
<div class="navbar" v-is="{ hidden }"></div>
<!-- Output: <div class="navbar is-hidden"></div> -->

<div class="navbar" v-bem="{ hidden }"></div>
<!-- Output: <div class="navbar navbar––hidden"></div> -->
```

## Changelog

See the full changelog [here](https://github.com/cheap-glitch/vue-css-modifiers/releases).

## Contributing

Contributions are welcomed! Please open an issue before submitting substantial changes.

## License

ISC
