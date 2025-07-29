
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

//  CARD

const { ScrollObserver, valueAtPercentage } = aat

const sectionsParam = new URLSearchParams(window.location.search);
const projectId = sectionsParam.get("id");

async function init() {
 const response = await fetch('projects-data.json');
 const data = await response.json();
 
 const projectData = data.projects.find((project) => project.projectId === parseInt(projectId));
 distributeData(projectData)
}

function distributeData(data) {
  console.log(data);
  const techstackContainer = document.getElementById('techstack-container');

  data.techstackImages.forEach(src => {
    const img = document.createElement('img');
    img.className = 'w-6';
    img.src = src;
    img.alt = 'icon';
    techstackContainer.appendChild(img);
  })
  document.getElementById('short-name').innerText = data.shortName;
  document.getElementById('full-name').innerText = data.fullName;
  document.getElementById('description').innerText = data.description;
  document.getElementById('image').src = data.image;
}

init();



if (projectId) {
  const section = document.getElementById(`project-${projectId}`);
  if (section) {
    section.classList.remove("hidden");
  }
}

// PRELOADER
