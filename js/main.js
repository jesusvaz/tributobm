const url = '../docs/pdf.pdf';

//localStorage.setItem("readingProgress",105);
let pdfDoc = null;
let currentPage = localStorage.getItem("readingProgress")
let pageNum = +currentPage;//15;////currentPage;//1;//currentPage > 1 ? currentPage: 1;
debugger;
let pageIsRendering = false;
let pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');//

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    //aqui tambien podria ser
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
    //debugger;
    //num = localStorage.getItem("readingProgress") > 1 ? 
    //pageNum = localStorage.getItem("readingProgress")  : 
    //pageNum = 1;
    //renderPage(localStorage.getItem("readingProgress") > 1 ? pageNum = localStorage.getItem("readingProgress")  : pageNum = 1)
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
  debugger;
  localStorage.setItem("readingProgress",pageNum.toString());
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
  debugger;
  localStorage.setItem("readingProgress",pageNum.toString());
};

// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    // aqui podria ir local storage logic
    //pageNum=100;
    //pageNum === 1 ? 1 : localStorage.setItem("readingProgress",pageNum);
    //debugger;
    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
