let state = {
  courses: [], // Array for all courses
  displayCourses: [], // Array only for courses not hidden by toggle
  showCompleted: true,
  sortCriteria: 'percent',
  ascending: true,
  id: 0,
};

function getID() {
  const currentId = state.id + 1;
  state.id = currentId;
  return currentId;
}

class Course {
  constructor(name, totalHours, progress = 0) {
    this.name = name;
    this.id = getID();
    this.totalHours = totalHours;
    this.progress = progress;

    state.courses.push(this);
    state.displayCourses.push(this);
  }

  completedHours() {
    return Math.round((this.progress / 100) * this.totalHours * 100) / 100;
  }

  remainingHours() {
    return Math.round((this.totalHours - this.completedHours()) * 100) / 100;
  }
}

sampleLink.addEventListener('click', () => {
  const apiUrl = config.API_URL;

  axios
    .get(apiUrl)
    .then((response) => {
      const courses = response.data.courses;
      // Create Course instances from each object in the array
      console.log(courses);
      courses.map((obj) => new Course(obj.name, obj.totalHours, obj.progress));
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });

  sampleClose();
});
