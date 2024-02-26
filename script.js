('use strict');

import {
  getColor,
  bigColor,
  invertedBigColor,
  percentColor,
} from './colors.js';
import {
  slightAbbrev,
  padString,
  padStringFront,
  abbreviatedName,
  updateArray,
} from './utilities.js';

import { Amplify } from 'aws-amplify';
import {
  signUp,
  confirmSignUp,
  signIn,
  getCurrentUser,
  signOut,
  fetchAuthSession,
} from 'aws-amplify/auth';
import amplifyConfig from './amplify.js';
Amplify.configure(amplifyConfig);
const currentConfig = Amplify.getConfig();
console.log(currentConfig);
//Selectors
const smallMode = window.matchMedia('(max-width: 375px)');
const topCont = document.querySelector('.top-cont');
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
const viewResults = document.querySelector('.jump-down');
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
const displayType = document.getElementById('displayType');
const colorScheme = document.getElementById('colorScheme');
//Login
const loginBtn = document.querySelector('.login');

const authd = document.querySelector('.authd');
const authdUser = document.querySelector('.authdUser');
const loginModal = document.querySelector('.modal-login');
const codeWrapper = document.querySelector('.code-wrapper');
const logout = document.querySelector('.logout-icon');
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
const pieChart = document.getElementById('pieChart');
const pieLabel = document.querySelector('.pie-label');
const chartContainer = document.getElementById('columnChart');

//
//STATE OBJECT
let state = {
  courses: [], // Array for all courses
  displayCourses: [],
  hiddenCourses: [],
  currentEdit: null,
  showCompleted: true,
  total: 0,
  colors: 'dark',
  sortCriteria: 'percent',
  ascending: true,
  id: 0,
  verified: false,
  currentUser: '',
};
function checkLogin() {
  currentAuthenticatedUser();
  setTimeout(() => {
    if (!state.verified) {
      loginBtn.style.display = 'block';
      cloudIcon.style.display = 'none';
      authd.style.display = 'none';
    } else {
      loginBtn.style.display = 'none';
      cloudIcon.style.display = 'flex';
      authd.style.display = 'block';
      authdUser.textContent = slightAbbrev(state.currentUser, 14);
    }
  }, 2000);
}

async function currentAuthenticatedUser() {
  try {
    const { username, userId } = await getCurrentUser();
    console.log(`Username: ${username}`);
    console.log(`User Id: ${userId}`);
    state.currentUser = username;
    state.verified = true;
    console.log(state.currentUser, state.verified);
  } catch (err) {
    console.log(err);
  }
}

checkLogin();

loginBtn.addEventListener('click', () => loginScreen());

function loginScreen() {
  loginModal.style.display = 'block';

  document.querySelector('.regBtn').addEventListener('click', event => {
    event.preventDefault();
    const email = document.getElementById('emailText').value;
    const password = document.getElementById('passwordText').value;
    register({ email, password });
  });
  document.querySelector('.loginBtn').addEventListener('click', event => {
    event.preventDefault();
    const email = document.getElementById('emailText').value;
    const password = document.getElementById('passwordText').value;

    userLogin({ email, password });
  });
}

async function register({ email, password }) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    console.log(userId);
    confirmCodes(email);
  } catch (error) {
    console.log(error);
  }
}

function confirmCodes(user) {
  const codeInputs = document.getElementById('confirmation-codes');
  codeWrapper.style.display = 'block';
  codeInputs.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = '1';
    input.classList.add('code-input');
    codeInputs.appendChild(input);
  }
  codeInputs.querySelectorAll('.code-input')[0].focus();
  attachInputListeners(user);
}

function attachInputListeners(user) {
  const confInput = document.querySelectorAll('.code-input');
  confInput.forEach((input, index) => {
    input.addEventListener('keyup', event => {
      if (event.key.match(/[^0-9]/)) {
        input.value = '';
        return;
      }

      if (input.value !== '' && index < confInput.length - 1) {
        confInput[index + 1].focus();
      }

      if (Array.from(confInput).every(input => input.value !== '')) {
        const confCode = Array.from(confInput)
          .map(input => input.value)
          .join('');
        // console.log(confCode);
        registerConfirmation({ user, confCode });
      }
    });
  });
}

