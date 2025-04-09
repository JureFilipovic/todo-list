import createProject from "./project.js";
import createTask from "./task.js";



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
            console.log("Error parsing stored projecst.", e);
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
