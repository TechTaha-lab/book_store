import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import { apiURL } from "../apiURL.JSX";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
  });
  const [newBookImage, setNewBookImage] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${apiURL}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedBook) return;

    const formData = new FormData();
    formData.append("title", selectedBook.title);
    formData.append("author", selectedBook.author);
    formData.append("category", selectedBook.category);
    formData.append("price", selectedBook.price);

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await fetch(`${apiURL}/books/${selectedBook.book_id}`, {
        method: "PUT",
        body: formData,
      });

      setSelectedBook(null);
      setNewImage(null);
      fetchBooks();
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await fetch(`${apiURL}/books/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleAddBook = async () => {
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("category", newBook.category);
    formData.append("price", newBook.price);

    if (newBookImage) {
      formData.append("image", newBookImage);
    }

    try {
      await fetch(`${apiURL}/books`, {
        method: "POST",
        body: formData,
      });

      setNewBook({ title: "", author: "", category: "", price: "" });
      setNewBookImage(null);
      fetchBooks();
    } catch (err) {
      console.error("Failed to add book:", err);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Admin — Manage Books</h2>

          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#addBookModal"
          >
            + Add Book
          </button>
        </div>

        <div className="d-flex justify-content-end mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.book_id}>
                      <td>{book.book_id}</td>

                      <td>
                        <img
                          src={book.image_url}
                          alt="book"
                          width="60"
                          height="80"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                      </td>

                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{Number(book.price).toFixed(2)}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editBookModal"
                          onClick={() => setSelectedBook({ ...book })}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book.book_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-3">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT BOOK MODAL */}
      <div className="modal fade" id="editBookModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Edit Book</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {selectedBook && (
                <>
                  <div className="mb-3 text-center">
                    <img
                      src={selectedBook.image_url}
                      width="120"
                      height="150"
                      className="rounded shadow-sm mb-2"
                    />
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setNewImage(e.target.files[0])}
                    />
                  </div>

                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedBook.title}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, title: e.target.value })
                    }
                    placeholder="Title"
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedBook.author}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, author: e.target.value })
                    }
                    placeholder="Author"
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedBook.category}
                    onChange={(e) =>
                      setSelectedBook({ ...selectedBook, category: e.target.value })
                    }
                    placeholder="Category"
                  />

                  <input
                    type="number"
                    className="form-control"
                    value={selectedBook.price}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="Price"
                  />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ADD BOOK MODAL */}
      <div className="modal fade" id="addBookModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Add New Book</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setNewBookImage(e.target.files[0])}
                />
              </div>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Category"
                value={newBook.category}
                onChange={(e) =>
                  setNewBook({ ...newBook, category: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>

              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={handleAddBook}
              >
                Add Book
              </button>
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default AdminBooks;
