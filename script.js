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
  document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: searchResult }));
  AddRemoveSearch();
}

function AddRemoveSearch() {
  removeSearchButton.classList.add('XXX');
  removeSearchButton.innerText = "X";
  submitSearch.append(removeSearchButton);
  removeSearchButton.addEventListener('click', function () {
    removeSearch();
    removeSearchButton.remove();
  });
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
  });
});

document.addEventListener(RENDER_EVENT, function (event) {
  const bookList = event.detail || books;
  const incompleteBookList = document.getElementById('incompleteList');
  incompleteBookList.innerHTML = '';
  const completeBookList = document.getElementById('completeList');
  completeBookList.innerHTML = '';
  for (const bookItem of bookList) {
    if (bookItem.isComplete) {
      const bookElement = makeBook(bookItem);
      completeBookList.append(bookElement);
    } else {
      const bookElement = makeBook(bookItem);
      incompleteBookList.append(bookElement);
    }
  }
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, book, author, year, isComplete) {
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
  const bookYear = Number(document.getElementById('inputYear').value);
  const isComplete = document.getElementById('inputIsComplete').checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.book;
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;
  const bookYear = document.createElement('p');
  bookYear.innerText = Number(bookObject.year);
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  const removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = "Remove Book";
  removeButton.setAttribute('id', 'removveButton');
  removeButton.addEventListener('click', function () {
    removeBook(bookObject.id);
  });
  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('yellow');
    undoButton.innerText = "Undo Read";
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
    actionContainer.append(undoButton, removeButton);
  } else {
    const doneButton = document.createElement('button');
    doneButton.classList.add('green');
    doneButton.innerText = "Done Read";
    doneButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
    actionContainer.append(doneButton, removeButton);
  }
  const itemBookContainer = document.createElement('article');
  itemBookContainer.classList.add('item_book');
  itemBookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
  itemBookContainer.setAttribute('id', `book-${bookObject.id}`);
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
  const confirmation = modelRemove();
  modelRemove().then(confirmation => {
    if (confirmation === true) {
      const bookIndex = books.findIndex(bookItem => bookItem.id == id);
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      removeSearchButton.remove();
      document.getElementById('searchTitle').value = '';
    } else {
      return
    }
  });
}

function modelRemove() {
  const modal = document.getElementById('remove-modal');
  modal.style.display = 'block';
  const span = document.getElementsByClassName('close')[0];
  const yesButton = document.getElementById('yesRemove');
  const noButton = document.getElementById('noRemove');

  return new Promise((resolve, reject) => {
    yesButton.addEventListener('click', function () {
      modal.style.display = 'none';
      resolve(true);
    });
    noButton.addEventListener('click', function () {
      modal.style.display = 'none';
      resolve(false);
    });
  });
}
