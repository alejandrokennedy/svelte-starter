export const footerState = $state({ visible: false });

$effect.root(() => {
	let closeButton = null;
	let listenerAttached = false;
	let userClosed = false;
	let observer = null;

	const handleClose = () => {
		userClosed = true;
		footerState.visible = false; // Mutate the property
	};

	const checkForBar = () => {
		const container = document.querySelector("#cen-main-metered-bar");
		const bar = document.querySelector("#article-meter");
		const newCloseButton = document.querySelector("#article-meter .btn-close");

		if (container && bar && !footerState.visible && !userClosed) {
			footerState.visible = true; // Mutate the property
			if (observer) {
				observer.disconnect();
			}
		}

		if (newCloseButton && !listenerAttached) {
			closeButton = newCloseButton;
			closeButton.addEventListener("click", handleClose);
			listenerAttached = true;
		}
	};

	checkForBar();

	observer = new MutationObserver(() => {
		checkForBar();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	return () => {
		if (observer) {
			observer.disconnect();
		}
		if (closeButton && listenerAttached) {
			closeButton.removeEventListener("click", handleClose);
		}
	};
});
