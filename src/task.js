/**
 * Creates a new task with the given details.
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task (formatted string).
 * @param {string} notes - Additional notes about the task.
 * @param {string} priority - The priority level of the task.
 * @returns {object} An object representing the task, with methods to get and set task properties.
 */
export default function createTask(title, description, dueDate, notes, priority) {
	let _title = title;
	let _description = description;
	let _dueDate = dueDate;
	let _notes = notes;
	let _priority = priority;
	let _completed = false;

	// Getter methods
	const getTitle = () => _title;
	const getDescription = () => _description;
	const getDueDate = () => _dueDate;
	const getNotes = () => _notes;
	const getPriority = () => _priority;
	const isCompleted = () => _completed;

	// Setter methods
	const setTitle = (newTitle) => { _title = newTitle; };
	const setDescription = (newDescription) => { _description = newDescription; };
	const setDueDate = (newDueDate) => { _dueDate = newDueDate; };
	const setNotes = (newNotes) => { _notes = newNotes; };
	const setPriority = (newPriority) => { _priority = newPriority; };
	const toggleCompleted = () => { _completed = !_completed; };

	return {
		getTitle,
		getDescription,
		getDueDate,
		getNotes,
		getPriority,
		isCompleted,
		setTitle,
		setDescription,
		setDueDate,
		setNotes,
		setPriority,
		toggleCompleted,
	};
}