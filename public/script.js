const studentDataAPI = "http://localhost:3000/students/1";

document.addEventListener("DOMContentLoaded", async () => {
  await loadStudentData();

  // Add event listener for each input field to validate on input
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      if (input.id === "email-input") {
        validateEmail();
      } else if (input.id === "phone-number-input") {
        validatePhoneNumber();
      }
    });
  });
});

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
    document.getElementById("desired-location-input").value = student.desired_locations;
    document.getElementById("skills-input").value = student.skills;
    document.getElementById("education-history-input").value = student.education_history;
  } catch (error) {
    console.error("Error loading student data:", error);
  }
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
      desired_locations: document.getElementById("desired-location-input")
        .value,
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

// Function to validate the entire form
function validateForm () {
  // TODO: Add validation for all fields, then uncomment the lines below

  // const firstNameValid = validateFirstName();
  // const lastNameValid = validateLastName();
  const emailValid = validateEmail();
  const phoneNumberValid = validatePhoneNumber();
  // const roleSummaryValid = validateRoleSummary();
  // const employmentInfoValid = validateEmploymentInfo();
  // const desiredLocationValid = validateDesiredLocation();
  // const skillsValid = validateSkills();
  // const educationHistoryValid = validateEducationHistory();

  return (
    // firstNameValid &&
    // lastNameValid &&
    emailValid &&
    phoneNumberValid 
    // &&
    // roleSummaryValid &&
    // employmentInfoValid &&
    // desiredLocationValid &&
    // skillsValid &&
    // educationHistoryValid
  );
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
  else if (!phoneRegex.test(phoneValue) || phoneValue.replace(/\D/g, "").length < 10) {
    phoneError.textContent = "Please enter a valid phone number (e.g., 123-456-7890)";
    phoneError.style.display = "flex";
    return false;
  } else {
    phoneError.style.display = "none";
    return true;
  }
}