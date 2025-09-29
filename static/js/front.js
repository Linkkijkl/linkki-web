/* global $this: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "animationsSlider" }] */

$(function () {
  sliders()
  menuSliding()
  masonries()
  search()
})

/* sliders */
function sliders () {
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
      afterInit: function () {
        // animationsSlider()
      },
      afterMove: function () {
        // animationsSlider()
      }
    })
  }
}


/* masonries */
function masonries () {
  const customers = $('.customers').masonry({
    itemSelector: '.item',
    percentPosition: true,
  });

  // Reload masonry after images load fully
  let debounceTimeout = null;
  const DEBOUNCE_TIME = 200;
  for (const sponsor of $('.customers img')) {
    sponsor.addEventListener('load', () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        customers.masonry();
      }, DEBOUNCE_TIME);
    }, {once: true});
  }
}

/* menu sliding */
function menuSliding () {
  $('.dropdown').on('show.bs.dropdown', function () {
    if ($(window).width() > 750) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown()
    } else {
      $(this).find('.dropdown-menu').first().stop(true, true).show()
    }
  })

  $('.dropdown').on('hide.bs.dropdown', function () {
    if ($(window).width() > 750) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp()
    } else {
      $(this).find('.dropdown-menu').first().stop(true, true).hide()
    }
  })
}



function search () {
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
}
