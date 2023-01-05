import { onDestroy, onMount } from 'svelte';
import { writable } from 'svelte/store';
import convert, { initialize, type MathJaxConfig } from './convert';

export default function useMathJax(config: MathJaxConfig) {
	const output = writable('');
	const error = writable();

	onMount(initialize);

	const { promise, cancel } = convert(config);

	onDestroy(cancel);

	output.set('Loading...');

	(async () => {
		try {
			output.set(await promise);
		} catch (err) {
			error.set(err);
			output.set('');
		}
	})();

	return { output, error };
}
