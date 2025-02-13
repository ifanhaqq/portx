
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);
 
//  CARD

const { ScrollObserver, valueAtPercentage } = aat

// SECTIONS PROJECT

const sectionsParam = new URLSearchParams(window.location.search);
const projectId = sectionsParam.get("id");

if (projectId) {
  const section = document.getElementById(`project-${projectId}`);
  if (section) {
    section.classList.remove("hidden");
  }
}

// PRELOADER
 