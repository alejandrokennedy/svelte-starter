<script lang="ts">
	import type { Snippet } from "svelte";

	/**
	 * Scrollytelling component with continuous progress tracking
	 *
	 * @example
	 * <Scrollo
	 *   bind:value={currentStep}
	 *   bind:stepProgress={progress}
	 *   top="50vh"
	 * >
	 *   {#each steps as step}
	 *     <div class="step">{step}</div>
	 *   {/each}
	 * </Scrollo>
	 */

	interface Props {
		root?: Element | null;
		top?: number | string;
		bottom?: number;
		increments?: number;
		value?: number | undefined;
		stepProgress?: number | undefined;
		children?: Snippet;
	}

	let {
		root = null,
		top = "75vh",
		bottom = 0,
		increments = 100,
		value = $bindable(undefined),
		stepProgress = $bindable(undefined),
		children
	}: Props = $props();

	let threshold: number[] = [];
	let nodes: Element[] = [];
	let intersectionObservers: IntersectionObserver[] = [];
	let container: HTMLElement | undefined = undefined;
	let rafId: number | null = null;

	// Calculate actual trigger point in pixels
	let triggerPointPx = $derived.by((): number => {
		if (typeof top === "string") {
			if (top.includes("vh")) {
				const vh = parseFloat(top);
				return (window.innerHeight * vh) / 100;
			} else if (top.includes("px")) {
				return parseFloat(top);
			}
			// Fallback: try to parse as number
			return parseFloat(top) || 0;
		}
		return top;
	});

	function findActiveStep() {
		if (!nodes.length) return;

		const trigger = triggerPointPx;
		const triggerLine = window.scrollY + trigger;
		let activeIndex = -1;

		// Find the step whose top has most recently crossed the trigger line
		for (let i = 0; i < nodes.length; i++) {
			const rect = nodes[i].getBoundingClientRect();
			const elementTop = window.scrollY + rect.top;

			if (elementTop <= triggerLine) {
				activeIndex = i;
			} else {
				break;
			}
		}

		// Update value
		if (activeIndex >= 0) {
			value = activeIndex;
			stepProgress = calculateStepProgress();
		} else {
			value = undefined;
			stepProgress = undefined;
		}
	}

	function calculateStepProgress() {
		if (value === undefined || !nodes[value]) return undefined;

		const trigger = triggerPointPx;
		const triggerLine = window.scrollY + trigger;
		const element = nodes[value];
		const rect = element.getBoundingClientRect();

		// Element's absolute positions
		const elementTop = window.scrollY + rect.top;
		const elementBottom = elementTop + rect.height;

		// Progress: 0 when trigger hits top, 1 when trigger hits bottom
		const progress = (triggerLine - elementTop) / rect.height;

		// Clamp between 0 and 1
		return Math.max(0, Math.min(1, progress));
	}

	function createObserver(node, index) {
		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;

			// Throttle findActiveStep call
			if (rafId) return; // Already scheduled? Skip.

			rafId = requestAnimationFrame(() => {
				findActiveStep();
				rafId = null; // ← Reset for next frame
			});
		};

		const trigger = triggerPointPx;
		const marginTop = trigger ? trigger * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	}

	function update() {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	}

	// Add scroll listener for more precise triggering
	function handleScroll() {
		if (rafId) return; // ← Add throttling here too!

		rafId = requestAnimationFrame(() => {
			findActiveStep();
			rafId = null;
		});
	}

	$effect(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = Array.from(container.querySelectorAll(":scope > *:not(iframe)"));
		update();

		// Add scroll listener
		window.addEventListener("scroll", handleScroll, { passive: true });

		// Cleanup function
		return () => {
			window.removeEventListener("scroll", handleScroll);
			intersectionObservers.forEach((observer) => observer.disconnect());
		};
	});

	$effect(() => {
		top;
		bottom;
		update();
	});
</script>

<div class="scrollyContainer" bind:this={container}>
	{@render children?.()}
</div>

<style>
	.scrollyContainer {
		padding-bottom: 100vh;
		margin-top: 0vh;
	}
</style>
