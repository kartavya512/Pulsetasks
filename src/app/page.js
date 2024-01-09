"use client"

import Image from 'next/image'
import Navbar from './components/Navbar'

import AddTodo from './components/AddTodo'
import { AuthContextProvider } from "../app/context/AuthContext"
export default function Home() {
  return (
    <AuthContextProvider>
   <Navbar/>
   <AddTodo/>
   </AuthContextProvider>
)}
