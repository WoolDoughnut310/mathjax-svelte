# mathjax-svelte

Svelte component for MathJax

Based on [mathjax-react](https://github.com/CharlieMcVicker/mathjax-react/)

## Installation

```bash
npm i mathjax-svelte

npm i mathjax-full@3
```

## Usage

```svelte
<script>
	import { Math } from 'mathjax-svelte';
</script>

<Math t={`E = {mc^2}`} />
```

## API

### Math

**Props**

| Property | Type    | Default |
| -------- | ------- | ------- |
| t        | String  | ""      |
| display  | Boolean | true    |
| settings | Object  | {}      |
| class    | String  | ""      |

### useMathJax

```typescript
import type { Writable } from 'svelte/store';

function useMathJax(config: MathJaxConfig): {
	output: Writable<string>;
	error: Writable<any>;
};
```

### MathJaxConfig

```typescript
export interface MathJaxConfig {
	t: string;
	node?: HTMLElement;
	display?: boolean;
	settings?: OptionList;
}
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
