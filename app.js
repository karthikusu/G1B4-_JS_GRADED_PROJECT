// app.js

const users = [
    { username: "admin", password: "admin123" }
];

let applicants = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const resumePage = document.getElementById("resume-page");
    const loginPage = document.getElementById("login-page");
    const filterButton = document.getElementById("filter-button");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        if (validateLogin(username, password)) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            loginPage.style.display = "none";
            resumePage.style.display = "block";
            loadApplicants();
            displayApplicant();
            preventBack();
        } else {
            errorMessage.textContent = "Invalid username/password.";
        }
    });

    filterButton.addEventListener("click", () => {
        const jobFilter = document.getElementById("job-filter").value;
        const filteredApplicants = applicants.filter(applicant => applicant.job.toLowerCase().includes(jobFilter.toLowerCase()));
        if (filteredApplicants.length > 0) {
            applicants = filteredApplicants;
            currentIndex = 0;
            displayApplicant();
        } else {
            showError("Invalid search or No applications for this job");
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayApplicant();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentIndex < applicants.length - 1) {
            currentIndex++;
            displayApplicant();
        }
    });
});

function validateLogin(username, password) {
    return users.some(user => user.username === username && user.password === password);
}

function loadApplicants() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            applicants = data;
            displayApplicant();
        })
        .catch(error => console.error('Error fetching applicants:', error));
}

function displayApplicant() {
    const applicantName = document.getElementById("applicant-name");
    const applicantJob = document.getElementById("applicant-job");
    const applicantEmail = document.getElementById("applicant-email");
    const applicantPhone = document.getElementById("applicant-phone");
    const noApplications = document.getElementById("no-applications");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    if (applicants.length === 0) {
        showError("Invalid search or No applications for this job");
        return;
    }

    const applicant = applicants[currentIndex];

    applicantName.textContent = `Name: ${applicant.name}`;
    applicantJob.textContent = `Job: ${applicant.job}`;
    applicantEmail.textContent = `Email: ${applicant.email}`;
    applicantPhone.textContent = `Phone: ${applicant.phone}`;
    noApplications.textContent = "";

    prevButton.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextButton.style.display = currentIndex === applicants.length - 1 ? "none" : "inline-block";
}

function showError(message) {
    const noApplications = document.getElementById("no-applications");
    noApplications.textContent = message;
}

function preventBack() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
}
