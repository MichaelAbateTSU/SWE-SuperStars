document.addEventListener('DOMContentLoaded', () => {
    getStudentInformation();
});

function getStudentInformation() {
    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const student = data[0]; // Assuming data is an array and you want the first student

            if (student) {
                const firstNameInput = document.getElementById('first-name-input');
                firstNameInput.value = student.first_name;
            }
        })
        .catch(error => console.error('Error:', error));
}


// function displayResults(results) {
//     const resultsContainer = document.getElementById('results');
//     resultsContainer.innerHTML = ''; // Clear previous results

//     if (results.length > 0) {
//     results.forEach(students => {
//         const resultStudents = document.createElement('p');
//         resultStudents.textContent = `${students.first_name} ${students.last_name} , ${students.degree_program} (${students.degree_classification})`;
//         resultsContainer.appendChild(resultStudents);
//     });
//     } else {
//     resultsContainer.textContent = 'No results found';
//     }
// }
