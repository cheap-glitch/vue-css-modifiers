# vue-css-modifiers

**vue-css-modifiers** provides a directive to simplify the manipulation of CSS
modifier classes.

The following code:
```vue
<template>
	<div :class="{ 'is-hidden': isHidden, 'is-flipped': isFlipped, 'is-height-fixed': isHeightFixed }">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isHidden:      true,
				isFlipped:     false,
				isHeightFixed: true,
			}
		},
	}
</script>
```

becomes:
```vue
<template>
	<div v-mod="{ isHidden, isFlipped, isHeightFixed }"></div>
</template>

<script>
	export default {
		data() {
			return {
				isHidden:      true,
				isFlipped:     false,
				isHeightFixed: true,
			}
		},
	}
</script>
```

The modifier classes merge seamlessly with other static and dynamic classes.
You can also easily enforce the style of your choosing ('is-' or BEM) with
a simple modifier.

## Installation

```
npm install vue-css-modifiers
```

## Usage

Import and register the directive in the entry point of your app:
```javascript
// main.js

import Vue             from 'vue';
import VueCSSModifiers from 'vue-css-modifiers';

Vue.directive('mod', VueCSSModifiers);
// […]
```

Call the directive using one of the following expressions:
 * a string denoting a class name
 * an array of strings denoting some class names
 * an object whose keys are properties and values booleans

Examples:
```vue

<template>
	<!-- With the string expression, the class name will be added/removed
	     if the property with the corresponding camel case name is true/false -->
	<div v-mod="'is-hidden'"></div>
	<!-- Output: <div clas="is-hidden"></div> -->

	<!-- Same thing but with several classes -->
	<div v-mod="['is-hidden', 'is-flipped', 'is-height-fixed']></div>
	<!-- Output: <div class="is-hidden is-height-fixed"></div> -->

	<!-- With an object expression, the names of the properties will be converted to kebab case -->
	<div v-mod="{ isHidden, isFlipped, isHeightFixed }"></div>
	<!-- Output: <div class="is-hidden is-height-fixed"></div> -->
</template>

<script>
	export default {
		data() {
			return {
				isHidden:	true,
				isFlipped:	false,
				isHeightFixed:	true,
			}
		},
	}
</script>
```

### Syntax modifiers

Use the `is` modifier to automatically prefix all modifier classes with `is-`:
```vue
<div v-mod.is="{ hidden, isHeightFixed }"></div>
<!-- Output: <div class="is-hidden, is-height-fixed"></div> -->
```

Use the `bem` modifier to add the modifier class as a suffix to another class.
This base class can either be defined explicitely through a directive argument,
or left implicit (in that case, the directive will use the first class it
founds that is not a BEM modifier). Either way, if the base class is not
present on the element, the modifier will not be added.
```vue
<!-- Implicit base class -->
<div class="navbar" v-mod.bem="{ hidden }"></div>
<!-- Output: <div class="navbar navbarhidden"></div> -->

<!-- Explicit base class -->
<div class="left sidebar" v-mod:sidebar.bem="{ hidden }"></div>
<!-- Output: <div class="left sidebar sidebar--hidden"></div> -->
```

### Using 'is-' or BEM syntax by default

If you register the directive with the name `is` or `bem`, it will discard
modifiers and always enforce the respective syntax.

```javascript
// main.js

import Vue             from 'vue';
import VueCSSModifiers from 'vue-css-modifiers';

Vue.directive('is',  VueCSSModifiers);
Vue.directive('bem', VueCSSModifiers);
// […]
```

```vue
<div class="navbar" v-is="{ hidden }"></div>
<!-- Output: <div class="navbar is-hidden"></div> -->

<div class="navbar" v-bem="{ hidden }"></div>
// Output: <div class="navbar navbar--hidden"></div>
```

## License
This project is licensed under the ISC license.
