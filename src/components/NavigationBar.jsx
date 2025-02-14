import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BestSellers from "./user/BestSellers";
import {
  faHome,
  faInfoCircle,
  faBookOpen,
  faStar,
  faUsers,
  faUser,
  faSignOutAlt,
  faAngleDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useGetCategoriesAPIQuery } from "../store/categories/categoryApiSlice";

const NavigationBar = () => {
  const { userData, isLoggedIn, isAuthorLogin } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState(false);
  const browseContainerRef = useRef(null);
  const profileRef = useRef(null); // Add the profile Reference
  let timeoutId;

  // Use the RTK Query hook to fetch categories
  const { data: categories, isLoading, isError } = useGetCategoriesAPIQuery();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const getAvatarUrl = () => {
    return userData?.profileData?.avatar || null;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBrowseMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsBrowseDropdownOpen(true);
  };

  const handleBrowseMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsBrowseDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && profileRef.current.contains(event.target)) {
        // Click inside
        return;
      }
      setIsDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        browseContainerRef.current &&
        !browseContainerRef.current.contains(event.target)
      ) {
        setIsBrowseDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [browseContainerRef]);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-green-500 fixed w-full mt-0 top-0 z-10 px-5 shadow-md">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-white text-lg font-semibold">
                AudibleBooks
              </a>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4 items-center leading-loose px-4">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b border-b-3 px-4 text-white"
                      : "px-3 text-white"
                  }
                >
                  <FontAwesomeIcon icon={faHome} className="mr-1" />
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b border-b-3 px-4 text-white"
                      : "px-3 text-white"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  About
                </NavLink>
                <div
                  className="relative"
                  onMouseEnter={handleBrowseMouseEnter}
                  onMouseLeave={handleBrowseMouseLeave}
                  ref={browseContainerRef}
                >
                  <NavLink // Wrap the button with NavLink
                    to="/categories" // Link to your main categories page
                    className="px-3 text-white cursor-pointer" // Added cursor-pointer for visual feedback
                    onClick={(e) => {
                      if (isBrowseDropdownOpen) {
                        e.preventDefault(); // Prevent navigation if dropdown is open (optional)
                      }
                    }}
                    aria-haspopup="true"
                    aria-expanded={isBrowseDropdownOpen ? "true" : "false"}
                  >
                    <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
                    Browse
                  </NavLink>
                  {isBrowseDropdownOpen && (
                    <div
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="browse-menu-button"
                      onMouseEnter={handleBrowseMouseEnter}
                      onMouseLeave={handleBrowseMouseLeave}
                    >
                      {/* Handle loading and error states */}
                      {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-700">
                          Loading categories...
                        </div>
                      ) : isError ? (
                        <div className="px-4 py-2 text-sm text-red-500">
                          Error loading categories.
                        </div>
                      ) : categories ? (
                        categories.slice(0, 5).map((category) => (
                          <div
                            key={category._id}
                            className="rounded-md overflow-hidden"
                          >
                            <NavLink
                              to={`/category/${encodeURIComponent(
                                category.name
                              )}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              onClick={() => setIsBrowseDropdownOpen(false)}
                            >
                              {category.name}
                            </NavLink>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-700">
                          No categories found.
                        </div>
                      )}
                      {/* Optional: "View All Categories" link */}
                      <div className="rounded-md overflow-hidden">
                        <NavLink
                          to="/categories" // Link to your main categories page
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200" // Added border for separation
                          role="menuitem"
                          onClick={() => setIsBrowseDropdownOpen(false)}
                        >
                          All Categories
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
                <NavLink
                  to="/bestsellers"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b border-b-3 px-4 text-white"
                      : "px-3 text-white"
                  }
                >
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  BestSellers
                </NavLink>
                <NavLink
                  to="/authors"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b border-b-3 px-4 text-white"
                      : "px-3 text-white"
                  }
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-1" />
                  Authors
                </NavLink>
              </div>
            </div>
          </div>
          {/* printing welcome message for the user first_name */}
          <div>
            {isLoggedIn && (
              <div className="flex items-center">
                <div className="text-white text-sm font-semibold mr-2">
                  Welcome, {userData?.profileData?.first_name}!
                </div>
              </div>
            )}
          </div>
          <div className="relative flex items-center pr-4" ref={profileRef}>
            {isLoggedIn && (
              <div className="relative">
                {/* Profile Button */}
                <button
                  className="flex items-center  text-white  transition-all cursor-pointer"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="rounded-full h-10 w-10 object-cover border-2 border-white shadow-md">
                    {getAvatarUrl() ? (
                      <img
                        src={getAvatarUrl()}
                        alt="Profile"
                        className="rounded-full h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/4322/4322991.png";
                        }}
                      />
                    ) : (
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/4322/4322991.png"
                        alt="Default Profile"
                        className="rounded-full h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {userData?.profileData?.first_name && (
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={`w-4 h-4 ml-1 transition-transform ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>
                {/* Dropdown Menu */}
                <ul
                  className={`absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg transition-all transform origin-top-right z-50 ${
                    isDropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  role="menu"
                  aria-labelledby="profile-button"
                >
                  {/* Conditionally render links based on user type */}
                  {!isAuthorLogin ? (
                    <li role="menuitem">
                      <NavLink
                        to="/profile/user"
                        className="block px-4 py-3 hover:bg-gray-700 text-white rounded-t-lg transition-all"
                      >
                        User Account
                      </NavLink>
                    </li>
                  ) : (
                    <li role="menuitem">
                      <NavLink
                        to="/profile/author"
                        className="block px-4 py-3 hover:bg-gray-700 text-white rounded-t-lg transition-all"
                      >
                        Author Account
                      </NavLink>
                    </li>
                  )}
                  <li role="menuitem">
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-3 hover:bg-red-600 text-white rounded-b-lg transition-all"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
