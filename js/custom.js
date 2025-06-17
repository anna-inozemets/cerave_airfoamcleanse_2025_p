// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 3;

// additional varibles for slides
const totalSlideAmount = 13;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 1.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrows').addClass('top');
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--1__right h2', { opacity: 0, duration: 0.65, delay: 1 });
    gsap.from('.slide--1__left p', { opacity: 0, duration: 0.75, delay: 1.5, x: '45%' });
    gsap.from('.slide--1__right-blocks > p', { opacity: 0, duration: 0.75, delay: 1.5, x: '-45%' });
    gsap.from('.slide--1__right-block', { opacity: 0, duration: 0.75, delay: 2, scale: 0 });
    nextArrowDelay = 3;
  },
  2: () => {
    $('.arrows').removeClass('top');
    $('.arrow--prev').addClass('arrow--white');
    typewriterEffect('.slide--2 h3 .animate-first', 1, 1)
    typewriterEffect('.slide--2 h3 .animate-second', 2.35, 2)
    typewriterEffect('.slide--2 h3 .animate-third', 0.4, 4.35)
    typewriterEffect('.slide--2 h3 .animate-fourth', 1, 4.75)
    nextArrowDelay = 6;
  },
  3: () => {
    $('.arrows').removeClass('top');
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--3__block img').on('click', function () {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('h3'), { opacity: 1, duration: 0.75, delay: 0.75 });
      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.75, delay: 1.25 });

      if ($('.slide--3__block.active').length === 2) {
        gsap.to('.slide--3__content .line, .slide--3__content p.subtitle', { opacity: 1, duration: 0.75, delay: 2, x: 0 });
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 3 * 1000);
      }
    })
  },
  4: () => {
    $('.arrows').addClass('top');
    $('.arrow--prev').addClass('arrow--white');
    $('.slide--4__block img').on('click', function () {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.75, y: 0 });

      if ($(this).parent().find('ul').length !== 0) {
        gsap.to($(this).parent().find('ul'), { opacity: 1, duration: 0.6, delay: 1.1, y: 0 });
      }

      if ($('.slide--4__block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.1 * 1000);
      }
    })
  },
  5: () => {
    $('.arrows').removeClass('top');
    $('.arrow--prev').addClass('arrow--white');
    gsap.from('.slide--5 h2', { opacity: 0, duration: 0.65, delay: 1, y: '-15%' });
    nextArrowDelay = 2;
  },
  6: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    $('.slide--6__right img').on('click', function() {
      $(this).parent().parent().addClass('active');

      gsap.to($(this).parent().parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.75, x: 0 });

      if ($('.slide--6__right').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.75 * 1000);
      }
    })
  },
  7: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--7__left img').on('click', function() {
      $(this).parent().parent().addClass('active');

      gsap.to($(this).parent().parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.75, x: 0 });
      gsap.to($(this).parent().parent().find('h4'), { opacity: 1, duration: 0.6, delay: 1.3 });

      if ($('.slide--7__left').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.3 * 1000);
      }
    })
  },
  8: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--8__icon img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('h4'), { opacity: 1, duration: 0.6, delay: 0.5, x: 0 });
      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.5, x: 0 });

      if ($('.slide--8__icon.active').length == 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  9: () => {
    $('.slide--9__molecule img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.5, x: 0 });

      if ($('.slide--9__block.active').length == 3 && $('.slide--9__molecule').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })

    $('.slide--9__block img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.6, delay: 0.5, x: 0 });

      if ($('.slide--9__block.active').length == 3 && $('.slide--9__molecule').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  10: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--10__block p.percent').on('click', function () {
      const parent = $(this).parent();
      const span = $(this).find('span');
      const targetNumber = Number(span.attr('data-number'));

      parent.addClass('active');

      gsap.to(span[0], {
        duration: 2,
        innerHTML: targetNumber,
        delay: 0,
        onUpdate: function () {
          span.html(Math.round(span[0].innerHTML));
        },
        onComplete: function () {
          span.html(targetNumber);
        }
      });

      gsap.to(parent.find('p.text'), {opacity: 1, duration: 0.6, delay: 1.5 });

      if ($('.slide--10__block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 3 * 1000);
      }
    });

  },
  11: () => {
    $('.arrow--prev').addClass('arrow--white');
    animateNumber(0.75, '.slide--11__block.first p.percent span');
    gsap.from('.slide--11__block.first p.text', { opacity: 0, duration: 0.6, delay: 2, x: '15%' });

    animateNumber(2.6, '.slide--11__block.second p.percent span');
    gsap.from('.slide--11__block.second p.text', { opacity: 0, duration: 0.6, delay: 3.85, x: '15%' });

    animateNumber(4.45, '.slide--11__block.third p.percent span');
    gsap.from('.slide--11__block.third p.text', { opacity: 0, duration: 0.6, delay: 5.65, x: '15%' });

    nextArrowDelay = 6.65;
  },
  12: () => {
    $('.arrow--prev').addClass('arrow--white');
    clearTimeout(lastSlideActionTimeout);
    $('.slide--12__left ul li span.checkmark').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('span.text'), {opacity: 1, duration: 0.6, delay: 0.5, x: 0 });

      if ($('.slide--12__left ul li.active').length === 5) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  13: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--13__bottle .img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('> p'), {opacity: 1, duration: 0.5, delay: 0.75, y: 0 });

      if($(this).parent().hasClass('third')) {
        gsap.to($(this).parent().find('.icon'), {opacity: 1, duration: 0.5, delay: 1.1, x: 0 });
      }

      if ($('.slide--13__bottle.active').length === 5) {
        nextButtonTimeout = setTimeout(() => {
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.1 * 1000);

        lastSlideActionTimeout = setTimeout(() => {
          lastSlideAction();
        }, 7.5 * 1000);
      }
    })
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 3:
    case 4:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 12:
    case 13:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
