<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	let { data } = $props();

	version();

	const preloadFont = [
		"https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1",
		"https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
		"https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2"
	];

	// const preloadFont = [
	// "https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Regular.woff2",
	// "https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Bold.woff2",
	// "https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Regular-Web.woff2",
	// "https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Bold-Web.woff2"
	// ];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<Index />
