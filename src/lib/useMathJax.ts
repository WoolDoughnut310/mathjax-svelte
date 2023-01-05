import convert, { type MathJaxConfig } from './convert';

export async function useMathJax(config: MathJaxConfig) {
	if (!config.node) return {};
	const { promise, cancel } = convert(config);

	let output = null;
	let error = null;

	try {
		output = await promise;
	} catch (err) {
		error = err;
	}

	return { output, error, cancel };
}
