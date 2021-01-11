export function factory(data = {}) {
	shallowMount(App, {
		data() {
			return { ...data };
		}
	});
}

export async function setData(wrapper, data) {
	wrapper.setData(data);
	await Vue.nextTick();
}

export async function setProps(wrapper, props) {
	wrapper.setProps(props);
	await Vue.nextTick();
}
