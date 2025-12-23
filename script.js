console.log("GeniusLab Landing Page Loaded");

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.borderBottomColor =
    window.scrollY > 10 ? "rgba(34, 211, 238, 0.25)" : "rgba(168, 85, 247, 0.14)";
});
