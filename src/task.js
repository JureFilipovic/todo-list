export default function createTask(title, description, dueDate, notes, priority) {
	return {
		title,
		description,
		dueDate,
		notes,
		priority,
		completed: false,

		updateTitle(newTitle) {
			this.title = newTitle;
		},

		updateDescription(newDescription) {
			this.description = newDescription;
		},

		updateDueDate(newDate) {
			this.dueDate = newDate;
		},

		markCompleted() {
		this.completed = true;
		},

		updatePriority(newPriority) {
			this.priority = newPriority;
		}
	}
}