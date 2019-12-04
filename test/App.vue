

<!-- App.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.App
	//----------------------------------------------------------------------
	//- Test that errors are properly thrown
	//----------------------------------------------------------------------

		//- Expression value is undefined
		div(v-mods="undefProp")
		//- Expression value is null
		div(v-mods="null")

		//- Mixed array
		div(v-mods="['is-hidden', false, 3]")
		//- Mixed object
		div(v-mods="{ isHidden, isFlipped: 'no' }")

		//- Other unsupported expressions
		div(v-mods="2")
		div(v-mods="true")

		//- Class names with no corresponding data properties
		div(v-mods="'is-fixed'")
		div(v-mods="['is-hidden', 'is-fixed']")

	//----------------------------------------------------------------------
	//- Test that modifiers are properly added/removed
	//----------------------------------------------------------------------

	//- Single string
	div#simple-mods--1(v-mods="'is-hidden'")
	//- Array of strings
	div#simple-mods--2(v-mods="['is-hidden']")
	div#simple-mods--3(v-mods="['is-hidden', 'is-flipped']")
	//- Object
	div#simple-mods--4(v-mods="{ isHidden }")
	div#simple-mods--5(v-mods="{ isHidden, isFlipped }")

	//----------------------------------------------------------------------
	//- Test that modifiers don't clash with static classes
	//----------------------------------------------------------------------

	//- Single string
	div#no-clash--1.static-class(v-mods="'is-hidden'")
	//- Array of strings
	div#no-clash--2.static-class(v-mods="['is-hidden']")
	div#no-clash--3.static-class(v-mods="['is-hidden', 'is-flipped']")
	//- Object
	div#no-clash--4.static-class(v-mods="{ isHidden }")
	div#no-clash--5.static-class(v-mods="{ isHidden, isFlipped }")

	//----------------------------------------------------------------------
	//- Test 'is-' prefix mode
	//----------------------------------------------------------------------

	//- Class names already starting with 'is-'
	div#is-mode--1(v-mods.is="'is-hidden'")
	div#is-mode--2(v-mods.is="{ isHidden }")

	//- Class names not starting with 'is-'
	div#is-mode--3(v-mods.is="['hidden', 'flipped']")
	div#is-mode--4(v-mods.is="{ hidden, flipped }")

	//----------------------------------------------------------------------
	//- Test BEM mode
	//----------------------------------------------------------------------

	//- With an explicit base class
	div#bem-mode--1(v-mods:base-class.bem="{ hidden, flipped }")

	//- With an nonexistant implicit base class
	div#bem-mode--2(v-mods.bem="{ hidden, flipped }")

	//- With an implicit base class
	div#bem-mode--3(v-mods.bem="{ hidden, flipped }" :class="['base-class']")
	div#bem-mode--4.base-class(v-mods.bem="{ hidden, flipped }")
	div#bem-mode--5.base-class(v-mods.bem="{ hidden, flipped }" :class="{ 'dynamic-base-class': true }")

	//- With a base class modified during execution
	div#bem-mode--6(:class="`navbar-${navbarPos}`" v-mods:navbar-left.bem="{ hidden }")

	//- With an implicit base class modified during execution
	div#bem-mode--7(:class="`navbar-${navbarPos}`" v-mods.bem="{ hidden }")

	//- With a computed class name
	div#bem-mode--8(:class="`navbar-${navbarPos}`" v-mods:[`navbar-${navbarPos}`].bem="{ hidden }")

	//----------------------------------------------------------------------
	//- Test that directive names enforce the correct mode
	//----------------------------------------------------------------------

	div#default-mode--1(v-is="{ hidden }")
	div#default-mode--2.base-class(v-bem="{ hidden }")

	//----------------------------------------------------------------------
	//- Test prop-based modifiers
	//----------------------------------------------------------------------

	div#props-mods--1(v-mods="{ isOpened, isMaximized }")
	div#props-mods--2(v-mods.is="{ isOpened, isMaximized }")
	div#props-mods--3.base-class(v-mods.bem="{ isOpened, isMaximized }")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'App',

	props: {
		isOpened: {
			type: Boolean,
			default: true,
		},
		isMaximized: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			hidden:     true,
			flipped:    false,

			isHidden:   true,
			isFlipped:  false,

			navbarPos:  'right',
		}
	},
}

</script>
<!--}}}-->
