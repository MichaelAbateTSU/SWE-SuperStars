document.addEventListener("DOMContentLoaded", async () => {
    await loadStudentData();
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

// Handle form submission to save changes
document.querySelector(".submit-button button").addEventListener("click", async () => {
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
