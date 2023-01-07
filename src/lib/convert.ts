import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { CHTML } from 'mathjax-full/js/output/chtml';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { OptionList } from 'mathjax-full/js/util/Options';

export interface MathJaxConfig {
	t: string;
	node?: HTMLElement;
	display?: boolean;
	settings?: OptionList;
}

let adaptor: ReturnType<typeof browserAdaptor>;
let tex: TeX<unknown, unknown, unknown>;
let chtml: CHTML<HTMLElement, unknown, unknown>;

let tex_chtml_html: ReturnType<typeof mathjax.document>;

export function initialize() {
	adaptor = browserAdaptor();
	RegisterHTMLHandler(adaptor);

	tex = new TeX({ packages: ['base', 'ams'] });
	chtml = new CHTML({
		fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
	});

	tex_chtml_html = mathjax.document('', { InputJax: tex, OutputJax: chtml });
}

const STYLES_ID = 'mathjax-styles';

const updateStyles = (styles: string) => {
	let styleNode = document.getElementById(STYLES_ID);
	if (styleNode === null) {
		styleNode = document.createElement('style');
		styleNode.setAttribute('id', STYLES_ID);
		document.head.appendChild(styleNode);
	}
	styleNode.innerHTML = styles;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = { promise: Promise.resolve(''), cancel: () => {} };

export default function useMathJax({ node, display, t, settings }: MathJaxConfig) {
	if (!tex_chtml_html) {
		console.warn('MathJax not initialized');
		return noop;
	}

	if (!node) {
		console.warn('No target node specified');
		return noop;
	}

	display ??= true;
	settings ??= {};

	const math = t.trim();
	const metrics = chtml.getMetricsFor(node, display);

	let canceled = false;

	const cancel = () => (canceled = true);

	const promise = mathjax
		.handleRetriesFor(() => {
			if (canceled) {
				throw new Error('MathJax render cancelled');
			}

			chtml.clearCache();
			const dom = tex_chtml_html.convert(math, {
				display,
				...metrics,
				...settings
			});

			return dom;
		})
		.then((dom: HTMLElement) => {
			tex_chtml_html.updateDocument();

			const styles = adaptor.textContent(chtml.styleSheet(tex_chtml_html));
			updateStyles(styles);

			const err = adaptor.getAttribute(dom, 'data-mjx-error');
			if (err) throw err;

			return adaptor.outerHTML(dom) ?? '';
		});
	return { promise, cancel };
}
