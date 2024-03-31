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
  console.log('searchBook: aman');
  AddRemoveSearch();
}

function AddRemoveSearch() {
  removeSearchButton.classList.add('XXX');
  removeSearchButton.innerText = "X";
  submitSearch.append(removeSearchButton);
  console.log('removeSearch: aman');
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
  const bookYear = document.getElementById('inputYear').value;
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
  bookYear.innerText = bookObject.year;
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  const removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = "Remove Book";
  removeButton.setAttribute('id', 'removveButton');
  console.log(removeButton);
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
  console.log('removeBook: masuk diluar if');
  console.log(confirmation);

  modelRemove().then(confirmation => {
    console.log('removeBook: masuk diluar if');
    if (confirmation === true) {
      console.log('removeBook: masuk true');
      const bookIndex = books.findIndex(bookItem => bookItem.id == id);
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      removeSearchButton.remove();
      document.getElementById('searchTitle').value = '';
    } else {
      console.log('removeBook: masuk false');
      return
    }
  });
}
  /*
  if (confirmation == true) {
    console.log('removeBook: masuk true');
    const bookIndex = books.findIndex(bookItem => bookItem.id == id);
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    removeSearchButton.remove();
    document.getElementById('searchTitle').value = '';

  } else if (confirmation == false) {
    console.log('removeBook: masuk false');
    return;

  }
  */

  /*
  const bookIndex = books.findIndex(bookItem => bookItem.id == id);
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  removeSearchButton.remove();
  document.getElementById('searchTitle').value = '';
   */



function modelRemove() {
  console.log('modelRemove: masuk');
  // return false;
  const modal = document.getElementById('remove-modal');
  modal.style.display = 'block';
  console.log(modal);
  const span = document.getElementsByClassName('close')[0];
  console.log(span);

  /*
  span.addEventListener('click', function () {
    modal.style.display = 'none';
    console.log('span on click: aman');
  });
  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      console.log('window on click: aman');
    }
  });
  */

  const yesButton = document.getElementById('yesRemove');
  const noButton = document.getElementById('noRemove');

  return new Promise((resolve, reject) => {
    yesButton.addEventListener('click', function () {
      modal.style.display = 'none';
      console.log('yesButton on click: aman');
      resolve(true);
    });
    noButton.addEventListener('click', function () {
      modal.style.display = 'none';
      console.log('noButton on click: aman');
      resolve(false);
    });
  });

  /*
  yesButton.addEventListener('click', function () {
    modal.style.display = 'none';
    console.log('yesButton on click: aman');
    return true;
  });
  noButton.addEventListener('click', function () {
    modal.style.display = 'none';
    console.log('noButton on click: aman');
    return false;
  });
  */
}