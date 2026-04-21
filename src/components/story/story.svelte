<script lang="ts">
	import { footerState } from "$utils/footerState.svelte";
	if (import.meta.env.DEV) {
		$inspect("footer visible:", footerState.visible);
	}
	let { darkMode = false } = $props();
</script>

<div class="scrollo-story" class:scrollo-dark={darkMode}>
	<div>Story</div>
</div>

<style>
	.scrollo-story {
		color-scheme: light;
	}

	.scrollo-story.scrollo-dark {
		color-scheme: dark;
	}

	:global(body):has(.scrollo-dark) {
		background-color: black;
	}
</style>
