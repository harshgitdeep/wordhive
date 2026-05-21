import React from "react";

export default function AboutUs() {
  return (
    <section className="min-h-screen px-6 py-16">
      {/* Container */}
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            🐝 About WordHive
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Where Stories Find Their Voice
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            WordHive is a modern platform built for writers, bloggers, and
            storytellers who believe words can inspire, educate, and create
            meaningful impact.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1 */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Community
            </h2>

            <p className="text-gray-600 leading-relaxed">
              At WordHive, we strive to create a welcoming environment where
              writers of all levels can share ideas, publish content, and
              connect with like-minded creators from around the world.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Our mission is to empower writers and storytellers with the tools,
              support, and opportunities they need to grow their voice and
              succeed in their creative journey.
            </p>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-14 p-10 rounded-3xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✨ Built for Passionate Writers
          </h3>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Whether you're writing your very first blog or publishing stories
            daily, WordHive gives you a place to express, connect, and grow.
          </p>
        </div>
      </div>
    </section>
  );
}
