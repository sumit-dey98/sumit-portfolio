const counters = document.querySelectorAll(".counter");

const startCounter = (el) => {
  const target = +el.dataset.target;
  const finalText = el.dataset.text;
  const duration = 2000;
  const frameRate = 30;
  const totalSteps = Math.round((duration / 1000) * frameRate);
  let step = 0;

  const update = () => {
    step++;
    const progress = step / totalSteps;
    const value = Math.floor(target * progress);

    if (value >= target) {
      el.textContent = finalText; 
    } else {
      el.textContent = value;
      requestAnimationFrame(update);
    }
  };

  update();
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
  }
);

counters.forEach((counter) => observer.observe(counter));



