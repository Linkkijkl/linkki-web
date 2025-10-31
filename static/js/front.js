/* global $this: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "animationsSlider" }] */

window.addEventListener('DOMContentLoaded', () => {
  sliders();
  masonries();
  search();
  scrollffset();
  theme();
  prefetcher();
  shaders();
  festive();
  events();
});


const sliders = () => {
  const gliderElement = document.querySelector('.glider');
  if (!gliderElement) return;

  const itemCount = gliderElement.children.length;
  const glider = new Glider(gliderElement, {
    slidesToShow: 1,
    draggable: true,
    scrollLock: true,
    rewind: true,
    duration: 3,
    dots: '.dots',
  });

  // Autoscroll
  let i = 0;
  let scrolled = false;
  let mouseOnTop = false;

  gliderElement.addEventListener('mousedown', () => scrolled = true);
  document.querySelector('.dots').addEventListener('mousedown', () => scrolled = true);
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
  let masonryElement = document.querySelector('.customers');
  if (!masonryElement) return;

  const customers = new Masonry(masonryElement, {
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
    }, { once: true });
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


/**
 * Set page scroll offset for #-links
 */
const scrollffset = () => {
  // Get navbar height
  const navbar = document.querySelector('.navbar');
  const bottomLocation = navbar.getBoundingClientRect().bottom;

  // Set scroll offset based on navbar size
  const stylesheet = document.querySelector("#theme-stylesheet").sheet;
  stylesheet.insertRule(`:target { scroll-margin-top: ${bottomLocation}px; }`);
};


/**
 * @returns true if current theme is dark
 */
const isThemeDark = () => {
  const dm = window.localStorage.getItem("darkmode");
  if (dm === null) return window.matchMedia("(prefers-color-scheme: dark)").matches;
  return dm === "true";
}


/**
 * User switchable theme
 */
const theme = () => {
  let icon = null;
  let darkStyleObject = null;
  let darkStyleParent = null;

  const themeChangeEvent = new Event("onThemeChange");

  /**
   * @param {boolean} dark 
   */
  const setLogoDark = (dark) => {
    for (const logo of document.querySelectorAll(".navbar-brand .logo-text")) {
      for (const suffix of ["-dark.svg", "-light.svg", ".svg"]) {
        if (logo.src.endsWith(suffix)) {
          logo.src = `${logo.src.replace(suffix, "")}${dark ? "-dark.svg" : "-light.svg"}`;
          break;
        }
      }
    }
  }

  /**
   * @param {boolean} dark 
   */
  const setDark = dark => {
    window.localStorage.setItem("darkmode", dark);
    const ds = document.querySelector("#darkstyle");
    if (dark) {
      if (!ds) darkStyleParent.appendChild(darkStyleObject.cloneNode());
      if (icon) icon.className = "fas fa-2x fa-sun";
      setLogoDark(true);
    }
    else {
      if (ds) ds.remove();
      if (icon) icon.className = "fas fa-2x fa-moon";
      setLogoDark(false);
    }
    document.getRootNode().dispatchEvent(themeChangeEvent);
  }

  const toggle = () => setDark(!isThemeDark());

  const createButton = () => {
    const element = document.querySelector(".home-carousel .container, #heading-breadcrumbs .container");
    if (element === null) return;

    icon = document.createElement("i");
    icon.className = "fas fa-2x " + (isThemeDark() ? "fa-sun" : "fa-moon");

    let lightswitch = document.createElement("a");
    lightswitch.appendChild(icon);
    lightswitch.id = "lightswitch";
    lightswitch.href = "#";
    lightswitch.onclick = (event) => {
      event.preventDefault();
      toggle();
    };

    element.appendChild(lightswitch);
  }

  createButton();
  const darkStyle = document.querySelector("#darkstyle");

  // As this sript has loaded, remove media-query based dark theme toggle
  darkStyle.media = "";

  darkStyleObject = darkStyle.cloneNode();
  darkStyleParent = darkStyle.parentElement;

  setDark(isThemeDark());
};


/**
 * Sets different logo based on date
 */
const festive = () => {
  /**
   * Sets festive theming on logo. 
   * @param {String} festive 
   */
  const setFestive = (festive) => {
    for (const logo of document.querySelectorAll(".navbar-brand .logo")) {
      const suffix = ".svg";
      logo.src = `${logo.src.replace(suffix, "")}-${festive}${suffix}`;
    }
  };

  const date = new Date();
  const month = date.getMonth() + 1; // Javascript's months start from 0 and end in 11
  const day = date.getDate();

  // Ylioppilaslakki
  if (month == 4 && day > 30 - 2 * 7 || month == 5 && day == 1) {
    setFestive("vappu");
  }

  // Pride month
  else if (month == 6) {
    setFestive("pride");
  }

  // Christmas
  else if (month == 12) {
    setFestive("joulu");
  }
};


/**
 * Inits and updates shaders
 */
const shaders = async () => {
  let canvas;
  let container;

  let gl = null;
  let shaderProgram;
  let resolutionLocation;
  let vertexArray = new Float32Array;
  let darkModeLocation;

  /**
   * Updates canvas's size to shader uniforms
   */
  const resizeCanvas = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    if (gl != null) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
  }

  const compileShader = (code, type) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(
        `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"
        } shader:`,
      );
      console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  const buildShaderProgram = (shaderInfo) => {
    const program = gl.createProgram();

    shaderInfo.forEach((desc) => {
      const shader = compileShader(desc.code, desc.type);

      if (shader) {
        gl.attachShader(program, shader);
      }
    });

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("Error linking shader program:");
      console.log(gl.getProgramInfoLog(program));
    }

    return program;
  };

  /**
   * @returns sites primary accent color
   */
  const getPrimaryAccent = () => {
    const hexToRgb = hex =>
      hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));
    return hexToRgb(
      getComputedStyle(document.body).getPropertyValue('--primary-accent')
    );
  };

  // Update shader params on site theme change
  document.getRootNode().addEventListener("onThemeChange", () => {
    if (gl) gl.uniform1i(darkModeLocation, isThemeDark());
  });

  canvas = document.querySelector("#shader");
  if (!canvas) return;
  shaderPath = canvas.getAttribute("data-shader");
  container = document.querySelector(".home-carousel, #heading-breadcrumbs");

  new ResizeObserver((entires) => {
    for (const entry of entires) {
      resizeCanvas();
    }
  }).observe(container);

  gl = canvas.getContext("webgl2");
  if (!gl) return;

  const getShaderSource = url => fetch(url).then(response => response.text());

  const vertex = document.querySelector('script[type="x-shader/x-vertex"]');
  const fragment = document.querySelector('script[type="x-shader/x-fragment');
  if (!vertex || !fragment) return;

  shaderProgram = buildShaderProgram([
    {
      type: gl.VERTEX_SHADER,
      code: await getShaderSource(vertex.src)
    },
    {
      type: gl.FRAGMENT_SHADER,
      code: await getShaderSource(fragment.src)
    }
  ]);

  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
  const timeLocation = gl.getUniformLocation(shaderProgram, "u_time");
  const accentLocation = gl.getUniformLocation(shaderProgram, "u_primary_accent");
  darkModeLocation = gl.getUniformLocation(shaderProgram, "u_dark_mode");
  const randomLocation = gl.getUniformLocation(shaderProgram, "u_random");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // fill it with a 2 triangles that cover clip space
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  // first triangle
    1, -1,
    -1, 1,
    -1, 1,  // second triangle
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2,          // 2 components per iteration
    gl.FLOAT,   // the data is 32bit floats
    false,      // don't normalize the data
    0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
    0,          // start at the beginning of the buffer
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(shaderProgram);
  gl.bindVertexArray(vao);


  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  const pa = getPrimaryAccent();
  gl.uniform3f(accentLocation, pa[0] / 255.0, pa[1] / 255.0, pa[2] / 255.0);
  gl.uniform1i(darkModeLocation, isThemeDark());
  gl.uniform1f(randomLocation, Math.random() * 1000.0);

  let timeTracker = 0.0;
  let startTime = document.timeline.currentTime;

  function render() {
    timeTracker = (document.timeline.currentTime - startTime) * 0.001;

    gl.uniform1f(timeLocation, timeTracker);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    window.requestAnimationFrame(render);
  }

  render();
};

