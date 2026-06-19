import { defineStore } from "pinia";
import {
	createShortcutService,
	deleteShortcutService,
	updateShortcutService,
	getShortcutsService,
	type Shortcut,
} from "../services/shortcuts.service";
import { ref } from "vue";

export const useShortcutStore = defineStore("shortcut", () => {
	const shortcuts = ref<Shortcut[]>([]);
	const currentWorkspaceId = ref<number | null>(null);

	async function getShortcuts(workspaceId: number) {
		currentWorkspaceId.value = workspaceId;
		shortcuts.value = await getShortcutsService(workspaceId);
	}

	async function createShortcut(
		workspaceId: number,
		title: string,
		type: "web" | "folder" | "file",
		path: string,
		browserPath: string | null,
	) {
		await createShortcutService(workspaceId, title, type, path, browserPath);

		if (currentWorkspaceId.value === workspaceId) {
			await getShortcuts(workspaceId);
		}
	}

	async function updateShortcut(
		workspaceId: number,
		shortcutId: number,
		title: string,
		type: "web" | "folder" | "file",
		path: string,
		browserPath: string | null,
	) {
		await updateShortcutService(shortcutId, title, type, path, browserPath);

		if (currentWorkspaceId.value === workspaceId) {
			await getShortcuts(workspaceId);
		}
	}

	async function deleteShortcut(id: number) {
		await deleteShortcutService(id);

		if (currentWorkspaceId.value !== null) {
			await getShortcuts(currentWorkspaceId.value);
		}
	}

	return {
		shortcuts,
		currentWorkspaceId,
		getShortcuts,
		createShortcut,
		updateShortcut,
		deleteShortcut,
	};
});
