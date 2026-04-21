<script lang="ts">
	import { footerState } from "$utils/footerState.svelte";
	if (import.meta.env.DEV) {
		$inspect("footer visible:", footerState.visible);
	}
</script>

<div class="scrollo-story">
	<div>Story</div>
</div>
