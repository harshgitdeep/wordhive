import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            📬 Contact WordHive
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            We'd Love To Hear From You
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions, suggestions, or feedback? Reach out to the WordHive
            team anytime — we're always happy to connect with fellow writers and
            readers.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Email */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Mail className="text-yellow-700" size={28} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Email Us
            </h2>

            <p className="text-gray-600">contact@wordhive.com</p>
          </div>

          {/* Phone */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Phone className="text-yellow-700" size={28} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Call Us
            </h2>

            <p className="text-gray-600">+91 23456-72890</p>
          </div>

          {/* Address */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <MapPin className="text-yellow-700" size={28} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Visit Us
            </h2>

            <p className="text-gray-600 leading-relaxed">
              WordHive Headquarters <br />
              23 Main Street, Cityville <br />
              Bangalore, India
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl border border-yellow-100 bg-gradient-to-r from-yellow-50 to-amber-50 p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🐝 Let’s Build Something Meaningful Together
          </h3>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Whether you're a writer, reader, or creative enthusiast — WordHive
            is always open for conversations, collaborations, and fresh ideas.
          </p>
        </div>
      </div>
    </section>
  );
}