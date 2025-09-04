"use client"

import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Your message has been sent successfully! ✅")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <section className="contact-page bg-white text-black px-6 sm:px-10 py-12 max-w-6xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 border-b-4 border-gray-800 inline-block pb-2">
        Contact Us
      </h1>

      <p className="text-gray-700 mb-10">
        Have questions, suggestions, or need help? We’d love to hear from you! Please use the form
        below to reach out or contact us directly via the provided details.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="shadow-md border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="shadow-md border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Contact Information</h2>
          <p className="text-gray-700 mb-4">
            You can also reach us directly using the following details:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>
              📧 Email:{" "}
              <a href="mailto:support@cityfix.com" className="text-blue-600 underline">
                support@cityfix.com
              </a>
            </li>
            <li>📞 Phone: +91 93065 34844</li>
            <li>📍 Address: CityFix HQ, Palwal, Haryana, India</li>
            <li>🕐 Working Hours: Mon - Sat, 9:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