async function registerConfirmation({ user, confCode }) {
  console.log(user, confCode);

  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: user,
      confirmationCode: confCode,
    });
    console.log(`Code accepted!`);
    codeWrapper.innerHTML = '';
    codeWrapper.textContent = 'Success! Click to Login';
  } catch (err) {
    console.log('Error', err);
  }
}

async function userLogin({ email, password }) {
  const username = email;
  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
    console.log(`${username} signed in!`);
    loginModal.style.display = 'none';
    state.verified = true;
    checkLogin();
    resetModalValues();
  } catch (err) {
    console.log('Error', err);
  }
}

logout.addEventListener('click', () => userLogout());

async function userLogout() {
  try {
    await signOut();
    console.log(`Signed out`);
    loginBtn.style.display = 'block';
    cloudIcon.style.display = 'none';
    authd.style.display = 'none';
    resetModalValues();
  } catch (error) {
    console.log(`Error signing out`);
  }
}

//
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
    state.total += totalHours;
  }

  completedHours() {
    return Math.round((this.progress / 100) * this.totalHours * 100) / 100;
  }

  remainingHours() {
    return Math.round((this.totalHours - this.completedHours()) * 100) / 100;
  }

  percent() {
    return ((this.completedHours() / state.total) * 100).toFixed(2);
  }

  percentOfTotal() {
    return ((this.totalHours / state.total) * 100).toFixed(2);
  }
}

class CourseItem extends Course {
  constructor(name, totalHours, progress) {
    super(name, totalHours, progress);
    sampleClose();
  }

  render() {
    this.progressColor = percentColor(this.progress);
    this.colorR = getColor(this.remainingHours());
    this.element = document.createElement('div');
    this.element.className = 'course-line';
    if (this.progress === 100) {
      this.element.style.backgroundColor = 'var(--highlight-color)';
      this.complete = true;
    }
    this.element.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="minus-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div class="course-details">
     <div class="detail-text"><div class="text1"> <span style="color: ${
       this.complete ? 'var(--text-color)' : this.progressColor
     };">${this.progress}%</span> of the ${this.totalHours}-hour ${
      this.name
    } course has been completed, which is roughly ${this.completedHours()} hours.</div><div class="text2"> <span style="color: ${
      this.complete ? 'var(--text-color)' : this.colorR
    };">${this.remainingHours().toFixed(2)}</span> hours remain for this course.
    </div></div></div>
    <div class="course-percent-text">${this.percent()}% completed out of ${this.percentOfTotal()}% of the entire courseload</div>
    <div class="course-actions">
      <button class="reset-button">Reset</button>
      <button class="edit-button">Edit</button>
    </div>
  `;
  }

  renderSimple() {
    this.progressColor = percentColor(this.progress);
    this.colorR = getColor(this.remainingHours());
    this.colorC = getColor(this.completedHours());
    this.element = document.createElement('div');
    this.simplePerc = padString(this.progress);
    this.simpleCompleted = padStringFront(this.completedHours().toFixed(2));
    this.simpleRemaining = padStringFront(this.remainingHours().toFixed(2));
    this.element.className = 'course-line';
    if (this.progress === 100) {
      this.element.style.backgroundColor = 'var(--highlight-color)';
      this.complete = true;
    }
    this.element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="minus-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg><div class="name-small">${slightAbbrev(this.name, 19)}</div>
    <div class="course-details alternate">
    <div class="detail-simple">
    <div class="nameBox">${this.name}</div>
    <div class="percBox"><span style="color: ${
      this.complete ? 'var(--text-color)' : this.progressColor
    };">${this.simplePerc}%</span></div>
    <div class="currBox"><span style="color: ${
      this.complete ? 'var(--text-color)' : this.colorC
    };">${this.simpleCompleted}</span>&nbsp;&nbsp;&nbsp;hours completed</div>
    <div class="remBox"><span style="color: ${
      this.complete ? 'var(--text-color)' : this.colorR
    };">${this.simpleRemaining}</span>&nbsp;&nbsp;&nbsp;hours remaining</div>
    
    </div></div>
    <div class="course-percent">${this.percent()} / ${this.percentOfTotal()} %</div>
    <div class="course-percent-small">${this.percent()}% out of ${this.percentOfTotal()}% of total</div>
    <div class="course-actions">
    <button class="reset-button">Reset</button>
    <button class="edit-button">Edit</button>
  </div>
    `;
  }

  delete() {
    this.element.remove();
    removeCourse(this.id, this.totalHours);
  }
}

