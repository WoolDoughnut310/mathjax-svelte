<script lang="ts">
	import type { MathJaxConfig } from './convert';
	import useMathJax from './useMathJax';

	let className = '';
	let mathElement: MathJaxConfig['node'];

	export let display = true;
	export let t = '';
	export let settings: MathJaxConfig['settings'] = {};

	export { className as class };

	$: ({ output } = useMathJax({ display, t, settings, node: mathElement }));
</script>

<svelte:element this={display ? 'div' : 'span'} bind:this={mathElement} class={className}
	>{@html $output}</svelte:element
>
