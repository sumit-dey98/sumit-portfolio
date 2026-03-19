const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const galleryImages = document.querySelectorAll(".gallery img");
let scale = 1;
let currentIndex = 0;
let startX = 0;
let endX = 0;

const counter = document.createElement("div");
counter.id = "imageCounter";
counter.style.cssText = `
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0,0,0,0.45);
  padding: 4px 12px;
  border-radius: 20px;
  font-family: "open sans";
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
`;
modal.appendChild(counter);

function updateCounter() {
  counter.textContent = `${currentIndex + 1} of ${galleryImages.length}`;
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = index;
    openModal(img.src);
  });
});

function openModal(src) {
  modalImage.style.transform = `scale(${1})`;
  modal.classList.add("show");
  modalImage.style.opacity = 0;
  setTimeout(() => {
    modalImage.src = src;
    modalImage.style.opacity = 1;
  }, 100);
  scale = 1;
  modal.style.display = "flex";
  updateCounter();
}

function closeModal() {
  modalImage.style.transform = `scale(${0})`;
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function slideToImage(src, direction = "left") {
  const offset = direction === "left" ? 100 : -100;

  modalImage.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  modalImage.style.transform = `translateX(${-offset}%) scale(${scale})`;
  modalImage.style.opacity = 0;

  setTimeout(() => {
    modalImage.src = src;

    modalImage.style.transition = "none";
    modalImage.style.transform = `translateX(${offset}%) scale(${scale})`;
    modalImage.style.opacity = 0;

    void modalImage.offsetWidth;

    modalImage.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    modalImage.style.transform = `translateX(0) scale(${scale})`;
    modalImage.style.opacity = 1;
  }, 300);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  slideToImage(galleryImages[currentIndex].src, "left");
  updateCounter();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  slideToImage(galleryImages[currentIndex].src, "right");
  updateCounter();
}

function zoomIn() {
  scale += 0.1;
  modalImage.style.transform = `scale(${scale})`;
}

function zoomOut() {
  scale = Math.max(0.1, scale - 0.1);
  modalImage.style.transform = `scale(${scale})`;
}

function resetZoom() {
  scale = 1;
  modalImage.style.transform = `translateX(0) scale(${scale})`;
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "+" || e.key === "=") {
      zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      zoomOut();
    }
  }
});

modal.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
});

modal.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  if (modal.style.display === "flex") {
    if (startX - endX > 50) {
      nextImage();
    } else if (endX - startX > 50) {
      prevImage();
    }
  }
});