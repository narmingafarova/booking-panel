import { staff } from "./data/staff.js";
import { service } from "./data/service.js";

//* 1. Set all the cards for staff members
const staff_panel_body = document.querySelector(".staff-panel-body");

// Create a staff card for staff members
const staff_card = staff
  .map((item) => {
    return `<div class="panel-card staff-card" id="staff-${item.id}">
        <div class="card-img">
          <img src=${item.image} alt="staff" />
        </div>
        <div class="card-info">
          <h4 class="card-name">${item.name}</h4>
          <p class="card-email">${item.email}</p>
        </div>
      </div>`;
  })
  .join("");

staff_panel_body.innerHTML += staff_card;

// Empty check for all pages
let emptyStatus = false;
let selectedStaff = [];
let selectedService = null;
let currentStep = 0;

//* Choose one of the staff members
const selected_staff = document.querySelectorAll(".staff-card");
const menu_li = document.querySelectorAll(".menu li");
const back_btn = document.querySelectorAll(".back-btn");
const next_btn = document.querySelectorAll(".next-btn");
const panel_alert = document.querySelectorAll(".panel-alert");

// For pagination
function setPage(num) {
  var pages = document.getElementsByClassName("section-panel");
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = "none"; // make all panels unvisible
  }
  document.getElementById("panel-" + num).style.display = "block"; // selected panel will be visible
}

// First page will be first panel
setPage(1);

// For changing sidebar menu items when pages change
const changePage = (i) => {
  menu_li[i + 1].classList.add("active-li");
  menu_li[i].classList.add("complete-li");
  setPage(i + 2);
  emptyStatus = false;
};

// For following the information selected for each step
const stepData = {
  0: { staff: null },
  1: { service: null },
  2: { date: null, time: null },
};

let staffName;
let serviceData = [];
let previousStep = -1; // Initialize with an invalid step index

// Handle div selection
const selectedFunc = (section, step) => {
  section.forEach((div) => {
    div.addEventListener("click", () => {
      const id = div.id.split("-")[1];

      // Remove "selected" class from all divs
      section.forEach((d) => d.classList.remove("selected"));

      if (step === 0) {
        // When the current page is a staff page
        selectedStaff = [id];
        stepData[step].staff = selectedStaff;

        // Reset selected service when changing staff selection
        selectedService = null;
        stepData[step + 1].service = null;

        // Reset selected date and time when changing staff selection
        stepData[step + 2] = { date: null, time: null };
        selected_day = null;
        selectedDiv = null;

        // Remove "selected" class from the previously selected div in the second step
        const selectedServiceDiv = document.querySelector(
          ".service-card.selected"
        );
        if (selectedServiceDiv) {
          selectedServiceDiv.classList.remove("selected");
        }
        // To retrieve the data of the selected staff, we set the data with id
        const staffInfo = staff.find((member) => member.id == id);
        staffName = staffInfo.name;
      } else if (step === 1) {
        // When the current page is a service page
        selectedService = [id];
        stepData[step].service = selectedService;

        // To retrieve the data of the selected service, we set the data with id
        const serviceInfo = service.find((service) => service.id == id);
        serviceData = [serviceInfo.name, serviceInfo.price];

        // Remove "selected-day" class from all day boxes
        const allDayBoxes = document.querySelectorAll(".day-box");
        allDayBoxes.forEach((dayBox) => {
          dayBox.classList.remove("selected-day");
        });
        // If nothing is selected in the calendar, the time intervals in the time grid are also reset
        document.querySelector(".time-grid").innerHTML = "";
        document.querySelector("#timeSelect").textContent = "Select date";
      }
      div.classList.add("selected");
      emptyStatus = true;
      changePage(step);
      // Set the current page as this page
      currentStep = step;
    });
  });
};

selectedFunc(selected_staff, 0);

// * 2. Set all the cards for services
const service_panel_body = document.querySelector(".service-panel-body");

const service_card = service
  .map((item) => {
    return ` <div class="panel-card service-card" id="service-${item.id}">
      <div class="info-part">
        <div class="card-img">
          <img src=${item.image} alt="${item.name}" />
        </div>
        <div class="card-info">
          <h4 class="card-name">${item.name}</h4>
          <p class="card-email">${item.duration}</p>
        </div>
      </div>
      <p class="price">${item.price}$</p>
    </div>`;
  })
  .join("");

