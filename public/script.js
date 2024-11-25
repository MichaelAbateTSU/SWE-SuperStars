const studentDataAPI = "http://localhost:3000/students/1";
const cityDataAPI = "http://localhost:3000/cities";
let amountOfLocations = 0;
let citiesAndStates = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadStudentData();
  await fetchCityData();
  validateForm(); // Initial validation
  toggleSubmitButton(); // Ensure the submit button is in the correct state on load

  // Add event listener for each input and text area field to validate on input
  const inputFields = document.querySelectorAll("input, textarea");
  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      toggleSubmitButton(); // Update button state on input change
    });
  });

  // Add event listener for adding a desired location chip
  document
    .getElementById("confirm-desired-location")
    .addEventListener("click", () => {
      addLocationChip();
      toggleSubmitButton(); // Update button state after adding a location
      // clear the input field after adding a location and hide the confirm button
      document.getElementById("desired-location-input").value = "";
      document.getElementById("confirm-desired-location").style.display =
        "none";
    });
});

function toggleSubmitButton() {
  const submitButton = document.querySelector(".submit-button button");

  if (validateForm()) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "black"; // Optional: for visual cues
    submitButton.style.cursor = "pointer";
  } else {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#6c757d"; // Optional: for visual cues
    submitButton.style.cursor = "not-allowed";
  }
}

async function loadStudentData() {
  try {
    const response = await fetch(studentDataAPI);
    const student = await response.json();

    // Populate form fields with data
    document.getElementById("first-name-input").value = student.first_name;
    document.getElementById("last-name-input").value = student.last_name;
    document.getElementById("email-input").value = student.email;
    document.getElementById("phone-number-input").value = student.phone;
    document.getElementById("role-summary-input").value = student.role_summary;
    document.getElementById("employment-info-input").value = student.employers;
    const desiredLocations = student.desired_locations.split(" - ");
    populateDesiredLocations(desiredLocations);
    document.getElementById("skills-input").value = student.skills;
    document.getElementById("education-history-input").value =
      student.education_history;
  } catch (error) {
    console.error("Error loading student data:", error);
  }
}

async function fetchCityData() {
  try {
    const response = await fetch(cityDataAPI);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    citiesAndStates = data.map((city) => `${city.city}, ${city.stateISO}`);
  } catch (error) {
    console.error("Error fetching city data:", error);
  }
}

function populateDesiredLocations(locations = []) {
  const desiredLocationContainer = document.getElementById(
    "desired-location-container"
  );
  desiredLocationContainer.innerHTML = ""; // Clear existing items

  if (locations.length === 0) {
    const noLocation = document.createElement("span");
    noLocation.textContent = "No location selected";
    desiredLocationContainer.appendChild(noLocation);
    return;
  }

  locations.forEach((location) => addLocationChip(location));
}

// Handle form submission to save changes
document
  .querySelector(".submit-button button")
  .addEventListener("click", async () => {
    const formIsValid = validateForm();

    // Validate the whole form before submission
    if (!formIsValid) {
      alert("Please correct the errors in the form.");
      return; // Prevent form submission if email is invalid
    }

    const updatedStudent = {
      first_name: document.getElementById("first-name-input").value,
      last_name: document.getElementById("last-name-input").value,
      email: document.getElementById("email-input").value,
      phone: document.getElementById("phone-number-input").value,
      role_summary: document.getElementById("role-summary-input").value,
      employers: document.getElementById("employment-info-input").value,
      desired_locations: getDesiredLocations(),
      skills: document.getElementById("skills-input").value,
      education_history: document.getElementById("education-history-input")
        .value,
    };

    try {
      const response = await fetch(studentDataAPI, {
        method: "PUT", // Update student with id=1
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });

      if (response.ok) {
        alert("Changes saved successfully!");
      } else {
        alert("Error saving changes.");
      }
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  });

function getDesiredLocations() {
  const locationChips = document.querySelectorAll(".location-chip");
  const locations = [];

  locationChips.forEach((chip) => {
    const removeBtn = chip.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.remove(); // Remove the remove button before saving
    }
    locations.push(chip.textContent);
    // Add the remove button back to the chip for UI
    chip.appendChild(removeBtn);
  });

  return locations.join(" - ");
}

