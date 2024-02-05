function getColor(hours) {
  hours = Math.round(hours);
  return hours === 0
    ? 'var(--text-color)'
    : hours <= 5
    ? 'var(--primary-color)'
    : hours <= 15
    ? 'var(--yellow-color)'
    : hours <= 25
    ? 'var(--secondary-color)'
    : hours <= 35
    ? 'var(--maroon-color)'
    : 'var(--red-color)';
}

function bigColor(hours) {
  hours = Math.round(hours);
  return hours === 0
    ? 'var(--text-color)'
    : hours <= 25
    ? 'var(--primary-color)'
    : hours <= 55
    ? 'var(--teal-color)'
    : hours <= 95
    ? 'var(--secondary-color)'
    : hours <= 125
    ? 'var(--yellow-color)'
    : hours <= 175
    ? 'var(--maroon-color)'
    : 'var(--red-color)';
}

function invertedBigColor(hours) {
  hours = Math.round(hours);
  return hours >= 176
    ? 'var(--teal-color)'
    : hours >= 126
    ? 'var(--secondary-color)'
    : hours >= 56
    ? 'var(--yellow-color)'
    : hours >= 26
    ? 'var(--maroon-color)'
    : hours > 0
    ? 'var(--red-color)'
    : 'var(--primary-color)';
}

function percentColor(percent) {
  percent = Math.round(percent);
  return percent === 100
    ? 'var(--text-color)'
    : percent >= 80
    ? 'var(--primary-color)'
    : percent >= 60
    ? 'var(--teal-color)'
    : percent >= 40
    ? 'var(--yellow-color)'
    : percent >= 21
    ? 'var(--secondary-color)'
    : percent >= 1
    ? 'var(--maroon-color)'
    : 'var(--red-color)';
}

function invertedPercentColor(percent) {
  percent = Math.round(percent);
  return percent < 1
    ? 'var(--text-color)'
    : percent <= 20
    ? 'var(--primary-color)'
    : percent <= 39
    ? 'var(--teal-color)'
    : percent <= 59
    ? 'var(--yellow-color)'
    : percent <= 79
    ? 'var(--secondary-color)'
    : percent <= 90
    ? 'var(--maroon-color)'
    : 'var(--red-color)';
}

export {
  getColor,
  bigColor,
  invertedBigColor,
  percentColor,
  invertedPercentColor,
};
