import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <>
      <Breadcrumb
        pageName="Sign In"
        description="Sign in to access your account"
      />

      <section className="pt-20 pb-20 lg:pt-30 lg:pb-30">
        <div className="container">
          <div className="rounded-3xl bg-white p-6 shadow-md md:p-9 lg:p-12 2xl:p-15">
            <div className="flex flex-wrap justify-center gap-4 lg:gap-0 lg:justify-between">
              <div className="mb-10 max-w-[500px]">
                <h3 className="mb-4 text-3xl font-semibold text-black xl:text-5xl">
                  Sign In
                </h3>
                <p className="text-base font-medium text-body-color">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up here
                  </Link>
                </p>

                <div className="mt-10">
                  <form>
                    <div className="flex flex-col gap-8">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-3 block text-base font-medium text-dark"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your email"
                          className="w-full rounded-md border border-stroke bg-[#f8f8f8] px-6 py-[14px] text-base text-body-color outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="mb-3 block text-base font-medium text-dark"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          className="w-full rounded-md border border-stroke bg-[#f8f8f8] px-6 py-[14px] text-base text-body-color outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="mb-4 flex items-center">
                          <input
                            type="checkbox"
                            name="checkboxes"
                            id="rememberMe"
                            className="h-4 w-4 bg-transparent text-primary focus:ring-0"
                          />
                          <label
                            htmlFor="rememberMe"
                            className="ml-2 text-base font-medium text-body-color"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="mb-4">
                          <a
                            href="#0"
                            className="text-base font-medium text-primary hover:underline"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div>
                        <button className="inline-flex w-full items-center justify-center rounded-md bg-primary px-10 py-[14px] text-center text-base font-medium text-white hover:bg-primary/90">
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
