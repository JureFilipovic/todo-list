import createTask from "./task.js";
import localStorage from "./localStorage.js";
import appController from "./app.js";

/**
 * Creates a new project with a given title, where tasks can be added and updated.
 *
 * @param {string} title - The title of the project.
 * @returns {object} An object representing the project with methods to get, set, add, and update tasks.
 */
export default function createProject(title) {
    let _tasks = [];
    let _title = title;
    let _activeTask = null;

    // Getter methods
    const getTasks = () => [..._tasks];
    const getTitle = () => _title;
    const getTask = (taskId) => {
        return _tasks.find(task => task.getId() === taskId) || null;
    };
    const getActiveTask = () => _activeTask;
    
    // Setter methods
    const setTitle = (newTitle) => { _title = newTitle; };
    const setActiveTask = (task) => _activeTask = task;

    // Adds a task to the _tasks array, returns true if successful and false if not
    const addTask = (task) => {
        if (_tasks.find(t => t.getId() === task.getId())) {
            return false; // Task exists
        } 

        _tasks.push(task);
        return true; // Task added successfully
    }

    // Updates task property, returns true if successful and false if not
    const updateTask = (taskToUpdate, title, description, dueDate, notes, priority) => {
        const task = _tasks.find(t => t.getId() === taskToUpdate.getId());
        if (!task) return false; // Task doesn't exist

        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setNotes(notes);
        task.setPriority(priority);

        localStorage.saveProjects(appController.getProjects());
        return true;
    }

    // Deletes task based on ID, returns true if successful and false if not
    const deleteTask = (task) => {
        // console.log("deleting task id:", task.getId());
        const index = _tasks.findIndex(t => t.getId() === task.getId());
        if (index != -1) {
            _tasks.splice(index, 1);
            return true; // Successfully deleted
        }
        
        return false; // Task not found
    }

    return {
        getTasks,
        getTitle,
        getTask,
        getActiveTask,
        setTitle,
        setActiveTask,
        addTask,
        updateTask,
        deleteTask,
    };
}