/* global $this: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "animationsSlider" }] */

window.addEventListener('DOMContentLoaded', () => {
  sliders();
  masonries();
  search();
});


const sliders = () => {
  const gliderElement = document.querySelector('.glider');
  const itemCount = gliderElement.children.length;
  const glider = new Glider(gliderElement, {
    slidesToShow: 1,
    draggable: true,
    scrollLock: true,
    rewind: true,
    duration: 3,
  });

  // Autoscroll
  let i = 0;
  let scrolled = false;
  let mouseOnTop = false;
  gliderElement.addEventListener('mousedown', () => scrolled = true);
  gliderElement.addEventListener('mouseenter', () => mouseOnTop = true);
  gliderElement.addEventListener('mouseleave', () => mouseOnTop = false);
  function autoplay() {
    // Stop if carousel was moved by user
    if (scrolled) return;

    // Skip if mouse is over element
    if (!mouseOnTop) {
      glider.scrollItem(i % itemCount, false);
      i += 1;
    }
    setTimeout(autoplay, 6000);
  }
  autoplay();
};


const masonries = () => {
  const customers = new Masonry('.customers', {
    itemSelector: '.item',
    percentPosition: true,
  });

  // Reload masonry after images load fully
  let debounceTimeout = null;
  const DEBOUNCE_TIME = 200;
  const images = document.querySelectorAll('.customers img');
  for (const sponsor of images) {
    sponsor.addEventListener('load', () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        customers.layout();
      }, DEBOUNCE_TIME);
    }, {once: true});
  }
};


const search = () => {
  // Initialize pagefind
  new PagefindUI({ element: "#pagefind", showSubResults: true });

  const searchInput = document.querySelector('.pagefind-ui__search-input');
  const emptyButton = document.querySelector('.pagefind-ui__search-clear');
  const hideClass = 'search-hidden';

  let expanded = false;

  const elemList = () => document.querySelectorAll('[data-hide-on-search]');

  const expand = () => {
    elemList().forEach((elem) => elem.classList.add(hideClass));
    expanded = true;
  };

  const shrink = () => {
    elemList().forEach((elem) => elem.classList.remove(hideClass));
    expanded = false;
  };

  const isInMobile = () =>
    window.getComputedStyle(document.querySelector('.navbar-toggler')).display != 'none';

  searchInput.addEventListener('input', () => {
    if (searchInput.value.length == 0) {
      shrink();
    }
    else if (!expanded && !isInMobile()) {
      expand();
    }
  });

  emptyButton.addEventListener('click', () => {
    shrink();
  });
};
