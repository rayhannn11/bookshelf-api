const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  // getData from request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // return response error 400 if doesnt have name
  if (!name) {
    // Client tidak melampirkan properti name pada request body
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  // return response error 400 if readPage more then pageCount
  if (readPage > pageCount) {
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // push data into books
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  // cek if book success added
  const isSuccess = books.filter((note) => note.id === id);

  // Return response success 201
  if (isSuccess) {
    // Bila buku berhasil dimasukkan
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  // Return response error 500
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  // getData from request
  const { name, reading, finished } = request.query;

  // getAllBooks response 200
  if (!name && !reading && !finished) {
    const response = h
      .response({
        status: "success",
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // getBookByName
  if (name) {
    const filteredBooksName = books.filter((book) => {
      // use regex matching case insensitive
      const nameRegex = new RegExp(name, "gi");
      return nameRegex.test(book.name);
    });

    if (!!filteredBooksName) {
      const response = h
        .response({
          status: "fail",
          message: "Nama buku tidak ditemukan!",
        })
        .code(400);
      return response;
    }

    const response = h
      .response({
        status: "success",
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }
  // getBooksHasBeenRead response 200
  if (reading) {
    // filter book already reading
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );

    const response = h
      .response({
        status: "success",
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // getBooksHasBeenFinished response 200
  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished)
  );

  const response = h
    .response({
      status: "success",
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // find book by id
  const book = books.filter((n) => n.id === bookId)[0];

  // response 200 if have book
  if (book) {
    const response = h
      .response({
        status: "success",
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  // response 404 if doesnt have book
  const response = h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // return response error 400 if doesnt have name
  if (!name) {
    // Client tidak melampirkan properti name pada request body
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  // return response error 400 if readPage more then pageCount
  if (readPage > pageCount) {
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  // find book by id
  const index = books.findIndex((note) => note.id === bookId);

  // response success 200 update book
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
    return response;
  }
  // response error 404 doesn't have id
  const response = h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId); // find book by id

  // response 404 if  have book
  if (index !== -1) {
    books.splice(index, 1);

    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    return response;
  }

  // response 404 if doesnt have book
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
