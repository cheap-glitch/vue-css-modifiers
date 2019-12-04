
/**
 * test/main.test.js
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

const factory  = (_data = {})       => shallowMount(App, { data () { return { ..._data } } });
const setData  = (_wrapper, _data)  => { _wrapper.setData(_data);   Vue.nextTick(); };
const setProps = (_wrapper, _props) => { _wrapper.setProps(_props); Vue.nextTick(); };

/**
 * Tests
 * -----------------------------------------------------------------------------
 */
describe('vue-css-modifiers', () => {
	const wrapper = factory();

	it("adds modifiers properly", () => {
		expect(wrapper.find('#simple-mods--1').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--2').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--3').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--4').classes()).to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--5').classes()).to.contain('is-hidden');
	});

	it("removes modifiers properly", () => {
		setData(wrapper, { isHidden: false });

		expect(wrapper.find('#simple-mods--1').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--2').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--3').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--4').classes()).not.to.contain('is-hidden');
		expect(wrapper.find('#simple-mods--5').classes()).not.to.contain('is-hidden');

		setData(wrapper, { isHidden: true });
	});

	it("doesn't clash with static classes", () => {
		expect(wrapper.find('#no-clash--1').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--2').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--3').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--4').classes()).to.contain.all.members(['static-class', 'is-hidden']);
		expect(wrapper.find('#no-clash--5').classes()).to.contain.all.members(['static-class', 'is-hidden']);

	});

	it("adds modifiers with a 'is-' suffix when the '.is' modifier is specified", () => {
		expect(wrapper.find('#is-mode--1').classes()).to.contain('is-hidden');
		expect(wrapper.find('#is-mode--2').classes()).to.contain('is-hidden');
		expect(wrapper.find('#is-mode--3').classes()).to.contain('is-hidden');
		expect(wrapper.find('#is-mode--4').classes()).to.contain('is-hidden');
	});

	it("adds modifiers as suffixes of a base class when the '.bem' modifier is specified", () => {
		expect(wrapper.find('#bem-mode--1').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--2').classes()).not.to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--3').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--4').classes()).to.contain('base-class--hidden');
		expect(wrapper.find('#bem-mode--5').classes()).to.contain('base-class--hidden');

		expect(wrapper.find('#bem-mode--6').classes()).to.contain('navbar-left--hidden');
		expect(wrapper.find('#bem-mode--7').classes()).to.contain('navbar-right--hidden');
		expect(wrapper.find('#bem-mode--8').classes()).to.contain('navbar-right--hidden');

		setData(wrapper, { navbarPos: 'left' });

		expect(wrapper.find('#bem-mode--6').classes()).to.contain('navbar-left--hidden');
		expect(wrapper.find('#bem-mode--7').classes()).not.to.contain('navbar-right--hidden');
		expect(wrapper.find('#bem-mode--8').classes()).to.contain('navbar-left--hidden');
	});

	it("enforces the correct mode when registered as 'v-is' or 'v-bem'", () => {
		expect(wrapper.find('#default-mode--1').classes()).to.contain('is-hidden');
		expect(wrapper.find('#default-mode--2').classes()).to.contain('base-class--hidden');
	});

	it("works with props too", () => {
		expect(wrapper.find('#props-mods--1').classes()).to.contain('is-opened');
		expect(wrapper.find('#props-mods--2').classes()).to.contain('is-opened');
		expect(wrapper.find('#props-mods--3').classes()).to.contain('base-class--opened');

		setProps(wrapper, { isOpened: false, isMaximized: true });

		expect(wrapper.find('#props-mods--1').classes()).to.contain('is-maximized');
		expect(wrapper.find('#props-mods--2').classes()).to.contain('is-maximized');
		expect(wrapper.find('#props-mods--3').classes()).to.contain('base-class--maximized');
	});
});
