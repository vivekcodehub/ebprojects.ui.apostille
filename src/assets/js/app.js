// Header active
$(document).ready(function () {
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 10) {
      $(".header__wrapper").addClass("navActive");
    } else {
      $(".header__wrapper").removeClass("navActive");
    }
  });
});

// Humbuger Toogle button
const toggleBtn = document.getElementById("humguberBtn");
const box = document.getElementById("humbugerMenu");
const anchorLinks = document.querySelectorAll(".nav_list a");
toggleBtn.addEventListener("click", () => {
  box.classList.toggle("show");
  toggleBtn.classList.toggle("close");
});

anchorLinks.forEach((link) => {
  link.addEventListener("click", () => {
    box.classList.remove("show");
    toggleBtn.classList.remove("close");
  });
});

//Navbar Link Active
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".nav_list a");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor jump

      // Remove active from all
      links.forEach((item) => item.classList.remove("active"));

      // Add active to clicked
      this.classList.add("active");

      // Get target section ID from href
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.8, // scroll animation duration (seconds)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing
    orientation: "vertical", // vertical scrolling
    wheelMultiplier: 1, // wheel speed multiplier
    smoothTouch: false, // leave true if you want smooth touch on mobile
    infinite: false,
    autoResize: true,
  });

  // Required RAF loop that drives Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});