service_panel_body.innerHTML += service_card;
const selected_service = document.querySelectorAll(".service-card");
selectedFunc(selected_service, 1);

// * 3. Select data and time for registration
const prev_month_btn = document.querySelector("#prev");
const next_month_btn = document.querySelector("#next");
const current_date = document.querySelector("#currentDate");
const calendar_view = document.querySelector("#calendarView");
const time_select = document.querySelector("#timeSelect");
const time_grid = document.querySelector(".time-grid");

// Available dates for the calendar
const date = [
  "2023-08-04",
  "2023-08-07",
  "2023-08-10",
  "2023-07-06",
  "2023-07-13",
];

const availableTimes = (day) => {
  return [
    {
      start_time: day + 4 > 9 ? `${day + 4}:00` : `0${day + 4}:00`,
      end_time: day + 5 > 9 ? `${day + 4}:30` : `0${day + 4}:30`,
    },
    {
      start_time: day + 4 > 9 ? `${day + 4}:30` : `0${day + 4}:30`,
      end_time: day + 5 > 9 ? `${day + 5}:00` : `0${day + 5}:00`,
    },
  ];
};

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// prettier-ignore
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let selected_day;
let selectedDiv = null;

function updateCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1);
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDay.getDay();

  // To show month and year as title in calendar
  current_date.textContent = `${months[firstDay.getMonth()]} ${currentYear}`;

  calendar_view.innerHTML = "";

  // An empty div for weekdays up to the first day of the month
  for (let i = 0; i < startDay; i++) {
    const emptyDay = document.createElement("div");
    calendar_view.appendChild(emptyDay);
  }

  // To return result in year-month-day format
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // A div for each according to the number of days of the month
  for (let i = 1; i <= totalDays; i++) {
    const dayBox = document.createElement("div");
    dayBox.textContent = i;
    dayBox.classList.add("day-box");

    // Check if the current date is in the array of available dates
    const currentDate = new Date(currentYear, currentMonth, i);
    const currentDateStr = formatDate(currentDate);

    if (date.includes(currentDateStr)) {
      dayBox.classList.add("special-day");
    }
    calendar_view.appendChild(dayBox);
  }

  // Note Data
  const staff_name = document.getElementById("staff-name");
  const service_name = document.getElementById("service-name");
  const reserv_date = document.getElementById("reserv-date");
  const price = document.getElementById("price");

  // To display the selected options in the last confirmation panel
  const noteContent = () => {
    staff_name.textContent = staffName;
    service_name.textContent = serviceData[0];
    price.textContent = "$" + serviceData[1];
    reserv_date.textContent =
      selected_day + "/" + selectedDiv.innerText.split(" ").join("-");
  };

  const day_box = document.querySelectorAll(".day-box");

  // It works when you want to select a day from the calendar
  calendar_view.addEventListener("click", (e) => {
    const dayBox = e.target;
    // If selected day is available
    if (dayBox.classList.contains("special-day")) {
      // prettier-ignore
      day_box.forEach((day) => { day.classList.remove("selected-day") });
      // To highlight the selected day
      dayBox.classList.add("selected-day");
      const selectedDay = parseInt(dayBox.textContent);
      const date = new Date(currentYear, currentMonth, selectedDay);
      // The selected date appears as the title in the timeline
      time_select.textContent = formatDate(date);
      selected_day = formatDate(date);
      const time = availableTimes(selectedDay);
      time_grid.innerHTML = "";
      // When a day is selected, the appropriate hours for that day are displayed
      time.forEach((time) => {
        const timeItem = document.createElement("div");
        timeItem.textContent = `${time.start_time} ${time.end_time}`;
        time_grid.appendChild(timeItem);
      });
      const time_grid_div = document.querySelectorAll(".time-grid div");
      // Select a time from the time panel
      for (let i = 0; i < time_grid_div.length; i++) {
        time_grid_div[i].addEventListener("click", () => {
          if (selectedDiv) {
            selectedDiv.style.backgroundColor = "#ECEFF2";
          }
          // Reset selected values and styles for third step
          if (currentStep === 2) {
            selected_day = null;
            selectedDiv = null;
            time_grid_div.forEach((timeDiv) => {
              timeDiv.style.backgroundColor = "#ECEFF2";
            });
          }
          time_grid_div[i].style.backgroundColor = "#53D56C";
          selectedDiv = time_grid_div[i];
          // Reset input values for last step
          document.getElementById("name").value = "";
          document.getElementById("last").value = "";
          document.getElementById("email").value = "";
          document.getElementById("phone").value = "";
          emptyStatus = true;
          changePage(2);
          noteContent();
        });
      }
    }
  });
}

