let myLibrary = [];

class Book {
  constructor({ title, author, pages, readStatus }) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.info = function () {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.readStatus}`;
    };
  }
}

async function getBooks($path) {
  const response = await fetch($path);
  const { books } = await response.json();
  return books;
}

function addBookToLibrary(book) {
  myLibrary.push(new Book(book));
}

function displayEachBookInLibrary() {
  const booksGrid = document.getElementById("books-grid");
  booksGrid.innerHTML = "";
  myLibrary.forEach((book, index) => {
    booksGrid.innerHTML += `
    <div class="card ${
      book.readStatus == "completed" ? "bg-green-400" : "bg-red-400"
    }">
      <button data-index=${index} class="delete-book absolute top-4 right-4 px-3 rounded-md uppercase font-bold bg-red-600 text-white">Delete</button>
      <p class="font-bold text-2xl">${book.title}</p>
      <p class="font-semibold text-md">by ${book.author}</p>
      <p class="text-sm">${book.pages} pages</p>
      <div class="text-sm self-end">
        <p class="font-bold uppercase text-right">Status</p>
        <div class="flex flex-row">
          <button data-index=${index} class="change-book-status mr-4">
            <img
              class="w-4 h-auto"
              src="./icons/exchange.svg"
              alt="Exchange"
            />
          </button>
          <p class="text-right">${book.readStatus}</p>
        </div>
      </div>
    </div>`;
  });

  // Handle Delete Book Button
  const deleteBookButtons = document.querySelectorAll(".delete-book");
  deleteBookButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteBook(e.currentTarget.dataset.index);
    });
  });

  // Handle Change Book Status Button
  const status = ["not read yet", "on progress", "completed"];
  const changeBookStatusButtons = document.querySelectorAll(
    ".change-book-status"
  );
  changeBookStatusButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // TODO : Switch States
      let currentStatus = status.indexOf(
        e.currentTarget.nextElementSibling.innerHTML
      );
      let index = e.currentTarget.dataset.index;
      if (myLibrary[index].readStatus == status[2]) {
        myLibrary[index].readStatus = status[0];
      } else {
        myLibrary[index].readStatus = status[currentStatus + 1];
      }
      displayEachBookInLibrary();
    });
  });
}

async function addBooksFromJsonToLibrary() {
  try {
    const books = await getBooks("../books.json");
    books.forEach((book) => {
      addBookToLibrary(book);
    });
    displayEachBookInLibrary();
    console.log(myLibrary);
  } catch (error) {
    console.log(error);
  }
}
addBooksFromJsonToLibrary();

// New Book Button
const newBookButton = document.getElementById("new-book");
newBookButton.addEventListener("click", (e) => {
  document.getElementById("books-form").classList.toggle("h-96");
  e.target.classList.toggle("bg-blue-400");
  e.target.classList.toggle("border-solid");
  e.target.classList.toggle("border-2");
  e.target.classList.toggle("border-black");
  console.log(e.target);
});

function addBookFromForm() {
  let book = {
    title: document.getElementById("book-title").value,
    author: document.getElementById("book-author").value,
    pages: document.getElementById("book-pages").value,
    readStatus: document.querySelector("#book-readStatus option:checked").value,
  };
  // Clear input
  const inputNodes = document.querySelectorAll("div#books-form div input");
  [...inputNodes].forEach((input) => {
    input.value = "";
  });
  // Add Book to myLibrary array
  addBookToLibrary(book);
  // Display each book to HTML
  displayEachBookInLibrary();
}

// Handle Submit Book Button
const submitBookButton = document.getElementById("book-submit");
submitBookButton.addEventListener("click", () => {
  addBookFromForm();
});

function deleteBook(index) {
  myLibrary.splice(index, 1);
  displayEachBookInLibrary();
}
