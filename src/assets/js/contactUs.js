const API_URL = "https://jutxnn1a0a.execute-api.us-east-1.amazonaws.com/v1/pigeonpost/contactus";

const emailInput      = document.getElementById("email");
const messageInput    = document.getElementById("message");
const attachmentInput = document.getElementById("attachment");
const emailError      = emailInput.parentElement.querySelector(".errorMessage");
const attachmentError = document.getElementById("attachmentError");

const emailPattern    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTypes    = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
const maxFileSize     = 10 * 1024 * 1024; // 10MB — must match backend multer limit

// Live validation
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

function validateForm() {
  let valid = true;
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

  // Build multipart/form-data — required when sending a file
  // When no file, we still use FormData so the backend stays consistent
  const formData = new FormData();

  const body = {
    client: {
      email:      emailInput.value.trim(),
      FIRST_NAME: "",
      LAST_NAME:  "",
      QUERY:      messageInput.value.trim(),
    },
    source: "ac",
  };

  formData.append("data", JSON.stringify(body)); // JSON payload as named field
  if (file) {
    formData.append("attachment", file);          // file field — matches multer's upload.single("attachment")
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      // Do NOT set Content-Type manually — browser sets it automatically with the correct multipart boundary
      body: formData,
    });
    console.log("Response from server:", response);

    // Show success / reset form
    document.getElementById("contactForm").reset();
    grecaptcha.reset();
    document.getElementById("Button--ContactUs").disabled = true;

  } catch (error) {
    console.error("Error submitting contact form:", error);
  }
}

document.getElementById("contactForm").addEventListener("submit", submitContactForm);

document.getElementById("Button--ContactUs").disabled = true;

function captchaVerified() {
    document.getElementById("Button--ContactUs").disabled = false;
}