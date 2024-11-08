document.addEventListener("DOMContentLoaded", async () => {
    await loadStudentData();
    
    // Add event listener for the email field to validate on input
    document.getElementById("email-input").addEventListener("input", validateEmail);
});

async function loadStudentData() {
    try {
        const response = await fetch('http://localhost:3000/students/1'); // Fetch student with id=1
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
        console.error('Error loading student data:', error);
    }
}

// Function to validate the email field
function validateEmail() {
    const emailInput = document.getElementById("email-input");
    const emailError = document.getElementById("email-error");
    const emailValue = emailInput.value;

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if email is empty or not in a valid format
    if (!emailValue) {
        emailError.textContent = "Email is required.";
        emailError.style.display = "flex";
        return false;
    } else if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address (e.g., example@domain.com).";
        emailError.style.display = "flex";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
}

// Handle form submission to save changes
document.querySelector(".submit-button button").addEventListener("click", async () => {
    // Validate email before submission
    if (!validateEmail()) {
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
        desired_locations: document.getElementById("desired-location-input").value,
        skills: document.getElementById("skills-input").value,
        education_history: document.getElementById("education-history-input").value
    };

    try {
        const response = await fetch('http://localhost:3000/students/1', {
            method: 'PUT', // Update student with id=1
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStudent),
        });

        if (response.ok) {
            alert("Changes saved successfully!");
        } else {
            alert("Error saving changes.");
        }
    } catch (error) {
        console.error('Error saving student data:', error);
    }
});