// Function to validate the entire form
function validateForm() {
  // TODO: Add validation for all fields, then uncomment the lines below

  const firstNameValid = validateFirstName();
  const lastNameValid = validateLastName();
  const emailValid = validateEmail();
  const phoneNumberValid = validatePhoneNumber();
  const roleSummaryValid = validateRoleSummary();
  const employmentInfoValid = validateEmploymentInfo();
  const desiredLocationValid = validateDesiredLocation();
  const skillsValid = validateSkills();
  const educationHistoryValid = validateEducationHistory();

  return (
    firstNameValid &&
    lastNameValid &&
    emailValid &&
    phoneNumberValid &&
    desiredLocationValid &&
    roleSummaryValid &&
    employmentInfoValid &&
    skillsValid &&
    educationHistoryValid
  );
}

// Function to validate the first name field
function validateFirstName() {
  const firstNameInput = document.getElementById("first-name-input");
  const firstNameError = document.getElementById("first-name-error");
  const firstNameValue = firstNameInput.value.trim();

  // Regular expression for alphabetic characters only
  const nameRegex = /^[A-Za-z]+$/;

  if (!firstNameValue) {
    firstNameError.textContent = "First name is required.";
    firstNameError.style.display = "flex";
    return false;
  } else if (!nameRegex.test(firstNameValue)) {
    firstNameError.textContent =
      "First name can only contain alphabetic characters.";
    firstNameError.style.display = "flex";
    return false;
  } else if (firstNameValue.length > 150) {
    firstNameError.textContent = "First name cannot exceed 150 characters.";
    firstNameError.style.display = "flex";
    return false;
  } else {
    firstNameError.style.display = "none";
    return true;
  }
}

// Function to validate the last name field
function validateLastName() {
  const lastNameInput = document.getElementById("last-name-input");
  const lastNameError = document.getElementById("last-name-error");
  const lastNameValue = lastNameInput.value.trim();

  // Regular expression for alphabetic characters only
  const nameRegex = /^[A-Za-z]+$/;

  if (!lastNameValue) {
    lastNameError.textContent = "Last name is required.";
    lastNameError.style.display = "flex";
    return false;
  } else if (!nameRegex.test(lastNameValue)) {
    lastNameError.textContent =
      "Last name can only contain alphabetic characters.";
    lastNameError.style.display = "flex";
    return false;
  } else if (lastNameValue.length > 150) {
    lastNameError.textContent = "Last name cannot exceed 150 characters.";
    lastNameError.style.display = "flex";
    return false;
  } else {
    lastNameError.style.display = "none";
    return true;
  }
}

// Function to validate the email field
function validateEmail() {
  const emailInput = document.getElementById("email-input");
  const emailError = document.getElementById("email-error");
  const emailValue = emailInput.value;

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/;

  // Check if email is empty or not in a valid format
  if (!emailValue) {
    emailError.textContent = "Email is required.";
    emailError.style.display = "flex";
    return false;
  } else if (!emailRegex.test(emailValue)) {
    emailError.textContent =
      "Please enter a valid email address (e.g., example@domain.com).";
    emailError.style.display = "flex";
    return false;
  } else {
    emailError.style.display = "none";
    return true;
  }
}

