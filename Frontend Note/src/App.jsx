import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./hooks/useSocket.jsx";
import { FaTrash, FaPenAlt } from "react-icons/fa";

const initialState = {
  title: "",
  description: "",
};

function App() {
  const { socket } = useSocket("http://localhost:4000");
  const [note, setNote] = useState(initialState);
  const [notes, setNotes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const getNotes = useCallback(() => {
    socket.on("server:getNotes", (notes) => {
      setNotes(notes);
    });
  }, []);

  useEffect(() => {
    getNotes();
  }, []);

  const deleteNote = (id) => {
    socket.emit("client:deleteNote", id);
  };

  const actions = (e) => {
    e.preventDefault();
    isEdit
      ? socket.emit("client:updateNote", note)
      : socket.emit("client:addNote", note);
    clean();
  };

  const edit = (note) => {
    setIsEdit(true);
    setNote(note);
  };

  const clean = () => {
    setIsEdit(true);
    setNote(initialState);
  };

  return (
    <div className="bg-gray">
      <div className="container mt-5">
        <div className="row">
          <div className="col-4">
            <div className="card  bg-primary">
              <div className="card-title text-center text-white text-truncate fs-3">
                Notas
              </div>
              <div className="card-body">
                <form onSubmit={actions}>
                  <div className="mb-3">
                    <label className="form-label text-white">Titulo</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Escribe un titulo..."
                      className="form-control"
                      autoFocus
                      required
                      value={note.title}
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">Descripción</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Escribe una descripción..."
                      className="form-control"
                      required
                      value={note.description}
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <br />
                  <button className="btn btn-dark" type="submit">
                    {isEdit ? "Editar" : "Guardar"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Inicio Listar notas */}
          <div className="col-8">
            <ol className="list-group list-group-numbered">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="list-group-item d-flex justify-content-between aling-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{note.title}</div>
                    <div className="my-2 me-4">{note.description}</div>
                    
                  </div>

                  <button
                    className="btn btn-danger me-2"
                    onClick={() => deleteNote(note._id)}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      edit(note);
                    }}
                  >
                    <FaPenAlt />
                  </button>
                </li>
              ))}
            </ol>
          </div>
          {/* {/* Fin Listar notas */}
        </div>
      </div>
    </div>
  );
}

export default App;
