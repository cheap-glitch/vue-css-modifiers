import { nextTick } from 'vue';

export async function setData(wrapper, data) {
	wrapper.setData(data);
	await nextTick();
}

export async function setProps(wrapper, props) {
	wrapper.setProps(props);
	await nextTick();
}
