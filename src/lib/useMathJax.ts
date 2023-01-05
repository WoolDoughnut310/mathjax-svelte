import type { OptionList } from 'mathjax-full/js/util/Options';
import { afterUpdate } from 'svelte';
import convert from './convert';

export interface UseMathJaxConfig {
	src: string;
	node: HTMLElement;
	display: boolean;
	settings: OptionList;
}

export function useMathJax(config) {}
