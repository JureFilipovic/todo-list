import createProject from "./project.js";
import createTask from "./task.js";

/**
 * `storageController` module manages all interactions with the browser's local storage 
 * for saving, loading, and clearing the list of projects and their tasks in the to-do list app.
 * It ensures data persistence across page reloads.
 * 
 * Functions:
 * - `storageAvailable`: Checks if localStorage is available and handles potential errors like 
 *   private/incognito mode or exceeding the storage quota.
 * - `saveProjects`: Saves an array of project objects (with tasks) to localStorage in a serialized format.
 * - `loadProjects`: Loads and parses stored project data from localStorage, returning an empty array 
 *   if no data is found or if there's an error during parsing.
 * - `clearStorage`: Clears all stored project data from localStorage.
 * 
 * The module encapsulates local storage handling and provides utility functions to save, load, 
 * and clear project data, while ensuring compatibility with different browser environments and modes.
 */
const storageController = (() => {

    const storageKey = "todoProjects";

    function storageAvailable() {
        try {
            const testKey = "__storage_test__";
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            if (e instanceof DOMException) {
                if (navigator.userAgent.includes("Safari") && window.webkitStorageInfo) {
                    alert("Local Storage is unavailable in your browser's private/incognito mode. Some features may not work as expected.");
                } else if (e.name === "QuotaExceededError") {
                    alert("Local Storage is full. Please clear your browser data.");
                } else {
                    alert("Local Storage is unavailable in your browser. Some features may not be available.");
                }
            }
            return false;
        }
    } 

    function saveProjects(projects) {
        if (!storageAvailable()) return;

        if (!Array.isArray(projects)) {
            console.error("invalid projects data");
            return;
        }
        
        const dataToStore = projects.map(p => ({
            _title: p.getTitle(),
            _tasks: p.getTasks().map(t => ({
                _title: t.getTitle(),
                _description: t.getDescription(),
                _dueDate: t.getDueDate(),
                _notes: t.getNotes(),
                _priority: t.getPriority(),
                _completed: t.isCompleted(),
            }))
        }));

        localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    }

    function loadProjects() {
        if (!storageAvailable()) return [];
        
        const storedProjects = localStorage.getItem(storageKey);

        if (!storedProjects) return [];

        try {
            const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];

            if (Array.isArray(parsedProjects)) {
                return parsedProjects;
            }
            return [];
        } catch (e) {
            return [];
        }
    }

    function clearStorage() {
        if (!storageAvailable()) return;
        localStorage.removeItem(storageKey);
    }

    return {
        saveProjects,
        loadProjects,
        clearStorage,
    }
})();

export default storageController;
