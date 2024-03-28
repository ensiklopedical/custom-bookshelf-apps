const books = [];
const RENDER_EVENT = 'render-book';
const RENDER_EVENT2 = 'render-book-2';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    this.reset();
  });
   // this.reset();
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  // const incompleteBookList = document.getElementById('incompleteList');
  // incompleteBookList.innerHTML = '';
  // console.log('RENDER EVENT: tengah');

  for (const bookItem of books) {
    // console.log(bookItem.checkBook);
    console.log("loop bookItem");
    if (bookItem.checkBook) {

      const completeBookList = document.getElementById('completeList');
      completeBookList.innerHTML = '';

      const bookElement = makeBook(bookItem);
      completeBookList.append(bookElement);

      console.log('masuk CHECK');

    } else {

      const incompleteBookList = document.getElementById('incompleteList');
      incompleteBookList.innerHTML = '';
      
      const bookElement = makeBook(bookItem);
      incompleteBookList.append(bookElement);
    
      console.log('masuk NO CHECK');
    }
  }
});

document.addEventListener(RENDER_EVENT2, function () {
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

  // const timestamp = document.getElementById('date').value;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookCheck);
  //const bookObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT2));
  
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

  // Action Button
  const doneButton = document.createElement('button');
  doneButton.classList.add('green');
  doneButton.innerText = "Done Read";

  const removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = "Remove Book";

  // Action Container
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(doneButton, removeButton);


  // Item Book Container 
  const itemBookContainer = document.createElement('article');
  itemBookContainer.classList.add('item_book');
  itemBookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
  itemBookContainer.setAttribute('id', `book-${bookObject.id}`);

  // console.log('makeBook: aman');

  return itemBookContainer;
}


