import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
            🔒 Privacy & Security
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Your Privacy Matters
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At WordHive, we value transparency and are committed to protecting
            your personal information while creating a safe experience for every
            user.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 sm:p-12">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-8">
            <ShieldCheck className="text-yellow-700" size={32} />
          </div>

          {/* Section */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information Collection
              </h2>

              <p>
                Your privacy is important to us. It is WordHive's policy to
                respect your privacy regarding any information we may collect
                from you across our website and services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Data
              </h2>

              <p>
                We only ask for personal information when we genuinely need it
                to provide services to you. Information is collected through
                lawful and transparent methods with your consent and awareness.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Transparency & Trust
              </h2>

              <p>
                We clearly communicate why information is being collected and
                how it will be used. Our goal is to maintain a trustworthy,
                secure, and user-focused platform for all writers and readers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl border border-yellow-100 bg-gradient-to-r from-yellow-50 to-amber-50 p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🐝 Safe, Transparent & Community Driven
          </h3>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            WordHive is built with a strong focus on trust, security, and user
            experience — because every story deserves a safe place to grow.
          </p>
        </div>
      </div>
    </section>
  );
}