/**
 * Prefetches links on mouse hover
 */
const prefetcher = () => {
  document.querySelectorAll("a").forEach((a) => {
    if (["/", "#"].includes(a.href)) return;
    if (a.href.startsWith("mailto")) return;

    a.addEventListener("mouseover", () => {
      const elem = document.createElement("link");
      elem.rel = "prefetch";
      elem.href = a.href;
      document.head.appendChild(elem);
    }, { once: true });
  });
};

/**
 * Updates upcoming events
 */
const events = async () => {
  const eventDiv = document.querySelector("#events");
  if (!eventDiv) return;

  const icalFetch = await fetch("https://linkkijkl.fi/api/calendar.ics");
  const icalData = await icalFetch.text();
  const parsed = ICAL.parse(icalData);
  const rawEvents = parsed[2];

  rawEvents
    .filter(a => a[0] == "vevent")
    .map(a => {
      const vevent = a[1];
      let r = {};
      vevent.forEach((b) => {
        switch (b[0]) {
          case "dtstart":
            r["start"] = new Date(b[3]);
            break;
          case "dtend":
            r["end"] = new Date(b[3]);
            break;
          case "location":
            r["location"] = b[3];
            break;
          case "summary":
            r["summary"] = b[3];
            break;
          case "description":
            r["description"] = b[3];
            break;
          case "last-modified":
            r["last-modified"] = new Date(b[3]);
            break;
        }
      });
      return r;
    })
    .filter(event => event.end > new Date())
    .sort((a, b) => a.start - b.start)
    .slice(0, 6)
    .forEach((event) => {
      const containerElement = document.createElement("div");
      containerElement.classList.add("col-md-6");
      containerElement.classList.add("col-xl-4")
      eventDiv.appendChild(containerElement);

      const eventElement = document.createElement("div");
      eventElement.classList.add("event");
      containerElement.appendChild(eventElement);

      const titleElement = document.createElement("h3");
      titleElement.textContent = event.summary;
      eventElement.appendChild(titleElement);

      const formatMinutes = (minutes) => `${length < 10 ? "0" : ""}${minutes.toString()}`;

      const isDayEvent = event.start.getUTCHours() == 0;
      const isMultiDayEvent = (event.start.getUTCDay() + 1) % 7 == event.end.getUTCDay();
      const startTime = `${event.start.getHours()}:${formatMinutes(event.start.getMinutes())}`
      const endTime = `${event.end.getHours()}:${formatMinutes(event.end.getMinutes())}`
      const dateElement = document.createElement("p");
      dateElement.classList.add("date");

      let dateString;
      if (isDayEvent) {
        if (isMultiDayEvent) {
          dateString = `${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()}`;
        } else {
          dateString = event.start.toLocaleDateString();
        }
      } else {
        if (isMultiDayEvent) {
          dateString = `${event.start.toLocaleDateString()} ${startTime} - ${event.end.toLocaleDateString()} ${startTime}`;
        } else {
          dateString = `${event.start.toLocaleDateString()} ${startTime} - ${endTime}`;
        }
      }
      dateElement.textContent = dateString;
      eventElement.appendChild(dateElement);

      if ("location" in event) {
        const locationElement = document.createElement("p");
        locationElement.classList.add("location");
        locationElement.textContent = event.location;
        eventElement.appendChild(locationElement);
      }

      if ("description" in event) {
        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("description");
        descriptionElement.textContent = event.description;
        eventElement.appendChild(descriptionElement);
      }
    });
};
