import React from "react";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <section className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            📄 Terms & Conditions
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Terms of Use
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using WordHive. By
            accessing our platform, you agree to comply with the rules and
            guidelines outlined below.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 sm:p-12">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-8">
            <FileText className="text-yellow-700" size={32} />
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Acceptance of Terms
              </h2>

              <p>
                These terms and conditions outline the rules and regulations for
                using the WordHive platform and related services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Website Usage
              </h2>

              <p>
                By accessing this website, we assume you accept these terms and
                conditions in full. If you disagree with any part of these
                terms, please discontinue the use of WordHive immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                User Responsibilities
              </h2>

              <p>
                Users are expected to engage respectfully within the community,
                avoid misuse of the platform, and ensure that all shared content
                complies with applicable laws and ethical standards.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl border border-yellow-100 bg-gradient-to-r from-yellow-50 to-amber-50 p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🐝 Building a Respectful Creative Community
          </h3>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            WordHive is committed to maintaining a safe, collaborative, and
            inspiring environment where creativity and storytelling can thrive.
          </p>
        </div>
      </div>
    </section>
  );
}
