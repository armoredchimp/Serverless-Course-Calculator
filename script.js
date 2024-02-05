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
const addNew = document.querySelector('.add-new');
const addCmodal = document.querySelector('.addC-modal');
const addCourseBtn = document.getElementById('addCourseBtn');
////
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
    this.progressColor = percentColor(this.progress);
    this.colorR = getColor(this.remainingHours);
    this.element = document.createElement('div');
    this.element.className = 'course-line';
    this.element.innerHTML = `
    <div class="course-details">
      <span style="color: ${this.progressColor};">${
      this.progress
    }%</span> of the ${this.totalHours}-hour ${
      this.name
    } course has been completed, which is roughly ${this.completedHours()} hours. <span style="color: ${
      this.colorR
    };">${this.remainingHours().toFixed(2)}</span> hours remain for this course.
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
    const courseItem = new CourseItem(
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

addNew.addEventListener('click', () => {
  addCmodal.style.display = 'block';
});

addCourseBtn.addEventListener('click', () => {
  const courseName = document.getElementById('addCourseName').value;
  const totalHours = Number(document.getElementById('addTotalHours').value);
  const newCourse = new Course(courseName, totalHours, 0);
  console.log(state.courses, state.displayCourses);
  renderCourses();
  addCmodal.style.display = 'none';
});
