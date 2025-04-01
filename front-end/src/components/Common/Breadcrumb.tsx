import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  pageName: string;
  description: string;
}

const Breadcrumb = ({ pageName, description }: BreadcrumbProps) => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container">
        <div className="flex flex-col items-center">
          <h2 className="mb-3 text-3xl font-semibold text-black sm:text-4xl">
            {pageName}
          </h2>
          <p className="text-base font-medium text-body-color">
            {description}
          </p>
          <div className="mt-5 flex items-center">
            <Link
              href="/"
              className="text-base font-medium text-body-color hover:text-primary"
            >
              Home
            </Link>
            <span className="mx-3">
              <svg
                width="6"
                height="11"
                viewBox="0 0 6 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.131887 9.88534L3.93792 5.54267L0.131887 1.2"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-base font-medium text-primary">
              {pageName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
