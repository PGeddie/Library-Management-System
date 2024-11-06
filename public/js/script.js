// In-memory storage for books, users, and issued books
const books = [];
const users = [];
const issuedBooks = [];

// Book Cataloging - Add, Update, Delete
// Function to handle adding a new book
document.getElementById("addBookForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("addBookTitle").value;
  const author = document.getElementById("addBookAuthor").value;
  const isbn = document.getElementById("addBookISBN").value;
  const genre = document.getElementById("addBookGenre").value;
  const year = document.getElementById("addBookYear").value;

  try {
      const response = await fetch(`${baseUrl}/books/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({title, author, isbn, genre, year })
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error adding book:", error);
  }
});

// Function to handle updating a book
document.getElementById("updateBookForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("updateBookId").value;
  const title = document.getElementById("updateBookTitle").value;
  const author = document.getElementById("updateBookAuthor").value;
  const isbn = document.getElementById("updateBookISBN").value;
  const genre = document.getElementById("updateBookGenre").value;
  const year = document.getElementById("updateBookYear").value;

  try {
      const response = await fetch(`${baseUrl}/books/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author, isbn, genre, year })
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error updating book:", error);
  }
});

// Function to handle deleting a book
document.getElementById("deleteBookForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("deleteBookId").value;

  try {
      const response = await fetch(`${baseUrl}/books/delete/${id}`, {
          method: "DELETE"
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error deleting book:", error);
  }
});

function displayBooks() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = books.map(b => `<div>${b.id}: ${b.title} by ${b.author}</div>`).join("");
}

// User Management - Register, Update, Delete
// Function to handle adding a new user
document.getElementById("addUserForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const ID = document.getElementById("userID").value;
  const name = document.getElementById("userName").value;
  const address = document.getElementById("userAddress").value;
  const phone = document.getElementById("userPhone").value;
  const email = document.getElementById("userEmail").value;

  try {
      const response = await fetch(`${baseUrl}/users/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ID, name, address, phone, email })
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error adding user:", error);
  }
});

// Function to handle updating user information
document.getElementById("updateUserForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("updateUserId").value;
  const name = document.getElementById("updateUserName").value;
  const address = document.getElementById("updateUserAddress").value;
  const phone = document.getElementById("updateUserPhone").value;
  const email = document.getElementById("updateUserEmail").value;

  try {
      const response = await fetch(`${baseUrl}/users/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, address, phone, email })
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error updating user:", error);
  }
});

// Function to handle deleting a user
document.getElementById("deleteUserForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("deleteUserId").value;

  try {
      const response = await fetch(`${baseUrl}/users/delete/${id}`, {
          method: "DELETE"
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error deleting user:", error);
  }
});

function displayUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = users.map(u => `<div>${u.id}: ${u.name}</div>`).join("");
}

// Circulation Management - Issue and Return Books
document.getElementById("issueBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const issue = {
    bookId: document.getElementById("issueBookId").value,
    userId: document.getElementById("issueUserId").value,
    userId: document.getElementById("issueUserName").value,
    dueDate: new Date(document.getElementById("dueDate").value),
  };
  issuedBooks.push(issue);
  displayCirculationLog();
  e.target.reset();
});

document.getElementById("returnBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const bookId = document.getElementById("returnBookId").value;
  const issue = issuedBooks.find(i => i.bookId === bookId);
  if (issue) {
    const today = new Date();
    const daysOverdue = Math.floor((today - issue.dueDate) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue > 0 ? daysOverdue * 0.5 : 0;
    alert(`Book returned. Fine: R${fine.toFixed(2)}`);
    issuedBooks.splice(issuedBooks.indexOf(issue), 1);
  }
  displayCirculationLog();
  e.target.reset();
});

// Function to handle renewing a book
document.getElementById("renewBookForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("renewBookId").value;
  const additionalDays = document.getElementById("renewAdditionalDays").value;

  try {
      const response = await fetch(`${baseUrl}/books/renew/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ additionalDays })
      });
      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error renewing book:", error);
  }
});


function displayCirculationLog() {
  const log = document.getElementById("circulationLog");
  log.innerHTML = issuedBooks.map(i => `<div>Book ID: ${i.bookId} issued to User ID: ${i.userId}, Due: ${i.dueDate.toDateString()}</div>`).join("");
}

// Function to check and display user fines
document.getElementById("checkFinesBtn").addEventListener("click", async () => {
  const userId = document.getElementById("userId").value;
  
  try {
      const response = await fetch(`${baseUrl}/users/${userId}/fines`);
      const data = await response.json();
      
      document.getElementById("finesAmount").innerText = `Total Fines: R${data.totalFines.toFixed(2)}`;
  } catch (error) {
      console.error("Error fetching fines:", error);
      alert("Unable to retrieve fines. Please try again later.");
  }
});
