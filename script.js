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
//Add Course Selectors
const addNew = document.querySelector('.add-new');
const addCmodal = document.querySelector('.addC-modal');
const addCourseBtn = document.getElementById('addCourseBtn');
//Sorting Selectors
const sortIcon = document.querySelector('.sort-icon');
const sortCriteria = document.getElementById('sortCriteria');
const ascendIcon = document.getElementById('ascend-icon');
const descendIcon = document.getElementById('descend-icon');
////
let state = {
  courses: [], // Array for all courses
  displayCourses: [],
  hiddenCourses: [],
  showCompleted: true,
  sortCriteria: 'percent',
  ascending: true,
  id: 0,
};

//COURSE CREATION/RENDERING
function getID() {
  const currentId = state.id + 1;
  state.id = currentId;
  return currentId;
}

class Course {
  constructor(name, totalHours, progress) {
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
  constructor(name, totalHours, progress) {
    super(name, totalHours, progress);
    this.progressColor = percentColor(this.progress);
    this.colorR = getColor(this.remainingHours);
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'course-line';
    this.element.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="minus-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
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
    course.render();
    const listItem = document.createElement('li');
    listItem.appendChild(course.element);
    const minusSelector = listItem.querySelector('.minus-icon');
    minusSelector.addEventListener('click', () => {
      course.delete();
      console.log(state.courses, state.displayCourses);
    });
    courseUL.appendChild(listItem);
  });
}

//SORTING
sortIcon.addEventListener('click', () => {
  state.ascending = !state.ascending;
  sortCourses();
  toggleSortIcon();
});
sortCriteria.addEventListener('change', () => {
  sortCourses();
  toggleSortIcon();
});

function toggleSortIcon() {
  if (state.ascending) {
    ascendIcon.style.display = 'none';
    descendIcon.style.display = 'inline';
  } else {
    ascendIcon.style.display = 'inline';
    descendIcon.style.display = 'none';
  }
}

function sortCourses() {
  sortArray(state.courses);
  sortArray(state.displayCourses);
  sortArray(state.hiddenCourses);

  renderCourses();
}

function sortArray(array) {
  const selectedCriteria = sortCriteria.value;
  array.sort((a, b) => {
    let compareA, compareB;

    if (selectedCriteria === 'progress') {
      compareA = a.progress;
      compareB = b.progress;
    } else {
      compareA = a.remainingHours();
      compareB = b.remainingHours();
    }
    return state.ascending ? compareA - compareB : compareB - compareA;
  });
}

//ADD NEW COURSE
addNew.addEventListener('click', () => {
  addCmodal.style.display = 'block';
});

addCourseBtn.addEventListener('click', () => {
  const courseName = document.getElementById('addCourseName').value;
  const totalHours = Number(document.getElementById('addTotalHours').value);
  const newCourse = new CourseItem(courseName, totalHours, 0);
  console.log(state.courses, state.displayCourses);
  renderCourses();
  addCmodal.style.display = 'none';
});

//REMOVE COURSE
function removeCourse(id) {
  state.courses = state.courses.filter((course) => course.id !== id);
  state.displayCourses = state.displayCourses.filter(
    (course) => course.id !== id
  );
}
