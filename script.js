const books = [];
const RENDER_EVENT = 'render-book';
const removeSearchButton = document.createElement('button');
const submitSearch = document.getElementById('searchBook');



function saveData() {
  localStorage.setItem('BOOKS', JSON.stringify(books));
}

function loadDataFromStorage() {
  const data = localStorage.getItem('BOOKS');
  if (data !== null) {
    const parsedData = JSON.parse(data);
    for (const book of parsedData) {
      books.push(book);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }
}


function searchBook() {
  const searchQuery = document.getElementById('searchTitle').value.toLowerCase();
  const searchResult = books.filter((book) => book.book.toLowerCase().includes(searchQuery));

  // Dispatch a custom event with the search result
  document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: searchResult }));
  console.log('searchBook: aman');


  //document.getElementById('searchTitle').value = '';


  AddRemoveSearch();

}

function AddRemoveSearch() {
  // const removeSearchButton = document.createElement('button');
  removeSearchButton.classList.add('XXX');
  removeSearchButton.innerText = "X";

  //const submitSearch = document.getElementById('searchBook');
  submitSearch.append(removeSearchButton);
  console.log('removeSearch: aman')

  removeSearchButton.addEventListener('click', function () {
    removeSearch();
    removeSearchButton.remove();
  })
}

function removeSearch() {

  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('searchTitle').value = '';

}

document.addEventListener('DOMContentLoaded', function () {
  loadDataFromStorage();
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    this.reset();
  });

  const submitSearch = document.getElementById('searchBook');
  submitSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
    // this.reset();
    console.log('Submit Search: aman');
  });
});

document.addEventListener(RENDER_EVENT, function (event) {
  const bookList = event.detail || books;

  console.log(bookList);
  const incompleteBookList = document.getElementById('incompleteList');
  incompleteBookList.innerHTML = '';
  const completeBookList = document.getElementById('completeList');
  completeBookList.innerHTML = '';

  console.log('RENDER EVENT: tengah');

  for (const bookItem of bookList) {
    if (bookItem.isComplete) {
      const bookElement = makeBook(bookItem);
      completeBookList.append(bookElement);
    } else {
      const bookElement = makeBook(bookItem);
      incompleteBookList.append(bookElement);
    }
  }

  console.log('RENDER EVENT: aman');
});

/*
const undo = document.getElementsByClassName('yellow');
undo.addEventListener('click', function () {
  bookObject.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
});

const undoButton = document.getElementsByClassName('yellow');
doneButton.addEventListener('click', function () {
  bookObject.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
});
*/


function generateId() {
  // console.log('generateID: aman');
  return +new Date();
}

function generateBookObject(id, book, author, year, isComplete) {
  console.log('generateBookObject : aman');
  return {
    id,
    book,
    author,
    year,
    isComplete
  }
}

function addBook() {
  const bookTitle = document.getElementById('inputTitle').value;
  const bookAuthor = document.getElementById('inputAuthor').value;
  const bookYear = document.getElementById('inputYear').value;
  const isComplete = document.getElementById('inputIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  // console.log('addBook: aman');

}

var removeButton;

function makeBook(bookObject) {

  // Book Info
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.book;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = bookObject.year;

  /*
  // Action Button
  const removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = "Remove Book";

  const undoButton = document.createElement('button');
  undoButton.classList.add('yellow');
  undoButton.innerText = "Undo Read";

  const doneButton = document.createElement('button');
  doneButton.classList.add('green');
  doneButton.innerText = "Done Read";

  // Action Container
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(undoButton, doneButton, removeButton);
  */

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = "Remove Book";
  removeButton.setAttribute('id', 'removveButton');

  console.log(removeButton);

  removeButton.addEventListener('click', function () {
    removeBook(bookObject.id);
  });


  if (bookObject.isComplete) {
    // =============Undo Button================
    const undoButton = document.createElement('button');
    undoButton.classList.add('yellow');
    undoButton.innerText = "Undo Read";

    undoButton.addEventListener('click', function () {
      /*
      bookObject.check = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      */
      undoBookFromCompleted(bookObject.id);
    });

    // =============Remove Button================
    /*
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = "Remove Book";
    removeButton.setAttribute('id', 'removeButton');

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });
    */

    actionContainer.append(undoButton, removeButton);

  } else {
    // =============Belum Selesai Dibaca================
    const doneButton = document.createElement('button');
    doneButton.classList.add('green');
    doneButton.innerText = "Done Read";

    doneButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    /*
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = "Remove Book";
    removeButton.setAttribute('id', 'removeButton');

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });
    */

    actionContainer.append(doneButton, removeButton);
  }


  // Item Book Container 
  const itemBookContainer = document.createElement('article');
  itemBookContainer.classList.add('item_book');
  itemBookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
  itemBookContainer.setAttribute('id', `book-${bookObject.id}`);

  // console.log('makeBook: aman');

  return itemBookContainer;
}

function addBookToCompleted(id) {
  const bookItem = books.find(bookItem => bookItem.id == id);
  bookItem.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  removeSearchButton.remove();
  document.getElementById('searchTitle').value = '';
}

function undoBookFromCompleted(id) {
  const bookItem = books.find(bookItem => bookItem.id == id);
  bookItem.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  removeSearchButton.remove();
  document.getElementById('searchTitle').value = '';
}

function removeBook(id) {
  const bookIndex = books.findIndex(bookItem => bookItem.id == id);
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  removeSearchButton.remove();
  document.getElementById('searchTitle').value = '';
  modelRemove();
}

function modelRemove() {

  // Get the modal
  const modal = document.getElementById('remove-modal');
  modal.style.display = 'block';
  console.log(modal);

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];
  console.log(span);

  span.addEventListener('click', function () {
    modal.style.display = 'none';
    console.log('span on click: aman');
  });

  // Get the button that opens the modal
  const btn = removeButton;
  console.log(btn);

  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      console.log('window on click: aman');
    }
  });

  






  /*
  // When the user clicks the button, open the modal 
  // Define custom events
  const openModalEvent = new Event('openModal');
  const closeModalEvent = new Event('closeModal');

  // When the user clicks the button, dispatch the openModal event
  btn.addEventListener('click', function () {
    modal.dispatchEvent(openModalEvent);
    console.log('btn: aman');
  });

  // When the user clicks on <span> (x), dispatch the closeModal event
  span.addEventListener('click', function () {
    modal.dispatchEvent(closeModalEvent);
    console.log('span: aman');
  });

  // When the user clicks anywhere outside of the modal, dispatch the closeModal event
  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.dispatchEvent(closeModalEvent);
      console.log('window: aman');
    }
  });

  // Add event listeners to the modal for the custom events
  modal.addEventListener('openModal', function () {
    this.style.display = 'block';
    console.log('btn on click: aman');
  });

  modal.addEventListener('closeModal', function () {
    this.style.display = 'none';
    console.log('span on click: aman');
    console.log('window on click: aman');
  });
  */
}



