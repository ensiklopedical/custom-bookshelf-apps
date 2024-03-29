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
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = "Remove Book";

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

    actionContainer.append(undoButton, removeButton);

  } else {
    // =============Belum Selesai Dibaca================
    const doneButton = document.createElement('button');
    doneButton.classList.add('green');
    doneButton.innerText = "Done Read";

    doneButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = "Remove Book";

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

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
}


