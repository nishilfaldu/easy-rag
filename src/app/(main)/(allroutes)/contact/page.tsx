"use client";

import { useState } from "react";
import emailjs from 'emailjs-com';

const Contact = () => {
  // Creating a contact component
  const [formData, setFormData] = useState({
    // formData stores data and setFormData is used to update data
    // Starting values are empty
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Used to store and track the status of email sending
  const [status, setStatus] = useState<string | null>(null);

  // Runs when user types something in
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Runs when user clicks "Send Message" button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page from refreshing when submitted
    setStatus('Sending...'); // Sets status to "Sending..."

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // Send the email using EmailJS
      await emailjs.send(
        'service_a215mqo', // Replace with your EmailJS service ID
        'template_kfghvjn', // Replace with your EmailJS template ID
        templateParams,
        'ofeOLDgWqoMosjZ4X' // Replace with your EmailJS user ID
      );
      setStatus('Email sent successfully!'); // Update status if email is sent successfully
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('Failed to send email.'); // Update status if email sending fails
    }
    setFormData({ name: "",
      email: "",
      subject: "",
      message: "",})
  };

  return (
    // Everything is inside a universal parent element
    <>
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-white">
        {/* // Padding, background, corners, etc. */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4c5cfc] to-[#b880fc] mb-4">Contact Us</h2>
          {/* // Label - what user should enter, input - where user actually types, value - links input to formData, onChange - data updates when user types */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
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
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
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
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
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
            className="w-full bg-gradient-to-r from-purple-500 to-[#4c5cfc] hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Send Message
          </button>

          {/* // Display status message if present */}
          {status && <p className="mt-4 text-center text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </>
  );
};

export default Contact;
