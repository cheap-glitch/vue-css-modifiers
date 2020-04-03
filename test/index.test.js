
/**
 * tests/index.test.js
 */

import Vue              from 'vue'
import { expect }       from 'chai'
import { shallowMount } from '@vue/test-utils'

import App              from './App.vue'
import VCSSModifiers    from '../index'

/**
 * Setup
 * -----------------------------------------------------------------------------
 */
Vue.directive('mods', VCSSModifiers);
Vue.directive('is',   VCSSModifiers);
Vue.directive('bem',  VCSSModifiers);

const factory  = (data = {}) => shallowMount(App, { data () { return { ...data } } });

const setData  = async (wrapper, data)  => { wrapper.setData(data);   await Vue.nextTick(); };
const setProps = async (wrapper, props) => { wrapper.setProps(props); await Vue.nextTick(); };

/**
 * Tests
 * -----------------------------------------------------------------------------
 */
describe('vue-css-modifiers', () => {
	const wrapper = factory();

	it("adds modifiers properly", () => {
		// Single string
		expect(wrapper.find('#simple-mods--1').classes()).to.contain('is-hidden');

		// Array of strings
		expect(wrapper.find('#simple-mods--2').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--3').classes()).to.contain('is-hidden');

		// Object
		expect(wrapper.find('#simple-mods--4').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--5').classes()).to.contain('is-hidden');
	});

	it("removes modifiers properly", async () => {
		await setData(wrapper, { isHidden: false });

		// Single string
		expect(wrapper.find('#simple-mods--1').classes()).not.to.contain('is-hidden');

		// Array of strings
		expect(wrapper.find('#simple-mods--2').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--3').classes()).not.to.contain('is-hidden');

		// Object
		expect(wrapper.find('#simple-mods--4').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--5').classes()).not.to.contain('is-hidden');

		await setData(wrapper, { isHidden: true });
	});

	it("doesn't clash with static classes", () => {
		// Single string
		expect(wrapper.find('#no-clash--1').classes()).to.contain.all.members(['static-class', 'is-hidden']);

		// Array of strings
		expect(wrapper.find('#no-clash--2').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--3').classes()).to.contain.all.members(['static-class', 'is-hidden']);

		// Object
		expect(wrapper.find('#no-clash--4').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--5').classes()).to.contain.all.members(['static-class', 'is-hidden']);

	});

	it("adds modifiers with a 'is-' suffix when the '.is' modifier is specified", () => {
		// Class names already starting with 'is-'
		expect(wrapper.find('#is-mode--1').classes()).to.contain('is-hidden');
		expect(wrapper.find('#is-mode--2').classes()).to.contain('is-hidden');

		// Class names not starting with 'is-'
		expect(wrapper.find('#is-mode--3').classes()).to.contain('is-hidden');
		expect(wrapper.find('#is-mode--4').classes()).to.contain('is-hidden');
	});

	it("adds modifiers as suffixes of an implicit base class when the '.bem' modifier is specified", async () => {
		expect(wrapper.find('#bem-mode--implicit--1').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--implicit--2').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--implicit--3').classes()).to.contain('base-class--hidden');

		// With a nonexistent base class
		expect(wrapper.find('#bem-mode--implicit--4').classes()).not.to.contain('--hidden');
		expect(wrapper.find('#bem-mode--implicit--4').classes()).not.to.contain('base-class--hidden');

		// With a base class toggled during execution
		expect(wrapper.find('#bem-mode--implicit--5').classes()).not.to.contain('toggled-class--hidden');
		await setData(wrapper, { toggledClass: true });
		expect(wrapper.find('#bem-mode--implicit--5').classes()).to.contain('toggled-class--hidden');

		// With a dynamic base class
		expect(wrapper.find('#bem-mode--implicit--6').classes()).to.contain('navbar-right--hidden');
		await setData(wrapper, { navbarPos: 'top' });
		expect(wrapper.find('#bem-mode--implicit--6').classes()).to.contain('navbar-top--hidden');
	});

	it("adds modifiers as suffixes of an explicit base class when the '.bem' modifier is specified", async () => {
		expect(wrapper.find('#bem-mode--explicit--1').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--explicit--2').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--explicit--3').classes()).to.contain('base-class--hidden');

		// With a nonexistent base class
		expect(wrapper.find('#bem-mode--explicit--4').classes()).not.to.contain('--hidden');
		expect(wrapper.find('#bem-mode--explicit--4').classes()).not.to.contain('base-class--hidden');

		// With a base class toggled during execution
		await setData(wrapper, { toggledClass: false });
		expect(wrapper.find('#bem-mode--explicit--5').classes()).not.to.contain('toggled-class--hidden');
		await setData(wrapper, { toggledClass: true });
		expect(wrapper.find('#bem-mode--explicit--5').classes()).to.contain('toggled-class--hidden');

		// With a dynamic base class
		await setData(wrapper, { navbarPos: 'right' });
		expect(wrapper.find('#bem-mode--explicit--6').classes()).to.contain('navbar-right--hidden');
		await setData(wrapper, { navbarPos: 'top' });
		expect(wrapper.find('#bem-mode--explicit--6').classes()).to.contain('navbar-top--hidden');
	});

	it("enforces the correct mode when registered as 'v-is' or 'v-bem'", () => {
		expect(wrapper.find('#default-mode--1').classes()).to.contain('is-hidden');
		expect(wrapper.find('#default-mode--2').classes()).to.contain('base-class--hidden');
	});

	it("works with props too", async () => {
		expect(wrapper.find('#props-mods--1').classes()).to.contain('is-opened');
		expect(wrapper.find('#props-mods--2').classes()).to.contain('is-opened');
		expect(wrapper.find('#props-mods--3').classes()).to.contain('base-class--opened');

		await setProps(wrapper, { isOpened: false, isMaximized: true });

		expect(wrapper.find('#props-mods--1').classes()).to.contain('is-maximized');
		expect(wrapper.find('#props-mods--2').classes()).to.contain('is-maximized');
		expect(wrapper.find('#props-mods--3').classes()).to.contain('base-class--maximized');
	});
});
