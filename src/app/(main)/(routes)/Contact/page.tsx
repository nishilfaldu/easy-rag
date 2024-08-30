"use client";

// Convex helps make our backend
// GitHub helps us code together, Visual Studio is a code editor, and Yarn is a package manager which helps us download extensions
// Every folder in app becomes a page, everything on page.tsx (typescript with next) shows on the page
// Typescript is the coding language, Next JS is our environment
// page.tsx in the outer most under app is our main page
// If start with _ in the app, then it understands that it is not a page

import { useState } from "react";

 // Used to store and track data


const Contact = () => { // Creating a contact component
  const [formData, setFormData] = useState({ // formData stores data and setFormData is used to update data
    // Starting values are empty
    name: "", 
    email: "",
    subject: "",
    message: "",
  });

  // Runs when user types something in
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Runs when user clicks "Send Message" button
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page from refreshing when submitted
    console.log("Form data:", formData);
    // BACKEND LOOK INTO THIS - Handle form submission logic here
  };

  return (
    // Everything is inside a universal parent elemet
    <>

    <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-white">
    {/* // Padding, backgroud, corners, etc. */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
    {/* // Label - what user should enter, input - where user actually types, value - links input to formData, onChange - data updates when user types  */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          ></textarea>
        </div>

    {/* // Button submits when clicked; blue button that changes color when hovered over */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send Message
        </button>
      </form>
    </div>
    </>
  );
};

export default Contact;


