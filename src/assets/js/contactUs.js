const API_URL = "https://jutxnn1a0a.execute-api.us-east-1.amazonaws.com/v1/pigeonpost/contactus";

const firstNameInput  = document.getElementById("firstName");
const lastNameInput   = document.getElementById("lastName");
const cityInput       = document.getElementById("city");
const emailInput      = document.getElementById("email");
const messageInput    = document.getElementById("message");
const attachmentInput = document.getElementById("attachment");

const firstNameError  = firstNameInput.parentElement.querySelector(".errorMessage");
const lastNameError   = lastNameInput.parentElement.querySelector(".errorMessage");
const cityError       = cityInput.parentElement.querySelector(".errorMessage");
const emailError      = emailInput.parentElement.querySelector(".errorMessage");
const attachmentError = document.getElementById("attachmentError");
const thankyouMsg     = document.getElementById("thankyou");

const emailPattern  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTypes  = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
const maxFileSize   = 10 * 1024 * 1024; // 10MB

// Live validation helpers
function clearError(input, errorEl) {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      errorEl.textContent = "";
      input.style.borderColor = "";
    }
  });
}

clearError(firstNameInput, firstNameError);
clearError(lastNameInput,  lastNameError);
clearError(cityInput,      cityError);

emailInput.addEventListener("input", () => {
  if (emailPattern.test(emailInput.value.trim())) {
    emailError.textContent = "";
    emailInput.style.borderColor = "";
  }
});

attachmentInput.addEventListener("change", () => {
  const file = attachmentInput.files[0];
  if (!file) return;
  if (!allowedTypes.includes(file.type)) {
    attachmentError.textContent = "Only JPG, PNG, GIF, or PDF files are allowed.";
    attachmentInput.value = "";
  } else if (file.size > maxFileSize) {
    attachmentError.textContent = "File must be under 10MB.";
    attachmentInput.value = "";
  } else {
    attachmentError.textContent = "";
  }
});

function validateField(input, errorEl, label) {
  if (input.value.trim() === "") {
    errorEl.textContent = `${label} is required.`;
    input.style.borderColor = "red";
    return false;
  }
  errorEl.textContent = "";
  input.style.borderColor = "";
  return true;
}

function validateForm() {
  let valid = true;

  valid = validateField(firstNameInput, firstNameError, "First name") && valid;
  valid = validateField(lastNameInput,  lastNameError,  "Last name")  && valid;
  valid = validateField(cityInput,      cityError,      "City")       && valid;

  const emailValue = emailInput.value.trim();
  if (emailValue === "") {
    emailError.textContent = "Email is required.";
    emailInput.style.borderColor = "red";
    valid = false;
  } else if (!emailPattern.test(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.style.borderColor = "red";
    valid = false;
  } else {
    emailError.textContent = "";
    emailInput.style.borderColor = "";
  }

  return valid;
}

async function submitContactForm(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const captchaResponse = grecaptcha.getResponse();
  if (captchaResponse.length === 0) return;

  const file = attachmentInput.files[0] || null;

  const formData = new FormData();

  const body = {
    client: {
      email:      emailInput.value.trim(),
      FIRST_NAME: firstNameInput.value.trim(),
      LAST_NAME:  lastNameInput.value.trim(),
      QUERY:      `${messageInput.value.trim()} [City: ${cityInput.value.trim()}]`,
    },
    source: "ac",
  };

  formData.append("data", JSON.stringify(body));
  if (file) {
    formData.append("attachment", file);
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    console.log("Response from server:", response);

    document.getElementById("contactForm").reset();
    grecaptcha.reset();
    document.getElementById("Button--ContactUs").disabled = true;
    thankyouMsg.style.display = "block";

    setTimeout(() => {
      thankyouMsg.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Error submitting contact form:", error);
  }
}

document.getElementById("contactForm").addEventListener("submit", submitContactForm);

document.getElementById("Button--ContactUs").disabled = true;

function captchaVerified() {
  document.getElementById("Button--ContactUs").disabled = false;
}