// URL WebSocket ke aplikasi Tauri
const WS_URL = "ws://127.0.0.1:48531";
let socket = null;
let reconnectInterval = null;

// Fungsi untuk menghubungkan WebSocket
function connectWebSocket() {
	if (socket && socket.readyState === WebSocket.OPEN) return;

	console.log("[Workstation Dock] Connecting to Tauri App...");
	socket = new WebSocket(WS_URL);

	socket.onopen = () => {
		console.log("[Workstation Dock] Connected to Tauri!");
		if (reconnectInterval) {
			clearInterval(reconnectInterval);
			reconnectInterval = null;
		}
	};

	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			console.log("[Workstation Dock] Receiving messages:", data);

			if (data.action === "open_or_focus" && data.url) {
				handleOpenOrFocus(data.url);
			}
		} catch (e) {
			console.error("Failed processing JSON:", e);
		}
	};

	socket.onclose = () => {
		console.log(
			"[Workstation Dock] Connection lost. Trying in 3 seconds...",
		);
		socket = null;
		scheduleReconnect();
	};

	socket.onerror = (err) => {
		socket.close();
	};
}

function scheduleReconnect() {
	if (!reconnectInterval) {
		reconnectInterval = setInterval(() => {
			connectWebSocket();
		}, 3000);
	}
}

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

connectWebSocket();
