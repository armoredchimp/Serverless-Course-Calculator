let state = {
  courses: [], // Array for all courses
  displayCourses: [], // Array only for courses not hidden by toggle
  showCompleted: true,
  sortCriteria: 'percent',
  ascending: true,
};

class Course {
  constructor(name, totalHours, progress = 0) {
    this.name = name;
    this.totalHours = totalHours;
    this.progress = progress;
  }
}
