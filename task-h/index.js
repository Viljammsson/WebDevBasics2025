// index.js
// Author: Viljami Myllyvirta
// Date: 2025-11-12
// Handles the js

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1) Fetch the most important elements
  const form = document.getElementById("fullForm");
  const tbody = document.querySelector("#timetable tbody");

  const nameInput = document.getElementById("Name");
  const emailInput = document.getElementById("Email");
  const telInput = document.getElementById("Tel");
  const birthInput = document.getElementById("birthDate");
  const termsInput = document.getElementById("terms");

  // Error code messages
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const telError = document.getElementById("telError");
  const birthError = document.getElementById("birthError");
  const termsError = document.getElementById("termsError");

  // 2) more functions
  const setError = (el, msg) => (el.textContent = msg || "");
  const isFutureDate = (yyyyMmDd) => {
    if (!yyyyMmDd) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(yyyyMmDd + "T00:00:00");
    return d > today;
  };

  const calcAge = (yyyyMmDd) => {
    if (!yyyyMmDd) return 0;
    const now = new Date();
    const b = new Date(yyyyMmDd + "T00:00:00");
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
  };

  const telLooksOk = (str) => {
    const digits = (str || "").replace(/\D/g, "");
    return /^\+?[\d\s\-()]{7,25}$/.test(str) && digits.length >= 7 && digits.length <= 20;

    //regex and i hate it
  };

  // 3) Validate?
  const validate = () => {
    let ok = true;

    // Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameError, "Name needs to be atleast 2 letters long.");
      ok = false;
    } else {
      setError(nameError, "");
    }




    // Email Validation
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      setError(emailError, "Enter an Email-address");
      ok = false;
    } else {
      setError(emailError, "");
    }

    // Telephone
    if (!telLooksOk(telInput.value.trim())) {
      setError(telError, "Give a real tel. number (esim. +358 401234567).");
      ok = false;
    } else {
      setError(telError, "");
    }

    // Birthdate
    const b = birthInput.value;
    if (!b) {
      setError(birthError, "Pick a birth date.");
      ok = false;
    } else if (isFutureDate(b)) {
      setError(birthError, "Birth date cant be in future.");
      ok = false;
    } else if (calcAge(b) < 15) {
      setError(birthError, "Age restricted +15");
      ok = false;
    } else {
      setError(birthError, "");
    }

    // Terms
    if (!termsInput.checked) {
      setError(termsError, "Accept the terms and conditions.");
      ok = false;
    } else {
      setError(termsError, "");
    }

    return ok;
  };

  // Realtime name validation?
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      setError(nameError, "Name needs to be at least 2 letters long.");
    } else {
      setError(nameError, "");
    }
  });

  emailInput.addEventListener("input", validate);
  telInput.addEventListener("input", validate);
  birthInput.addEventListener("change", validate);
  termsInput.addEventListener("change", validate);

const addRow = ({ name, email, tel, birth, terms }) => {
  const tr = document.createElement("tr");

  // create the date
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace("T", " ");

  const cells = [
    timestamp, // fixed timestamp
    name,
    email,
    tel,
    birth,
    terms ? "Yes" : "No",
  ];

  cells.forEach((text, i) => {
    const td = document.createElement("td");
    td.textContent = text;
    td.className = "p-3 border-b border-border";
    if (i > 0) td.classList.add("text-center");
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
};


  // 5) Event listener submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validate();
    if (!ok) {
      // Focus only for one error at a time
      if (nameError.textContent) nameInput.focus();
      else if (emailError.textContent) emailInput.focus();
      else if (telError.textContent) telInput.focus();
      else if (birthError.textContent) birthInput.focus();
      else if (termsError.textContent) termsInput.focus();
      return;
    }

    // allfine add the row
    addRow({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      tel: telInput.value.trim(),
      birth: birthInput.value,         // yyyy-mm-dd
      terms: termsInput.checked,
    });

    // Reset and focus on the first row
    form.reset();
    nameInput.focus();
  });

  // 6) Reset errors also
  form.addEventListener("reset", () => {
    [nameError, emailError, telError, birthError, termsError].forEach((el) => setError(el, ""));
  });
});


