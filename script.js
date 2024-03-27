document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
});

function addBook() {
  const bookTitle = document.getElementById('inputTitle').value;
  const bookAuthor = document.getElementById('inputAuthor').value;
  const bookYear = document.getElementById('inputYear').value;

  // const timestamp = document.getElementById('date').value;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear);
  //const bookObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(dummyAddBook) {

  // Book Info
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = dummyAddBook.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = dummyAddBook.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = dummyAddBook.year;

  // Action Button
  const doneButton = document.createElement('button').classList.add('green');
  doneButton.innerText = 'Done Read';
  const removeButton = document.createElement('button').classList.add('red');
  removeButton.innerText = 'Remove Book';

  // Action Container
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(doneButton, removeButton);


  // Item Book Container 
  const itemBookContainer = document.createElement('article');
  itemBookContainer.classList.add('item_book');
  itemBookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
  itemBookContainer.setAttribute('id', `book-${dummyAddBook.id}`);

  return itemBookContainer;
}


test git

