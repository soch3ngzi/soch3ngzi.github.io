document.addEventListener('DOMContentLoaded', () => {
    const calendarDates = document.getElementById('calendar-dates');
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    const logEntries = document.querySelectorAll('.log-entry');
    const postDatesData = JSON.parse(document.getElementById('post-dates').textContent);
    const datesWithPosts = new Set(postDatesData);

    let currentDate = new Date();
    let selectedDate = null; // Track the currently selected date

    // Populate year and month selects
    function populateSelects() {
        const currentYear = currentDate.getFullYear();
        for (let i = currentYear - 10; i <= currentYear + 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
        yearSelect.value = currentYear;

        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i + 1}月`;
            monthSelect.appendChild(option);
        }
        monthSelect.value = currentDate.getMonth();
    }

    function renderCalendar(displayYear = yearSelect.value, displayMonth = monthSelect.value) {
        calendarDates.innerHTML = '';
        
        // Update currentDate to reflect the displayed month/year for consistent internal state
        currentDate.setFullYear(displayYear);
        currentDate.setMonth(displayMonth);

        // Update select values to reflect the current view
        yearSelect.value = displayYear;
        monthSelect.value = displayMonth;

        const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const weekdayHeader = document.createElement('div');
            weekdayHeader.classList.add('weekday-header');
            weekdayHeader.textContent = day;
            calendarDates.appendChild(weekdayHeader);
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            calendarDates.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateCell = document.createElement('div');
            dateCell.classList.add('calendar-date');
            dateCell.textContent = i;

            const fullDate = `${displayYear}-${String(parseInt(displayMonth) + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            if (datesWithPosts.has(fullDate)) {
                dateCell.classList.add('has-posts');
            }

            if (selectedDate === fullDate) {
                dateCell.classList.add('active');
            }

            dateCell.addEventListener('click', () => {
                if (selectedDate === fullDate) {
                    selectedDate = null; // Deselect if already selected
                } else {
                    selectedDate = fullDate;
                }
                renderCalendar(yearSelect.value, monthSelect.value); // Re-render to update selection highlight
                filterPostsByDate(selectedDate);
            });

            calendarDates.appendChild(dateCell);
        }
    }

    function filterPostsByDate(date) {
        logEntries.forEach(entry => {
            const postDate = entry.querySelector('.post-meta').textContent.split(': ')[1];
            if (!date || postDate === date) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    }

    // Event Listeners for select changes
    yearSelect.addEventListener('change', () => {
        renderCalendar(yearSelect.value, monthSelect.value);
        filterPostsByDate(selectedDate);
    });

    monthSelect.addEventListener('change', () => {
        renderCalendar(yearSelect.value, monthSelect.value);
        filterPostsByDate(selectedDate);
    });

    populateSelects();
    renderCalendar();
    filterPostsByDate(null); // Show all posts initially

    // Event Listener for log list title to clear filter
    document.getElementById('log-list-title').addEventListener('click', () => {
        selectedDate = null;
        const activeDate = document.querySelector('.calendar-date.active');
        if (activeDate) {
            activeDate.classList.remove('active');
        }
        filterPostsByDate(null);
    });
});
