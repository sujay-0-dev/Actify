"use client";

import React from "react";

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  className?: string;
}

export default function StatsSection({
  title = "Our impact in numbers",
  subtitle = "We've helped thousands of users achieve their goals",
  stats = [
    { value: "10k+", label: "Users", description: "Active monthly users" },
    { value: "24/7", label: "Support", description: "Round-the-clock assistance" },
    { value: "95%", label: "Satisfaction", description: "Average customer satisfaction" },
    { value: "100+", label: "Countries", description: "Global reach and presence" },
  ],
  className = "",
}: StatsSectionProps) {
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">{subtitle}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-indigo-600">{stat.value}</p>
                <p className="mt-2 text-lg font-medium text-gray-900">{stat.label}</p>
                {stat.description && (
                  <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}