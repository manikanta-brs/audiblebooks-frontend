import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faList,
  faUser,
  faSearch,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const AboutSection = () => {
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("auto");

  const maxHeight = 400; // Set a maximum height for the image

  useEffect(() => {
    const setImageHeight = () => {
      if (imageRef.current && contentRef.current) {
        let imageHeight = imageRef.current.offsetHeight;

        // Apply maximum height limit
        if (imageHeight > maxHeight) {
          imageHeight = maxHeight;
        }

        setContentHeight(imageHeight + "px");
      }
    };

    setImageHeight();
    window.addEventListener("resize", setImageHeight);

    return () => {
      window.removeEventListener("resize", setImageHeight);
    };
  }, [maxHeight]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          About <span className="text-blue-600">AudibleBooks</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Container (Left) */}
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" // Replace with your actual image URL
              alt="Open Book"
              className="object-cover w-full"
              style={{ maxHeight: maxHeight + "px" }}
            />
          </div>

          {/* Content Container (Right) */}
          <div ref={contentRef} style={{ height: contentHeight }}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              At AudibleBooks, our mission is to make the world of audiobooks
              accessible and enjoyable for everyone. We believe in the
              transformative power of storytelling – to educate, inspire, and
              entertain. We are dedicated to bringing you the best audiobooks
              from diverse authors and genres.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              What We Offer
            </h3>
            <ul className="list-none pl-0 mb-8">
              <li className="py-2">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="mr-2 text-blue-500"
                />
                <span className="font-semibold text-gray-700">
                  Extensive Library:
                </span>{" "}
                Thousands of audiobooks to explore.
              </li>
              <li className="py-2">
                <FontAwesomeIcon icon={faList} className="mr-2 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  Curated Recommendations:
                </span>{" "}
                Find your next favorite listen.
              </li>
              <li className="py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  Author Spotlights:
                </span>{" "}
                Discover talented authors.
              </li>
              <li className="py-2">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="mr-2 text-blue-500"
                />
                <span className="font-semibold text-gray-700">
                  Easy Browsing:
                </span>{" "}
                Find the perfect audiobook by category.
              </li>
              <li className="py-2">
                <FontAwesomeIcon
                  icon={faLaptop}
                  className="mr-2 text-blue-500"
                />
                <span className="font-semibold text-gray-700">
                  User-Friendly Experience:
                </span>{" "}
                Enjoy our website and app.
              </li>
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-xl p-8 mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Why Choose AudibleBooks?
          </h3>
          <p className="text-gray-700 leading-relaxed text-center">
            We are passionate about audiobooks and committed to providing the
            best possible listening experience. Our diverse collection caters to
            all ages and interests. Whether you're a seasoned listener or new to
            audiobooks, we're here to help you discover your next adventure.
          </p>
        </div>

        {/* Connect With Us */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Connect With Us
          </h3>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
