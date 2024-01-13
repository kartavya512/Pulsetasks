"use client";

import React, { useEffect, useState } from "react";
import { Trash, Pencil } from 'lucide-react';
import Navbar from "../components/Navbar";
import { deleteDoc, doc, onSnapshot, query, updateDoc, collection, where } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const generateRandomColors = (count) => {
  const colors = [];
  const letters = "0123456789ABCDEF";
  
  for (let i = 0; i < count; i++) {
    let color = "#";
    for (let j = 0; j < 6; j++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors.push(color);
  }

  return colors;
};

const page = () => {
  const [todos, setTodos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedTodo, setEditedTodo] = useState({ task: "", description: "" });
  const [loading, setLoading] = useState(true);

  const { user } = UserAuth(); 
  const userUid = user?.uid;
  const displayName = user?.displayName;

  const initialColors = generateRandomColors(10); // Replace 10 with your desired number of initial todos
  const [todoColors] = useState(initialColors);

  useEffect(() => {
    const fetchData = async () => {
      if (!userUid) {
        
        return;
      }

      try {
        const q = query(collection(db, "todo"), where("userUid", "==", userUid));
        const querySnapshot = await onSnapshot(q, (snapshot) => {
          let todoArr = [];
          snapshot.forEach((doc) => {
            todoArr.push({ ...doc.data(), id: doc.id });
          });

          setTodos(todoArr);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userUid, user]);

  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "todo", id));
  };

  const enterEditMode = (id) => {
    setEditMode(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditedTodo({
      task: todoToEdit.task,
      description: todoToEdit.description,
    });
  };

  const exitEditMode = () => {
    setEditMode(null);
    setEditedTodo({ task: "", description: "" });
  };

  const saveEditedTodo = async (id) => {
    await updateDoc(doc(db, "todo", id), editedTodo);
    exitEditMode();
  };

console.log(loading)
  if (loading) {
   
    return <div></div>;
  }

  return (
    <div>
      { user ?
      <div>
      <Navbar />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="capitalize text-2xl font-medium title-font text-gray-900">
              {displayName} ToDos
            </h1>
          </div>
          <div className="grid lg:grid-cols-3 grid-cols-1 ">
            {todos.map((item, index) => (
              <div className="" key={item.id}>
                <div className="p-4">
                  <div
                    className="flex rounded-lg h-full p-8 flex-row justify-between"
                    style={{ backgroundColor: todoColors[index] }}
                  >
                    {editMode === item.id ? (
                      <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                          <input
                            type="text"
                            className=" text-black font-extrabold text-lg title-font w-3/4 rounded-sm"
                            value={editedTodo.task}
                            onChange={(e) =>
                              setEditedTodo({
                                ...editedTodo,
                                task: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex-grow">
                          <textarea rows="4" 
                            className=" text-black resize-none  leading-relaxed text-base rounded-sm lg:w-[75%] w-[75%]"
                            value={editedTodo.description}
                            onChange={(e) =>
                              setEditedTodo({
                                ...editedTodo,
                                description: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                          <h2 className="text-white font-extrabold text-lg title-font">
                            {item.task}
                          </h2>
                        </div>
                        <div className="flex-grow">
                          <p className="text-white leading-relaxed text-base">
                            {item.description}
                          </p>
                          
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col items-end">
                      {editMode === item.id ? (
                        <div className="flex flex-col lg:flex-row">
                          <button
                            className="text-white text-center bg-green-500 px-3 py-1 rounded"
                            onClick={() => saveEditedTodo(item.id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-white bg-red-500 px-3 py-1 rounded lg:mt-0 mt-4 lg:ml-2"
                            onClick={exitEditMode}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Pencil
                            onClick={() => enterEditMode(item.id)}
                            size={28}
                            color="#ffffff"
                            strokeWidth={3}
                          />
                          <Trash
                            onClick={() => deleteItem(item.id)}
                            className="mt-3"
                            size={28}
                            color="#ffffff"
                            strokeWidth={2.75}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section></div>
:(<div>
  <Navbar />
  <div className="flex flex-col items-center mt-60">
    <h1 className="font-medium ">To add ToDo please Signup first</h1>

    <div className="px-6 sm:px-0 max-w-sm mt-4">
      <button
        onClick={handleSignInWithGoogle}
        type="button"
        className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
      >
        <svg
          className="mr-2 -ml-1 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Sign up with Google<div></div>
      </button>
    </div>
  </div></div>)}
    </div>
  );
};

export default page;
