import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { CHTML } from 'mathjax-full/js/output/chtml';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { OptionList } from 'mathjax-full/js/util/Options';

const adaptor = browserAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: ['base', 'ams'] });
const chtml: CHTML<HTMLElement, unknown, unknown> = new CHTML({
	fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
});

const tex_chtml_html = mathjax.document('', { InputJax: tex, OutputJax: chtml });

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

export default function convert(
	src: string,
	node: HTMLElement,
	display: boolean,
	settings: OptionList
) {
	if (!node) throw new Error();
	const math = src.trim();
	const metric = chtml.getMetricsFor(node, display);

	let canceled = false;

	const cancel = () => (canceled = true);

	const promise = mathjax
		.handleRetriesFor(() => {
			if (canceled) {
				throw new Error('Render cancelled.');
			}

			const dom = tex_chtml_html.convert(math, {
				display,
				...settings,
				metric
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
