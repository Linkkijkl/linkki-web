/* global $this: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "animationsSlider" }] */

window.addEventListener('DOMContentLoaded', () => {
  sliders();
  masonries();
  search();
});


const sliders = () => {
  if ($('.owl-carousel').length) {
    $('.homepage').owlCarousel({
      navigation: false, // Show next and prev buttons
      navigationText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
      slideSpeed: ($('.homepage').attr('data-slide-speed') || 2000),
      paginationSpeed: ($('.homepage').attr('data-pagination-speed') || 1000),
      autoPlay: ($('.homepage').attr('data-autoplay') || 'true') === 'true',
      stopOnHover: true,
      singleItem: true,
      lazyLoad: false,
      addClassActive: true,
    })
  }
};


const masonries = () => {
  const customersElement = document.querySelector('.customers');
  const customers = customersElement.masonry({
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
        customers.masonry();
      }, DEBOUNCE_TIME);
    }, {once: true});
  }
};


const search = () => {
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

  // Initialize pagefind
  new PagefindUI({ element: "#pagefind", showSubResults: true });
};
