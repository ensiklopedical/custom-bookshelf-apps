const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    this.reset();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const incompleteBookList = document.getElementById('incompleteList');
  incompleteBookList.innerHTML = '';
  const completeBookList = document.getElementById('completeList');
  completeBookList.innerHTML = '';

  console.log('RENDER EVENT: tengah');

  for (const bookItem of books) {
    if (bookItem.check) {
      const bookElement = makeBook(bookItem);
      completeBookList.append(bookElement);
    } else {    
      const bookElement = makeBook(bookItem);
      incompleteBookList.append(bookElement);
    }
  }

  console.log('RENDER EVENT: aman');
});

const undo = document.getElementsByClassName('yellow');
undo.addEventListener('click', function () {
  bookObject.check = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
});

const undoButton = document.getElementsByClassName('yellow');
doneButton.addEventListener('click', function () {
  bookObject.check = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
});


function generateId() {
  // console.log('generateID: aman');
  return +new Date();
}

function generateBookObject(id, book, author, year, check) {
  console.log('generateBookObject : aman');
  return {
    id,
    book,
    author,
    year,
    check
  }
}

function addBook() {
  const bookTitle = document.getElementById('inputTitle').value;
  const bookAuthor = document.getElementById('inputAuthor').value;
  const bookYear = document.getElementById('inputYear').value;
  const bookCheck = document.getElementById('inputIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookCheck);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  
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

  
  if (bookObject.check){
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
      removeTaskFromCompleted(bookObject.id);
    });
    
    actionContainer.append(undoButton, removeButton);

  } else{
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
      removeTaskFromIncompleted(bookObject.id);
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




