<script lang="ts">
	import { useMathJax } from './useMathJax';
	import type { OptionList } from 'mathjax-full/js/util/Options';

	export let display = true;
	export let t = '';
	export let settings: OptionList | undefined;

	//complete
	const { output, error } = useMathJax({});
</script>

<div class="w-80 h-60 flex justify-center items-center">{@html outputHTML}</div>