//Function to validate the phone number field
function validatePhoneNumber() {
  const phoneInput = document.getElementById("phone-number-input");
  const phoneError = document.getElementById("phone-number-error");
  const phoneValue = phoneInput.value;

  // Regular expression for validating local and international phone numbers
  const phoneRegex = /^(?:\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;

  // Check if phone number is empty
  if (!phoneValue) {
    phoneError.textContent = "Phone number is required.";
    phoneError.style.display = "flex";
    return false;
  }
  // Check if phone number meets format and length requirements
  else if (
    !phoneRegex.test(phoneValue) ||
    phoneValue.replace(/\D/g, "").length < 10
  ) {
    phoneError.textContent =
      "Please enter a valid phone number (e.g., 123-456-7890)";
    phoneError.style.display = "flex";
    return false;
  } else {
    phoneError.style.display = "none";
    return true;
  }
}

// Validate desired location input
function validateDesiredLocation() {
  const desiredLocationInput = document.getElementById(
    "desired-location-input"
  );
  const locationError = document.getElementById("desired-location-error");
  const locationValue = desiredLocationInput.value.trim();

  const confirmLocationBtn = document.getElementById(
    "confirm-desired-location"
  );

  if (locationValue.length > 2 && citiesAndStates.includes(locationValue)) {
    confirmLocationBtn.style.display = "flex";
  } else {
    confirmLocationBtn.style.display = "none";
  }

  if (amountOfLocations === 0) {
    locationError.textContent = "At least one location is required.";
    locationError.style.display = "flex";
    return false;
  } else if (locationValue && !citiesAndStates.includes(locationValue)) {
    locationError.textContent =
      "Invalid location. Please enter a valid city and state (e.g., 'Chicago, IL').";
    locationError.style.display = "flex";
    return false;
  } else {
    locationError.style.display = "none";
    return true;
  }
}

// Function to validate the role summary field
function validateRoleSummary() {
  const roleSummaryInput = document.getElementById("role-summary-input");
  const roleSummaryError = document.getElementById("role-summary-error");
  const roleSummaryValue = roleSummaryInput.value.trim();

  // Regular expression to allow alphanumeric characters, spaces, and standard punctuation
  const roleSummaryRegex = /^[a-zA-Z0-9\s.,'?!-]+$/;

  if (!roleSummaryValue) {
    roleSummaryError.textContent = "Role summary is required.";
    roleSummaryError.style.display = "flex";
    return false;
  } else if (roleSummaryValue.length < 10 || roleSummaryValue.length > 200) {
    roleSummaryError.textContent =
      "Role summary must be between 10 and 200 characters.";
    roleSummaryError.style.display = "flex";
    return false;
  } else if (!roleSummaryRegex.test(roleSummaryValue)) {
    roleSummaryError.textContent =
      "Role summary contains invalid characters. Please use only letters, numbers, spaces, and standard punctuation.";
    roleSummaryError.style.display = "flex";
    return false;
  } else {
    roleSummaryError.style.display = "none";
    return true;
  }
}

// Function to validate the employment info field
function validateEmploymentInfo() {
  const employmentInfoInput = document.getElementById("employment-info-input");
  const employmentInfoError = document.getElementById("employment-info-error");
  const employmentInfoValue = employmentInfoInput.value.trim();

  // Regular expression for validating the employment information format
  const employmentInfoRegex = /^[a-zA-Z0-9\s.,'?!-;]+$/;

  // Presence Check: Ensure the Employment Info field is not empty
  if (!employmentInfoValue) {
    employmentInfoError.textContent = "Employment info is required.";
    employmentInfoError.style.display = "flex";
    return false;
  }

  // Length Validation: Minimum and maximum character limit (30-200 characters)
  if (employmentInfoValue.length < 30 || employmentInfoValue.length > 200) {
    employmentInfoError.textContent =
      "Employment info must be between 30 and 200 characters.";
    employmentInfoError.style.display = "flex";
    return false;
  }

  // Content Validation: Ensure the employment info follows the specified format
  if (!employmentInfoRegex.test(employmentInfoValue)) {
    employmentInfoError.textContent =
      "Employment info format is invalid. Ensure it follows the required format with commas and semicolons.";
    employmentInfoError.style.display = "flex";
    return false;
  }

  // If all validations pass
  employmentInfoError.style.display = "none";
  return true;
}

// Function to validate the skills field
function validateSkills() {
  const skillsInput = document.getElementById("skills-input");
  const skillsError = document.getElementById("skills-error");
  const skillsValue = skillsInput.value.trim();

  // Check if the field is empty
  if (!skillsValue) {
    skillsError.textContent = "Skills field is required.";
    skillsError.style.display = "flex";
    return false;
  }

  // Split the input into individual skill entries
  const skillsArray = skillsValue.split(",").map((skill) => skill.trim());

  // Validate the number of skills
  if (skillsArray.length > 10) {
    skillsError.textContent = "You can list a maximum of 10 skills.";
    skillsError.style.display = "flex";
    return false;
  }

  // Regular expression to validate skill format: "SkillName: Level"
  const skillRegex = /^[A-Za-z0-9\s]+:\s*[1-5]$/;

  for (let skill of skillsArray) {
    // Check if each skill matches the required format
    if (!skillRegex.test(skill)) {
      skillsError.textContent =
        "Each skill must be in the format 'SkillName: Level' (e.g., Java: 5) with levels between 1 and 5.";
      skillsError.style.display = "flex";
      return false;
    }
  }

  // Validation passed
  skillsError.style.display = "none";
  return true;
}

// Function to validate the education history field
function validateEducationHistory() {
  const educationHistoryInput = document.getElementById("education-history-input");
  const educationHistoryError = document.getElementById("education-history-error");
  const educationHistoryValue = educationHistoryInput.value.trim();

  // Regex for university name (alphabetic characters, spaces, punctuation, max 100 chars)
  const universityRegex = /^[a-zA-Z\s.,'-]{1,100}$/;

  // Regex for degree validation (alphanumeric, spaces, max 50 chars)
  const degreeRegex = /^[a-zA-Z0-9\s]{1,50}$/;

  // Regex for date validation (MM/YYYY)
  const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

  // Split the input into components: university name, degree, and dates
  const components = educationHistoryValue.split(",").map((item) => item.trim());

  if (components.length !== 3) {
    educationHistoryError.textContent = "Education history must include university name, degree, and enrollment-graduation dates.";
    educationHistoryError.style.display = "flex";
    return false;
  }

  const [universityName, degree, dates] = components;

  // Validate university name
  if (!universityRegex.test(universityName)) {
    educationHistoryError.textContent = "Invalid university name. Only letters, spaces, and punctuation are allowed (max 100 characters).";
    educationHistoryError.style.display = "flex";
    return false;
  }

  // Validate degree
  if (!degreeRegex.test(degree)) {
    educationHistoryError.textContent = "Invalid degree. Only alphanumeric characters and spaces are allowed (max 50 characters).";
    educationHistoryError.style.display = "flex";
    return false;
  }

  // Validate dates format (MM/YYYY - MM/YYYY)
  const dateComponents = dates.split(" - ").map((date) => date.trim());
  if (dateComponents.length !== 2 || !dateRegex.test(dateComponents[0]) || !dateRegex.test(dateComponents[1])) {
    educationHistoryError.textContent = "Invalid dates format. Use MM/YYYY - MM/YYYY.";
    educationHistoryError.style.display = "flex";
    return false;
  }

  // Ensure enrollment date is earlier than graduation date
  const [enrollmentDate, graduationDate] = dateComponents.map((date) => new Date(date));
  if (enrollmentDate >= graduationDate) {
    educationHistoryError.textContent = "Enrollment date must be earlier than graduation date.";
    educationHistoryError.style.display = "flex";
    return false;
  }

  // If all validations pass
  educationHistoryError.style.display = "none";
  return true;
}

function addLocationChip(locationValue = null) {
  const desiredLocationInput = document.getElementById(
    "desired-location-input"
  );
  const desiredLocationContainer = document.getElementById(
    "desired-location-container"
  );

  if (!locationValue) locationValue = desiredLocationInput.value.trim();
  if (!locationValue) return;

  if (amountOfLocations >= 5) {
    alert("You can only enter up to 5 locations.");
    return;
  }
  const locationChips = document.querySelectorAll(".location-chip");
  for (let chip of locationChips) {
    const removeBtn = chip.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.remove();
    }
    const chipText = chip.textContent;
    chip.appendChild(removeBtn);
    if (chipText === locationValue) {
      alert("This location is already added.");
      return;
    }
  }

  const locationChip = document.createElement("span");
  locationChip.classList.add("location-chip");
  locationChip.textContent = locationValue;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "X";
  removeBtn.onclick = () => {
    locationChip.remove();
    amountOfLocations--;
    validateDesiredLocation();
    toggleSubmitButton(); // Update button state after removing a location
  };

  locationChip.appendChild(removeBtn);
  desiredLocationContainer.appendChild(locationChip);
  if (!locationValue) desiredLocationInput.value = "";
  amountOfLocations++;
  validateDesiredLocation();
}
