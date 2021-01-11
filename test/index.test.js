import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

import App from './App.vue';
import VueCSSModifiers from '../src/index';
import { setProps, setData } from './helpers';

Vue.directive('mods', VueCSSModifiers);
Vue.directive('is',   VueCSSModifiers);
Vue.directive('bem',  VueCSSModifiers);

const wrapper = shallowMount(App);

it('adds modifiers properly', () => { // {{{

	// Single string
	expect(wrapper.find('#simple-mods--1').classes()).toEqual(expect.arrayContaining(['is-hidden']));

	// Array of strings
	expect(wrapper.find('#simple-mods--2').classes()).toEqual(expect.arrayContaining(['is-hidden']));
	expect(wrapper.find('#simple-mods--3').classes()).toEqual(expect.arrayContaining(['is-hidden']));

	// Object
	expect(wrapper.find('#simple-mods--4').classes()).toEqual(expect.arrayContaining(['is-hidden']));
	expect(wrapper.find('#simple-mods--5').classes()).toEqual(expect.arrayContaining(['is-hidden']));

}); // }}}

it('removes modifiers properly', async () => { // {{{

	await setData(wrapper, { isHidden: false });

	// Single string
	expect(wrapper.find('#simple-mods--1').classes()).toEqual(expect.not.arrayContaining(['is-hidden']));

	// Array of strings
	expect(wrapper.find('#simple-mods--2').classes()).toEqual(expect.not.arrayContaining(['is-hidden']));
	expect(wrapper.find('#simple-mods--3').classes()).toEqual(expect.not.arrayContaining(['is-hidden']));

	// Object
	expect(wrapper.find('#simple-mods--4').classes()).toEqual(expect.not.arrayContaining(['is-hidden']));
	expect(wrapper.find('#simple-mods--5').classes()).toEqual(expect.not.arrayContaining(['is-hidden']));

	await setData(wrapper, { isHidden: true });

}); // }}}

it("doesn't clash with static classes", () => { // {{{

	// Single string
	expect(wrapper.find('#no-clash--1').classes()).toEqual(expect.arrayContaining(['static-class', 'is-hidden']));

	// Array of strings
	expect(wrapper.find('#no-clash--2').classes()).toEqual(expect.arrayContaining(['static-class', 'is-hidden']));
	expect(wrapper.find('#no-clash--3').classes()).toEqual(expect.arrayContaining(['static-class', 'is-hidden']));

	// Object
	expect(wrapper.find('#no-clash--4').classes()).toEqual(expect.arrayContaining(['static-class', 'is-hidden']));
	expect(wrapper.find('#no-clash--5').classes()).toEqual(expect.arrayContaining(['static-class', 'is-hidden']));

}); // }}}

it("adds modifiers with a 'is-' suffix when the '.is' modifier is specified", () => { // {{{

	// Class names already starting with 'is-'
	expect(wrapper.find('#is-mode--1').classes()).toEqual(expect.arrayContaining(['is-hidden']));
	expect(wrapper.find('#is-mode--2').classes()).toEqual(expect.arrayContaining(['is-hidden']));

	// Class names not starting with 'is-'
	expect(wrapper.find('#is-mode--3').classes()).toEqual(expect.arrayContaining(['is-hidden']));
	expect(wrapper.find('#is-mode--4').classes()).toEqual(expect.arrayContaining(['is-hidden']));

}); // }}}

it("adds modifiers as suffixes of an implicit base class when the '.bem' modifier is specified", async () => { // {{{

	expect(wrapper.find('#bem-mode--implicit--1').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));
	expect(wrapper.find('#bem-mode--implicit--2').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));
	expect(wrapper.find('#bem-mode--implicit--3').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));

	// With a nonexistent base class
	expect(wrapper.find('#bem-mode--implicit--4').classes()).toEqual(expect.not.arrayContaining(['--hidden']));
	expect(wrapper.find('#bem-mode--implicit--4').classes()).toEqual(expect.not.arrayContaining(['base-class--hidden']));

	// With a base class toggled during execution
	expect(wrapper.find('#bem-mode--implicit--5').classes()).toEqual(expect.not.arrayContaining(['toggled-class--hidden']));

	await setData(wrapper, { toggledClass: true });

	expect(wrapper.find('#bem-mode--implicit--5').classes()).toEqual(expect.arrayContaining(['toggled-class--hidden']));

	// With a dynamic base class
	expect(wrapper.find('#bem-mode--implicit--6').classes()).toEqual(expect.arrayContaining(['navbar-right--hidden']));

	await setData(wrapper, { navbarPos: 'top' });

	expect(wrapper.find('#bem-mode--implicit--6').classes()).toEqual(expect.arrayContaining(['navbar-top--hidden']));

}); // }}}

it("adds modifiers as suffixes of an explicit base class when the '.bem' modifier is specified", async () => { // {{{

	expect(wrapper.find('#bem-mode--explicit--1').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));
	expect(wrapper.find('#bem-mode--explicit--2').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));
	expect(wrapper.find('#bem-mode--explicit--3').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));

	// With a nonexistent base class
	expect(wrapper.find('#bem-mode--explicit--4').classes()).toEqual(expect.not.arrayContaining(['--hidden']));
	expect(wrapper.find('#bem-mode--explicit--4').classes()).toEqual(expect.not.arrayContaining(['base-class--hidden']));

	// With a base class toggled during execution
	await setData(wrapper, { toggledClass: false });

	expect(wrapper.find('#bem-mode--explicit--5').classes()).toEqual(expect.not.arrayContaining(['toggled-class--hidden']));

	await setData(wrapper, { toggledClass: true });

	expect(wrapper.find('#bem-mode--explicit--5').classes()).toEqual(expect.arrayContaining(['toggled-class--hidden']));

	// With a dynamic base class
	await setData(wrapper, { navbarPos: 'right' });

	expect(wrapper.find('#bem-mode--explicit--6').classes()).toEqual(expect.arrayContaining(['navbar-right--hidden']));

	await setData(wrapper, { navbarPos: 'top' });

	expect(wrapper.find('#bem-mode--explicit--6').classes()).toEqual(expect.arrayContaining(['navbar-top--hidden']));

}); // }}}

it("enforces the correct mode when registered as 'v-is' or 'v-bem'", () => { // {{{

	expect(wrapper.find('#default-mode--1').classes()).toEqual(expect.arrayContaining(['is-hidden']));
	expect(wrapper.find('#default-mode--2').classes()).toEqual(expect.arrayContaining(['base-class--hidden']));

}); // }}}

it('works with props too', async () => { // {{{

	expect(wrapper.find('#props-mods--1').classes()).toEqual(expect.arrayContaining(['is-opened']));
	expect(wrapper.find('#props-mods--2').classes()).toEqual(expect.arrayContaining(['is-opened']));
	expect(wrapper.find('#props-mods--3').classes()).toEqual(expect.arrayContaining(['base-class--opened']));

	await setProps(wrapper, { isOpened: false, isMaximized: true });

	expect(wrapper.find('#props-mods--1').classes()).toEqual(expect.arrayContaining(['is-maximized']));
	expect(wrapper.find('#props-mods--2').classes()).toEqual(expect.arrayContaining(['is-maximized']));
	expect(wrapper.find('#props-mods--3').classes()).toEqual(expect.arrayContaining(['base-class--maximized']));

}); // }}}
