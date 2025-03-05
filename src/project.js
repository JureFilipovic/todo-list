import createTask from "./task.js";

/**
 * Creates a new project with a given title, where tasks can be added and updated.
 *
 * @param {string} title - The title of the project.
 * @returns {object} An object representing the project with methods to get, set, add, and update tasks.
 */
export default function createProject(title) {
    let _tasks = [];
    let _title = title;

    // Getter methods
    const getTasks = () => _tasks;
    const getTitle = () => _title;
    
    // Setter methods
    const setTitle = (newTitle) => { _title = newTitle; };

    // Adds a task to the _tasks array, returns true if successful and false if not
    const addTask = (task) => {
        if (_tasks.find(t => t.getId() === task.getId())) {
            return false; // Task exists
        } 

        _tasks.push(task);
        return true; // Task added successfully
    }

    // Updates task property, returns true if successful and false if not
    const updateTask = (taskId, property, newValue) => {
        const task = _tasks.find(t => t.getId() === taskId);
        if (!task) return false; // Task doesn't exist

        const propertySetters = {
            "title": task.setTitle,
            "description": task.setDescription,
            "dueDate": task.setDueDate,
            "notes": task.setNotes,
            "priority": task.setPriority,
            "completed": task.toggleCompleted,
        };

        if (propertySetters[property]) {
            propertySetters[property](newValue);
            return true; // Task property set successfully
        } else {
            return false; // Task property doesn't exist
        }
    }

    // Deletes task based on ID, returns true if successful and false if not
    const deleteTask = (taskId) => {
        const index = _tasks.findIndex(t => t.getId() === taskId);
        if (index != -1) {
            _tasks.splice(index, 1);
            return true; // Successfully deleted
        }
        return false; // Task not found
    }

    return {
        getTasks,
        getTitle,
        setTitle,
        addTask,
        updateTask,
        deleteTask,
    };
}