class Column {
  constructor(state) {
    if (state.courses.length >= 3) {
      this.total = state.total;
      this.sortedCourses = [...state.courses].sort((a, b) => {
        const percA = (a.completedHours() / this.total) * 100;
        const percB = (b.completedHours() / this.total) * 100;
        return percB - percA;
      });

      this.numberOfCourses = this.sortedCourses.length;
      this.thickness = Math.max(100 / (2 * this.numberOfCourses), 5);
      this.render();
    }
  }
  render() {
    chartContainer.innerHTML =
      '<span id="chartText" class="chart-text">Hours Completed</span>';

    smallMode.matches
      ? this.columnHoriz(this.sortedCourses, this.thickness)
      : this.columnVert(this.sortedCourses, this.thickness);
  }

  columnHoriz(courses, thickness) {
    console.log('horz');
    chartContainer.classList.remove('column-chart');
    chartContainer.classList.add('column-chartH');
    courses.forEach(course => {
      const bar = document.createElement('div');
      const label = document.createElement('div');
      const coursePerc = (course.completedHours() / this.total) * 100;
      bar.classList.add('column');
      bar.style.width = `${coursePerc}%`;
      bar.style.height = `${thickness}%`;
      bar.style.backgroundColor = invertedBigColor(coursePerc);
      label.classList.add('column-labelH');
      label.textContent = course.name;

      bar.appendChild(label);
      bar.addEventListener('mouseenter', () => displayInfo(course.id));
      chartContainer.appendChild(bar);
    });
  }

  columnVert(courses, thickness) {
    const chartText = document.getElementById('chartText');
    chartContainer.classList.remove('column-chartH');
    chartContainer.classList.add('column-chart');

    courses.forEach(course => {
      const column = document.createElement('div');
      const label = document.createElement('div');
      const coursePerc = (course.completedHours() / this.total) * 100;
      column.classList.add('column');
      column.style.height = `${coursePerc}%`;
      column.style.width = `${thickness}%`;
      column.style.backgroundColor = invertedBigColor(coursePerc);
      label.classList.add('column-label');
      label.textContent = abbreviatedName(course.name);

      column.appendChild(label);
      column.addEventListener('mouseenter', () => {
        displayInfo(course.id);
        column.style.backgroundColor = bigColor(coursePerc);
      });

      column.addEventListener(
        'mouseleave',
        () => (column.style.backgroundColor = invertedBigColor(coursePerc))
      );
      chartContainer.addEventListener(
        'mouseleave',
        () => (chartText.textContent = 'Hours Completed')
      );
      chartContainer.appendChild(column);
    });
  }
}

