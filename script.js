('use strict');

import {
  getColor,
  bigColor,
  invertedBigColor,
  percentColor,
  invertedPercentColor,
} from './colors.js';

//Selectors
const courseUL = document.querySelector('.courses');
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

function removeCourse(id) {
  state.courses = state.courses.filter((course) => course.id !== id);
  state.displayCourses = state.displayCourses.filter(
    (course) => course.id !== id
  );
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

class CourseItem extends Course {
  constructor(name, totalHours, progress, id) {
    super(name, totalHours, progress, id);
    this.completedHours = this.completedHours();
    this.remainingHours = this.remainingHours();
    this.progressColor = percentColor(this.progress);
    this.element = document.createElement('div');
    this.element.className = 'course-line';
    this.element.innerHTML = `
    <div class="course-details">
      <span style="color: ${this.progressColor};">${
      this.progress
    }%</span> of the ${this.totalHours}-hour ${
      this.name
    } course has been completed, which is roughly ${
      this.completedHours
    } hours. <span style="color: ${colorR};">${this.remainingHours.toFixed(
      2
    )}</span> hours remain for this course.
    </div>
    <div class="course-actions">
      <button class="reset-button">Reset</button>
      <button class="edit-button">Edit</button>
    </div>
  `;
  }

  delete() {
    this.element.remove();
    removeCourse(this.id);
  }
}

function renderCourses() {
  courseUL.innerHTML = '';

  state.displayCourses.forEach((course) => {
    const courseItem = new courseItem(
      course.name,
      course.totalHours,
      course.progress,
      course.id
    );
    const listItem = document.createElement('li');
    listItem.appendChild(courseItem.element);
    courseUL.appendChild(listItem);
  });
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