prev_month_btn.addEventListener("click", () => {
  if (currentMonth === 0) {
    // If the current month is January, select December as the previous month and go back 1 year
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--; // Go back 1 month from the current month
  }
  updateCalendar();
});

next_month_btn.addEventListener("click", () => {
  if (currentMonth === 11) {
    // If the current month is December, select January as the next month and move on to the next year
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++; // Go from the current month to the next month
  }
  updateCalendar();
});

updateCalendar();

// * Confirm details for registration
const confirm_form = document.querySelector("#confirmForm");
const confirm_btn = document.querySelector(".confirm-btn");
const name = document.getElementById("name");
const surname = document.getElementById("last");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

const modal = document.getElementById("modal");
const close_btn = document.querySelector(".close");
const confirm_msg = document.getElementById("confirm-message");

const formSubmit = (e) => {
  e.preventDefault();
  // Check that the inputs are empty
  if (!name.value || !surname.value || !email.value || !phone.value) {
    modal.style.display = "block";
    confirm_msg.textContent = "Please, fill the all required fields!";
    confirm_msg.style.color = "#f39c12";
  } else {
    setPage(1);

    // Clear selected staff and service classes
    selected_staff.forEach((staffDiv) => {
      staffDiv.classList.remove("selected");
    });
    selected_service.forEach((serviceDiv) => {
      serviceDiv.classList.remove("selected");
    });

    // Reset the calendar view
    calendar_view.querySelectorAll(".day-box").forEach((dayBox) => {
      dayBox.classList.remove("selected-day");
    });
    time_grid.querySelectorAll(".time-grid div").forEach((timeDiv) => {
      timeDiv.style.display = "none";
    });

    // Reset the sidebar menu list
    menu_li.forEach((item) => {
      item.classList.remove("complete-li");
      item.classList.remove("active-li");
    });
    menu_li[0].classList.add("active-li");

    modal.style.display = "block";
    confirm_msg.textContent = "Confirmation successfully completed!";
    confirm_msg.style.color = "#38cf78";

    // Result object
    const obj = {
      staff_id: selectedStaff[0],
      service_id: selectedService[0],
      date: selected_day,
      time: selectedDiv.innerText,
      customer: {
        name: name.value,
        surname: surname.value,
        email: email.value,
        phone: phone.value,
      },
    };
    console.log(obj);

    // Reset the form inputs
    name.value = "";
    surname.value = "";
    email.value = "";
    phone.value = "";

    // Reset other data and UI elements
    selectedStaff = [];
    selectedService = null;
    selectedDiv = null;
    currentStep = 0;
  }
};

// To close the modal
const modalClose = () => {
  modal.classList.add("fade-out"); // Apply fade-out animation
  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("fade-out"); // Remove animation class
  }, 300); // Animation duration in milliseconds
};

// Click close icon to close the modal
close_btn.addEventListener("click", () => {
  modalClose();
});

// Click outside the modal content to close the modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modalClose();
  }
});

// Both of them (confirm button and enter) for submitting
confirm_btn.addEventListener("click", formSubmit);
confirm_form.addEventListener("submit", formSubmit);

// For back button click
for (let i = 0; i < back_btn.length; i++) {
  back_btn[i].onclick = () => {
    menu_li[i + 1].classList.remove("active-li");
    menu_li[i].className = "active-li";
    setPage(i + 1);
    emptyStatus = true;
  };
}

// For next button click
for (let i = 0; i < next_btn.length; i++) {
  next_btn[i].onclick = () => {
    // Check if the option is selected on the current page
    if (!emptyStatus) {
      panel_alert[i].style.display = "flex";
      setTimeout(() => {
        panel_alert[i].style.opacity = "1";
      }, 10);

      setTimeout(() => {
        panel_alert[i].style.opacity = "0";
        setTimeout(() => {
          panel_alert[i].style.display = "none";
        }, 500);
      }, 1500);
    } else {
      // For first two panel
      if (i === 0 || i === 1) {
        if (currentStep === 0) {
          selectedService = null;
          stepData[i + 1].service = null;
        }
        stepData[i + 1] = { date: null, time: null };
        selectedDiv = null;
      }
      changePage(i);
      emptyStatus = true;
    }
  };
}
