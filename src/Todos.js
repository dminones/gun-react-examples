import React, { useState } from "react";
import { useGunHash, useGunArray } from "./customHooks";
import Gun from "gun/gun";
import gundb from "./gundb";

import "./style.css";

const formatTodos = todos =>
  Object.keys(todos)
    .filter(key => todos[key])
    .map(key => {
      return {
        key,
        text: todos[key].text,
        date: new Date(todos[key].date)
      };
    })
    .sort((a, b) => a.date > b.date);

const Todos = () => {
  const node = gundb.get("todos");

  const [todos, put, del] = useGunHash(node);

  const [newTodo, setNewTodo] = useState("");
  const add = e => {
    e.preventDefault();
    const now = new Date();
    put(Gun.text.random(), {
      text: newTodo,
      date: now.toISOString()
    });

    setNewTodo("");
  };

  const handleChange = e => setNewTodo(e.target.value);

  return (
    <div>
      <form onSubmit={add}>
        <input value={newTodo} onChange={handleChange} />
        <button onClick={add}>Add</button>
      </form>
      <br />
      <ul>
        {formatTodos(todos).map(todo => (
          <li key={todo.key} onClick={_ => del(todo.key)}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
