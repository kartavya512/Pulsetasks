"use client";
import { collection, addDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import Link from "next/link";

const AddTodo = () => {
  const [todo, setTodo] = useState({ task: "", description: "" });
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      if (todo.task !== "" ) {
        const userUid = user.uid; // Get the user's UID
        console.log(userUid, user.displayName);
        await addDoc(collection(db, "todo"), {
          task: todo.task,
          description: todo.description,
          userName: user.displayName, // Assuming the user has a display name
          userEmail: user.email,
          userUid: userUid, // Include the user's UID in the document
        });
        setTodo({ task: "", description: "" });

        alert("Todo added successfully . Click on Mytodos to check");
      }
      else{
        alert("add task and description")
        
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const onChange = (e) => {
    setTodo((prevTodo) => ({ ...prevTodo, [e.target.name]: e.target.value }));
  };

  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  if (loading) {
   
    return <div></div>;
  }

  return (
    <>
    
      {user ? (
        <div className="flex justify-center items-center mt-40">
          <div className="bg-gray-100 lg:w-[60%] shadow-2xl w-[80%]">
            <section className="text-gray-600 body-font">
              <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                  <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">
                    Add Your ToDo
                  </h1>
                </div>
                <div className="flex-col lg:w-2/3 w-full mx-auto px-8 space-y-4  items-end">
                  <div className="relative flex-grow w-full">
                    <label className="leading-7 text-sm text-gray-600">
                      Task
                    </label>
                    <input
                      value={todo.task}
                      type="text"
                      onChange={onChange}
                      name="task"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    ></input>
                  </div>
                  <div className="relative flex-grow w-full">
                    <label className="leading-7 text-sm text-gray-600">
                      Description
                    </label>
                    <input
                      type="text"
                      value={todo.description}
                      onChange={onChange}
                      name="description"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    ></input>
                  </div>
                  <button
                    onClick={addTodo}
                    className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    ADD
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-60 ">
          <h1 className="font-medium ">To add ToDo please Signup first</h1>

          <div class="px-6 sm:px-0 max-w-sm mt-4">
            <button
              onClick={handleSignInWithGoogle}
              type="button"
              class="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
            >
              <svg
                class="mr-2 -ml-1 w-4 h-4"
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
        </div>
      )}
    </>
  );
};

export default AddTodo;
