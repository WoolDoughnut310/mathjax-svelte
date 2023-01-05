<script lang="ts">
	import { mathjax } from 'mathjax-full/js/mathjax';
	import { TeX } from 'mathjax-full/js/input/tex';
	import { CHTML } from 'mathjax-full/js/output/chtml';
	import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
	import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
	import { onMount } from 'svelte';

	export let t = '';
	export let display = false;

	let outputHTML = '';

	let adaptor: ReturnType<typeof browserAdaptor>;
	let html: ReturnType<typeof mathjax.document>;
	let chtml: CHTML<HTMLElement, unknown, unknown>;

	const updateCSS = (nodeID: string, text: string) => {
		let styleNode = document.getElementById(nodeID);
		if (styleNode === null) {
			styleNode = document.createElement('style');
			styleNode.setAttribute('id', nodeID);
			document.head.appendChild(styleNode);
		}
		styleNode.innerHTML = text;
	};

	onMount(() => {
		adaptor = browserAdaptor();
		RegisterHTMLHandler(adaptor);

		const tex = new TeX({ packages: ['base', 'ams'] });
		chtml = new CHTML({
			fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
		});

		html = mathjax.document('', { InputJax: tex, OutputJax: chtml });

		const node = html.convert(t, {
			display
		});
		outputHTML = adaptor.outerHTML(node);
		html.updateDocument();
		const styles = adaptor.textContent(chtml.styleSheet(html));
		updateCSS('mathjax-chtml-styles', styles);
	});

	$: {
		if (html) {
			// console.log('t is', t);
			// const node = html.convert(t, {
			// 	display
			// });
			// outputHTML = adaptor.outerHTML(node);
			// html.updateDocument();
			// const styles = adaptor.textContent(chtml.styleSheet(html));
			// updateCSS('mathjax-chtml-styles', styles);
		}
	}
</script>

<div class="w-80 h-60 flex justify-center items-center">{@html outputHTML}</div>
