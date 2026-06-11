import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import bannerimage from "@/assets/images/banner1.jpg";

const AutomatedReminders = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* TOP HERO */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-3">
              Crafted to Serve All Business Needs
            </p>

            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Optimize Your Payment Workflow
            </h2>

            <p className="text-gray-600 mb-6">
              Streamline payments, automate billing, and manage transactions
              with a unified platform built for modern businesses.
            </p>

            <Button size="lg" className="bg-[#448AFF] text-base font-medium hover:bg-blue-700">
              Get Started
            </Button>
          </div>

          {/* Right Card UI */}
          <div className="relative">
            <div className="bg-linear-to-br from-blue-700 to-blue-400 p-8 rounded-2xl shadow-xl">

              <div className="bg-white rounded-xl p-4 shadow-md w-56">
                <p className="text-sm font-semibold mb-2">Payment Methods</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Credit Card</li>
                  <li>• Bank Transfer</li>
                  <li>• Wallet</li>
                </ul>
              </div>

              <div className="bg-blue-900 text-white rounded-xl p-4 shadow-lg w-64 absolute bottom-6 right-6">
                <p className="text-sm opacity-80">Balance</p>
                <p className="text-2xl font-bold">$15,580</p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Image */}
          <div className="relative">
            <img
              src={bannerimage}
              alt="Client Meeting"

              className="rounded-2xl shadow-lg"
            />


          </div>

          {/* Right Content */}
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-3">
              Features
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Efficiently Handle Your Clients&rsquo; Payments
            </h3>

            <p className="text-gray-600 mb-6">
              Accept payments from anywhere, automate invoicing,
              and track performance with real-time analytics.
            </p>

            <Button size="lg" className="bg-[#448AFF] text-base font-medium hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-3">
              Crafted to Serve All Business Needs
            </p>

            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Optimize Your Payment Workflow
            </h2>

            <p className="text-gray-600 mb-6">
              Streamline payments, automate billing, and manage transactions
              with a unified platform built for modern businesses.
            </p>

            <Button size="lg" className="bg-[#448AFF] text-base font-medium hover:bg-blue-700">
              Get Started
            </Button>
          </div>

          {/* Right Card UI */}
          <div className="relative">
            <div className="bg-linear-to-br from-blue-700 to-blue-400 p-8 rounded-2xl shadow-xl">

              <div className="bg-white rounded-xl p-4 shadow-md w-56">
                <p className="text-sm font-semibold mb-2">Payment Methods</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Credit Card</li>
                  <li>• Bank Transfer</li>
                  <li>• Wallet</li>
                </ul>
              </div>

              <div className="bg-blue-900 text-white rounded-xl p-4 shadow-lg w-64 absolute bottom-6 right-6">
                <p className="text-sm opacity-80">Balance</p>
                <p className="text-2xl font-bold">$15,580</p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Image */}
          <div className="relative">
            <img
              src={bannerimage}
              alt="Client Meeting"

              className="rounded-2xl shadow-lg"
            />


          </div>

          {/* Right Content */}
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-3">
              Features
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Efficiently Handle Your Clients&rsquo; Payments
            </h3>

            <p className="text-gray-600 mb-6">
              Accept payments from anywhere, automate invoicing,
              and track performance with real-time analytics.
            </p>

            <Button size="lg" className="bg-[#448AFF] text-base font-medium hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AutomatedReminders