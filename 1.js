class Column {
  constructor(state) {
    if (state.courses.length >= 3) {
      this.total = state.total;
      this.sortedCourses = [...state.courses].sort((a, b) => {
        const percA = (a.completedHours() / total) * 100;
        const percB = (b.completedHours() / total) * 100;
        return percB - percA;
      });

      this.numberOfCourses = this.sortedCourses.length;
      this.cWidth = Math.max(100 / (2 * this.numberOfCourses), 5);
      this.columnHoriz(this.sortedCourses, this.cWidth);
    }
  }
  columnHoriz(courses, width) {
    courses.forEach(course => {
      const bar = document.createElement('div');
      const label = document.createElement('div');
      const coursePerc = (course.completedHours() / total) * 100;
      bar.classList.add('column');
      bar.style.width = `${coursePerc}`;
      bar.style.height = `${width}`;
      bar.style.backgroundColor = `${invertedBigColor(coursePerc)}`;
      label.classList.add('column-label hLabel');
      label.textContent = abbreviatedName(course.name);
      label.style.position = 'absolute';
      label.style.left = '0';

      bar.appendChild(label);
      bar.addEventListener('mouseenter', () => displayInfo(course.id));
      chartContainer.appendChild(bar);
    });
  }
  columnVert(courses) {
    courses.forEach(course => {
      this.column = document.createElement('div');
      this.label = document.createElement('div');
      this.coursePerc = (course.completedHours() / this.total) * 100;
      column.classList.add('column');
      column.style.height = `${coursePerc}%`;
      column.style.width = `${columnWidth}%`;
      column.style.backgroundColor = `${invertedBigColor(coursePerc)}`;
      label.classList.add('column-label');
      label.textContent = abbreviatedName(course.name);

      column.appendChild(label);

      column.addEventListener('mouseenter', () => displayInfo(course.id));

      chartContainer.appendChild(column);
    });
  }
}
