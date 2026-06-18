
function handleOpenOrFocus(targetUrl) {
	chrome.tabs.query({}, (tabs) => {
		try {
			const target = new URL(targetUrl);

			let existingTab = tabs.find((tab) => {
				if (!tab.url) return false;
				try {
					const currentTabUrl = new URL(tab.url);
					return currentTabUrl.hostname === target.hostname;
				} catch (e) {
					return false;
				}
			});

			if (existingTab) {
				// TAB KETEMU! Fokuskan tab tersebut
				console.log("Tab found! Focusing tab id:", existingTab.id);
				chrome.tabs.update(existingTab.id, { active: true });
				chrome.windows.update(existingTab.windowId, { focused: true });
			} else {
				// TAB TIDAK KETEMU! Buka tab baru
				console.log("No active tabs. Opening a new one.");
				chrome.tabs.create({ url: targetUrl });
			}
		} catch (e) {
			chrome.tabs.create({ url: targetUrl });
		}
	});
}

async function setupOffscreenDocument() {
	const OFFSCREEN_PATH = 'offscreen.html';

	if (await chrome.offscreen.hasDocument()) {
		return;
	}

	try {
		await chrome.offscreen.createDocument({
			url: OFFSCREEN_PATH,
			reasons: ['IFRAME_SCRIPTING'],
			justification: 'Maintaining WebSocket connection to Workstation Dock App'
		});

		console.log("Offscreen document created successfully.")
	} catch (error) {
		console.error("Failed to create offscreen document: ", error)
	}
}

chrome.runtime.onStartup.addListener(setupOffscreenDocument);
chrome.runtime.onInstalled.addListener(setupOffscreenDocument);

setupOffscreenDocument();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "open_or_focus" && message.url) {
		handleOpenOrFocus(message.url)
	}
})