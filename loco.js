const images = document.querySelectorAll(".carousel-container img");
const buttons = document.querySelectorAll(".carousel-button");
let currentIndex = 0;

// Función para mostrar la imagen actual
function showImage(index) {
  images.forEach((img, i) => {
    img.style.display = i === index ? "block" : "none";
  });
}

// Mostrar la primera imagen al cargar la página
showImage(currentIndex);
