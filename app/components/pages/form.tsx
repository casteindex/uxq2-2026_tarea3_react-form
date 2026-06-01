"use client";
import { useEffect, useState } from "react";

export type Tarea = {
  descripcion: string;
  checked: boolean;
};

const Form = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState<string>("");

  useEffect(() => {
    // Obtener tareas de local storage (ver https://www.w3schools.com/jsref/prop_win_localstorage.asp)
    // Esto solo devuelve strings, no objetos, por lo tanto, se usa JSON.parse para obtener el valor
    // Obtenido de: https://stackoverflow.com/a/2010948
    const tareasGuardadas = localStorage.getItem("tareas");
    setTareas(JSON.parse(tareasGuardadas || "[]"));
    // Sin embargo, JSON.parse requiere que se le pase un string.
    // Como localStorage puede devolver null, hay que decirle qué guardar cuando eso pasa
    // Obtenido de: https://stackoverflow.com/a/46915314
  }, []);

  useEffect(() => {
    // Guardar en localstorage, cada vez que se haga un cambio en tareas
    localStorage.setItem("tareas", JSON.stringify(tareas));
    console.log(JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = () => {
    // Primero verificar que el input text no esté vacío
    if (nuevaTarea === "") return;
    /* Como tareas es un objeto, al asignarse se pasa como referencia,
    para crear una copia, se puede usar el spread operator.
    Obtenido de: https://stackoverflow.com/a/31209486 */
    const temp = [...tareas];
    temp.push({ descripcion: nuevaTarea, checked: false });
    setTareas(temp);
    // Finalmente, borrar el contenido del input text
    setNuevaTarea("");
  };

  const toggleChecked = (key: number) => {
    const temp = [...tareas];
    temp[key].checked = !temp[key].checked;
    setTareas(temp);
  };

  const eliminarTodo = () => {
    setTareas([]);
  };

  const eliminarCompletados = () => {
    // Se crea un nuevo arreglo únicamente con los que no estaban completados
    // Se podría recorrer con un for, con map, o simplemente filtrando los que tienen
    // el valor deseado. Obtenido de: https://stackoverflow.com/a/46573004
    const temp = [...tareas].filter((it) => it.checked === false);
    setTareas(temp);
  };

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h1>Lista de quehaceres</h1>

        <div className="flex gap-4">
          <input
            id="tarea-input"
            type="text"
            className="input"
            placeholder="Tarea"
            value={nuevaTarea}
            onChange={(e) => {
              setNuevaTarea(e.currentTarget.value);
            }}
          />
          <button className="btn" onClick={agregarTarea}>
            Crear nuevo
          </button>
        </div>

        <ul className="p-2">
          {tareas.map((tarea, key) => {
            return (
              <label key={key} className="label block mb-2">
                <input
                  className="checkbox checkbox-md mr-2"
                  type="checkbox"
                  checked={tarea.checked}
                  onChange={() => toggleChecked(key)}
                />
                {tarea.descripcion}
              </label>
            );
          })}
        </ul>

        <div className="grid grid-cols-2 gap-4">
          <button className="btn" onClick={eliminarTodo}>
            Eliminar todo
          </button>
          <button className="btn" onClick={eliminarCompletados}>
            Eliminar completados
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