function renderCourses() {
  courseUL.innerHTML = '';

  const selectedType = document.getElementById('displayType').value;
  let renderMethod;
  if (selectedType === 'basic-display') {
    renderMethod = course => course.renderSimple();
  } else if (selectedType === 'text-display') {
    renderMethod = course => course.render();
  }

  state.displayCourses.forEach(course => {
    renderMethod(course);
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

displayType.addEventListener('change', renderCourses);

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
    state.hiddenCourses.forEach(course => {
      state.displayCourses.push(course);
    });
    state.hiddenCourses = [];
  } else {
    state.displayCourses.forEach(course => {
      if (course.progress === 100) {
        state.hiddenCourses.push(course);
      }
    });
    state.displayCourses = state.displayCourses.filter(
      course => course.progress !== 100
    );
  }
  renderCourses();
}

//COLOR SCHEME
colorScheme.addEventListener('change', () => {
  document.body.classList.remove('dark');
  document.body.classList.remove('simple');
  document.body.classList.remove('colorful');
  let currentColorScheme = colorScheme.value;

  document.body.classList.add(`${currentColorScheme}`);
});

//ADD AND REMOVE COURSES
addNew.addEventListener('click', () => newCourse());

addLink.addEventListener('click', () => newCourse());

viewResults.addEventListener('click', () => scrollDown());

function handleMediaQuery(e) {
  if (e.matches) {
    addCmodal.classList.add('small-modal');
  } else {
    addCmodal.classList.remove('small-modal');
  }
}

function scrollDown() {
  pieChart.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

function newCourse() {
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
}

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

function removeCourse(id, hours) {
  state.total -= hours;
  state.courses = state.courses.filter(course => course.id !== id);
  state.displayCourses = state.displayCourses.filter(
    course => course.id !== id
  );
  state.hiddenCourses = state.hiddenCourses.filter(course => course.id !== id);
  if (state.courses.length === 0) {
    samplePrompt();
  }
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
  const course = array.find(course => course.id === id);
  if (course) {
    course.progress = 0;
  }
}

//EDIT COURSE
function editCourse(id) {
  state.currentEdit = id;
  const course = state.courses.find(course => course.id === id);
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
      array => {
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

//CLOSE AND RESET MODALS
closeModal.addEventListener('click', () => {
  addCmodal.style.display = 'none';
  resetModalValues();
});
closeEdit.addEventListener('click', () => {
  editCmodal.style.display = 'none';
  resetModalValues();
});
closeLogin.addEventListener('click', () => {
  loginModal.style.display = 'none';
  resetModalValues();
});

window.onclick = event => {
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
  document.getElementById('emailText').value = '';
  document.getElementById('passwordText').value = '';
}

//API CALLS
sampleLink.addEventListener('click', () => {
  console.log('click');
  const apiUrl = config.API_URL;
  axios
    .get(apiUrl)
    .then(response => {
      const courses = response.data.courses;
      console.log(courses);
      courses.forEach(
        courses =>
          new CourseItem(courses.name, courses.totalHours, courses.progress)
      );
      console.log(state.courses, state.displayCourses);
      toggleCompleted();
    })
    .catch(error => {
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
    .then(response => console.log('Success:', response.data))
    .catch(error => console.error('Error:', error));
});

//STARTUP DISPLAY
function samplePrompt() {
  ultraCont.classList.add('sampler');
  pieChart.style.display = 'none';
  messageCont.style.display = 'flex';

  topCont.style.marginBottom = '0rem';
  smallMode.removeEventListener('change', handleMediaQuery);
  addCmodal.classList.remove('small-modal');
}
function sampleClose() {
  ultraCont.classList.remove('sampler');
  pieChart.style.display = 'flex';
  messageCont.style.display = 'none';
  smallMode.addEventListener('change', handleMediaQuery);
  handleMediaQuery(smallMode);
}

//RESULT SECTION
function completed() {
  let compPercent = 0,
    compRemPercent = 0,
    compRemHours = 0,
    compTotHours = 0;

  state.courses.forEach(course => {
    compTotHours += course.completedHours();
    compRemHours += course.remainingHours();
  });

  if (compTotHours !== 0) {
    compPercent = Math.round((compTotHours / state.total) * 10000) / 100;
    compRemPercent = 100 - compPercent;
  }

  resCurHours.textContent = compTotHours.toFixed(2);
  resTotHours.textContent = state.total.toFixed(2);
  resRemHours.textContent = compRemHours.toFixed(2);
  resCompPerc.textContent = `${compPercent.toFixed(2)}`;
  resRemPerc.textContent = `${compRemPercent.toFixed(2)}`;

  resCurHours.style.color = bigColor(state.total);
  resTotHours.style.color = invertedBigColor(compTotHours);
  resRemHours.style.color = bigColor(compRemHours);
  resCompPerc.style.color = percentColor(compPercent);
  resRemPerc.style.color = percentColor(compRemPercent);

  updatePie(compPercent, compRemPercent);
  if (state.courses.length >= 3) {
    const columnCreate = new Column(state);
  }
}
function updatePie(percentage, remPercent) {
  const degrees = (percentage / 100) * 360;
  const color = percentColor(percentage);
  const remColor = percentColor(remPercent);
  pieChart.style.setProperty('--percent', `${degrees}deg`);
  pieChart.style.setProperty('--color', color);
  pieChart.style.setProperty('--color2', remColor);
  pieLabel.textContent = `${percentage} %`;
}
function displayInfo(id) {
  const course = state.courses.find(course => course.id === id);
  const chartText = document.getElementById('chartText');
  chartText.innerHTML = '';

  const percentage = document.createElement('span');
  percentage.textContent = `   (${course.percent()}%)`;
  percentage.style.color = percentColor(course.percent());

  const hours = document.createElement('span');
  hours.textContent = ` -  ${course.completedHours()} hours`;
  hours.style.color = bigColor(course.completedHours());
  chartText.textContent = `${course.name}`;
  chartText.appendChild(hours);
  chartText.appendChild(percentage);
}
samplePrompt();
completed();
