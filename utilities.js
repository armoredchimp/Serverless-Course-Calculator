function slightAbbrev(name, val) {
  if (name.length > val) {
    return name.substring(0, val) + '...';
  } else {
    return name;
  }
}

function padString(value) {
  let string = value.toString();
  switch (string.length) {
    case 1:
      string = string + '&nbsp;&nbsp;';
      return string;
    case 2:
      string = string + '&nbsp;';
      return string;
    default:
      return string;
  }
}
function padStringFront(value) {
  let string = value.toString();
  switch (string.length) {
    case 3:
      string = '00' + string;
      return string;
    case 4:
      string = '0' + string;
      return string;
    default:
      return string;
  }
}
function abbreviatedName(name) {
  const adjustedName = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  const capitalizedMatches = adjustedName.match(/[A-Z]/g) || [];

  if (capitalizedMatches.length >= 2) {
    return capitalizedMatches.slice(0, 3).join('');
  } else {
    return name.substring(0, 4);
  }
}
function updateArray(array, id, name, totalHours, progress) {
  const courseIndex = array.findIndex(course => course.id === id);
  if (courseIndex !== -1) {
    array[courseIndex].name = name;
    array[courseIndex].totalHours = totalHours;
    array[courseIndex].progress = progress;
  }
}
function validateEmail(email) {
  return /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email);
}
function validatePassword(password) {
  const longEnough = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar =
    /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\'\:\"\,\<\.\>\/\?\|\\~`]/.test(
      password
    );

  return longEnough && hasLower && hasUpper && hasNumber && hasSpecialChar;
}
export {
  slightAbbrev,
  padString,
  padStringFront,
  abbreviatedName,
  updateArray,
  validateEmail,
  validatePassword,
};
