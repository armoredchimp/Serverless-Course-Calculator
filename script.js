('use strict');

import {
  getColor,
  bigColor,
  invertedBigColor,
  percentColor,
  invertedPercentColor,
} from './colors.js';
//Selectors
//Main Body for course list
const courseUL = document.querySelector('.courses');
//Add Course Selectors
const addNew = document.querySelector('.add-new');
const addCmodal = document.querySelector('.addC-modal');
const addCourseBtn = document.getElementById('addCourseBtn');
const addCName = document.getElementById('addCourseName');
const addTotalHours = document.getElementById('addTotalHours');
const addCCurrHours = document.getElementById('addCurrHours');
const addCProgress = document.getElementById('addProgress');
//Sorting Selectors
const sortIcon = document.querySelector('.sort-icon');
const sortCriteria = document.getElementById('sortCriteria');
const ascendIcon = document.getElementById('ascend-icon');
const descendIcon = document.getElementById('descend-icon');
//Edit Course Selectors
const editCmodal = document.querySelector('.modal-edit');
const editName = document.getElementById('courseNameE');
const editHours = document.getElementById('totalHoursE');
const editCurHours = document.getElementById('totalHoursC');
const editProgress = document.getElementById('percentCompE');
const editButton = document.getElementById('editCourseBtn');
//Toggle Completed
const toggleBtn = document.getElementById('toggle-completed');
//Login
const loginModal = document.querySelector('.modal-login');
//Upload
const cloudIcon = document.querySelector('.cloud-icon');
//X Button in modal windows
const closeModal = document.querySelector('.close');
const closeEdit = document.querySelector('.closeEdit');
const closeLogin = document.querySelector('.closeLogin');
//Starting Text
const ultraCont = document.querySelector('.ultra-cont');
const messageCont = document.querySelector('.message-cont');
const addLink = document.querySelector('.addLink');
const sampleLink = document.querySelector('.sampleLink');
//Result Section
const resCurHours = document.querySelector('.current-hours');
const resTotHours = document.querySelector('.all-hours');
const resRemHours = document.querySelector('.remaining-hours');
const resCompPerc = document.querySelector('.completion-percent');
const resRemPerc = document.querySelector('.remaining-percent');
//
//State Object
let state = {
  courses: [], // Array for all courses
  displayCourses: [],
  hiddenCourses: [],
  currentEdit: null,
  showCompleted: true,
  sortCriteria: 'percent',
  ascending: true,
  id: 0,
};

samplePrompt()
completed();
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
  }

  render() {
    this.progressColor = percentColor(this.progress);
    this.colorR = getColor(this.remainingHours());
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
    const resetBtn = listItem.querySelector('.reset-button');
    resetBtn.addEventListener('click', () => {
      reset(course.id);
    });
    const editBtn = listItem.querySelector('.edit-button');
    editBtn.addEventListener('click', () => {
      editCourse(course.id);
    });
    minusSelector.addEventListener('click', () => {
      course.delete();
      console.log(state.courses, state.displayCourses);
    });
    courseUL.appendChild(listItem);
  });
  completed();
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

  toggleCompleted();
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

//TOGGLE COMPLETED COURSES
toggleBtn.addEventListener('click', () => {
  state.showCompleted = !state.showCompleted;
  toggleBtn.className = state.showCompleted
    ? 'fas fa-toggle-on'
    : 'fas fa-toggle-off';
  toggleCompleted();
});

function toggleCompleted() {
  if (state.showCompleted) {
    state.hiddenCourses.forEach((course) => {
      state.displayCourses.push(course);
    });
    state.hiddenCourses = [];
  } else {
    state.displayCourses.forEach((course) => {
      if (course.progress === 100) {
        state.hiddenCourses.push(course);
      }
    });
    state.displayCourses = state.displayCourses.filter(
      (course) => course.progress !== 100
    );
  }
  renderCourses();
}

//ADD / REMOVE COURSES
addNew.addEventListener('click', () => {
  addCmodal.style.display = 'block';
  addCProgress.addEventListener('input', function () {
    const newHours =
      Math.round((this.value / 100) * addTotalHours.value * 100) / 100;
    addCCurrHours.value = newHours;
  });
  addCCurrHours.addEventListener('input', function () {
    const newPercent =
      Math.round((this.value / addTotalHours.value) * 100 * 100) / 100;
    addCProgress.value = newPercent;
  });
});

addCourseBtn.addEventListener('click', () => {
  const courseName = document.getElementById('addCourseName').value;
  const totalHours = Number(document.getElementById('addTotalHours').value);
  const currentProgress = Number(document.getElementById('addProgress').value);
  if (
    currentProgress >= 0 &&
    currentProgress <= 100 &&
    courseName !== '' &&
    totalHours > 0
  ) {
    const newCourse = new CourseItem(courseName, totalHours, currentProgress);
    toggleCompleted();
    addCmodal.style.display = 'none';
    resetModalValues();
    console.log(state.courses, state.displayCourses);
  } else if (currentProgress < 0 || currentProgress > 100) {
    alert('Must enter a percentage from 0-100');
    document.getElementById('addProgress').value = '0';
  } else if (courseName.trim() === '') {
    alert('Must enter a course name');
  } else {
    alert('Must enter a value for total hours');
  }
});

function removeCourse(id) {
  state.courses = state.courses.filter((course) => course.id !== id);
  state.displayCourses = state.displayCourses.filter(
    (course) => course.id !== id
  );
  state.hiddenCourses = state.hiddenCourses.filter(
    (course) => course.id !== id
  );
  toggleCompleted();
}

//RESET COURSE
function reset(id) {
  resetCourse(id, state.courses);
  resetCourse(id, state.displayCourses);
  resetCourse(id, state.hiddenCourses);
  toggleCompleted();
}

function resetCourse(id, array) {
  state.currentEdit = id;
  const course = array.find((course) => course.id === id);
  if (course) {
    course.progress = 0;
  }
}

//EDIT COURSE
function editCourse(id) {
  state.currentEdit = id;
  const course = state.courses.find((course) => course.id === id);
  editName.value = course.name;
  editHours.value = course.totalHours;
  editCurHours.value = course.completedHours();
  editProgress.value = course.progress;
  editCmodal.style.display = 'block';

  editProgress.addEventListener('input', function () {
    const newHours =
      Math.round((this.value / 100) * editHours.value * 100) / 100;
    editCurHours.value = newHours;
  });
  editCurHours.addEventListener('input', function () {
    const newPercent =
      Math.round((this.value / editHours.value) * 100 * 100) / 100;
    editProgress.value = newPercent;
  });
}

editButton.addEventListener('click', () => {
  const editedCourseName = editName.value;
  const editedTotalHours = Number(editHours.value);
  const editedCurProgress = Number(editProgress.value);

  if (
    editedCourseName.trim() !== '' &&
    editedTotalHours > 0 &&
    editedCurProgress >= 0 &&
    editedCurProgress <= 100
  ) {
    [state.courses, state.displayCourses, state.hiddenCourses].forEach(
      (array) => {
        updateArray(
          array,
          state.currentEdit,
          editedCourseName,
          editedTotalHours,
          editedCurProgress
        );
      }
    );
    editCmodal.style.display = 'none';
    toggleCompleted();
  } else {
    if (editedCurProgress < 0 || editedCurProgress > 100) {
      alert('Must enter a percentage from 0-100');
      currentProgress.value = '0';
    } else if (editedCourseName === '') {
      alert('Must enter a course name');
    } else if (editedTotalHours <= 0) {
      alert('Must enter a value for total hours greater than 0');
    }
  }
});

function updateArray(array, id, name, totalHours, progress) {
  const courseIndex = array.findIndex((course) => course.id === id);
  if (courseIndex !== -1) {
    array[courseIndex].name = name;
    array[courseIndex].totalHours = totalHours;
    array[courseIndex].progress = progress;
  }
}

//CLOSE AND RESET MODALS
closeModal.addEventListener('click', () => {
  addCmodal.style.display = 'none';
  resetModalValues();
});
closeEdit.addEventListener('click', () => {
  editCmodal.style.display = 'none';
  resetModalValues();
});

window.onclick = (event) => {
  if (
    event.target === addCmodal ||
    event.target === editCmodal ||
    event.target === loginModal
  ) {
    addCmodal.style.display = 'none';
    editCmodal.style.display = 'none';
    loginModal.style.display = 'none';
    resetModalValues();
  }
};

function resetModalValues() {
  addCName.value = '';
  addTotalHours.value = '';
  addCCurrHours.value = '';
  addCProgress.value = '';
  editName.value = '';
  editHours.value = '';
  editCurHours.value = '';
  editProgress.value = '';
}

//////A
sampleLink.addEventListener('click', () => {
  console.log('click')
  const apiUrl = config.API_URL;
  axios
    .get(apiUrl)
    .then((response) => {
      const courses = response.data.courses;
      // Create Course instances from each object in the array
      console.log(courses);
      courses.forEach(courses => new CourseItem(courses.name, courses.totalHours, courses.progress));
      console.log(state.courses, state.displayCourses)
      toggleCompleted()
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });

  sampleClose();
});
cloudIcon.addEventListener('click', () => {
  const userId = document.querySelector('.authdUser').textContent;
  const apiURL = config.API_PUT_URL.replace('{id}', userId);
  console.log(state.courses);
  const courseString = JSON.stringify(state.courses);
  axios
    .put(apiURL, courseString)
    .then((response) => console.log('Success:', response.data))
    .catch((error) => console.error('Error:', error));
});
function samplePrompt() {
  ultraCont.classList.add('sampler');
  messageCont.style.display = 'flex';
}
function sampleClose() {
  ultraCont.classList.remove('sampler');
  messageCont.style.display = 'none';
}

//RESULT SECTION
function completed() {
  let compPercent = 0,
    compRemPercent = 0,
    compRemHours = 0,
    allHours = 0,
    compTotHours = 0;

  state.courses.forEach((course) => {
    compTotHours += course.completedHours();
    allHours += course.totalHours;
    compRemHours += course.remainingHours();
  });

  if (compTotHours !== 0) {
    compPercent = Math.round((compTotHours / allHours) * 10000) / 100;
    compRemPercent = 100 - compPercent;
  }

  resCurHours.textContent = compTotHours.toFixed(2);
  resTotHours.textContent = allHours.toFixed(2);
  resRemHours.textContent = compRemHours.toFixed(2);
  resCompPerc.textContent = `${compPercent.toFixed(2)}`;
  resRemPerc.textContent = `${compRemPercent.toFixed(2)}`;

  resCurHours.style.color = bigColor(allHours.toFixed(2));
  resTotHours.style.color = invertedBigColor(compTotHours);
  resRemHours.style.color = bigColor(compRemHours.toFixed(2));
  resCompPerc.style.color = percentColor(compPercent.toFixed(2));
  resRemPerc.style.color = invertedPercentColor(compRemPercent.toFixed(2));
}
