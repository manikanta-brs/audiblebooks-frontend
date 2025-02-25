import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUploadAudiobookAPIMutation } from "../../store/audiobooks/audiobookApiSlice";
import { useGetCategoriesAPIQuery } from "../../store/categories/categoryApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  subcategories: Yup.array(), // Define subcategories in validation schema
  bookCover: Yup.mixed().required("Book Cover is required"),
  bookAudio: Yup.mixed().required("Audio File is required"),
});

const UploadBooks = () => {
  const [bookCover, setBookCover] = useState(null);
  const [bookAudio, setBookAudio] = useState(null);
  const [bookAudioName, setBookAudioName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Track selected subcategories

  const [uploadAudiobook, { isLoading, isSuccess, isError, error }] =
    useUploadAudiobookAPIMutation();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesAPIQuery();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
      }
    };
  }, [bookAudio]);

  const handleUpload = async (values, { setSubmitting, resetForm }) => {
    try {
      // Retrieve authorId from localStorage AND parse the JSON
      const authDataString = localStorage.getItem("persist:auth");
      if (!authDataString) {
        console.error("Authentication data not found in localStorage");
        toast.error("Please login or authenticate to upload audiobooks.");
        setSubmitting(false);
        return;
      }

      try {
        const authData = JSON.parse(authDataString);
        // Safely access and parse userData
        const userDataString = authData?.userData;
        if (!userDataString) {
          console.error("User data not found in authentication data");
          toast.error("Please login or authenticate to upload audiobooks.");
          setSubmitting(false);
          return;
        }

        try {
          const userData = JSON.parse(userDataString);
          // Safely access profileData and _id
          const authorId = userData?.profileData?._id;

          if (!authorId) {
            console.error("Author ID not found in userData");
            toast.error("Author ID not found. Please login or authenticate.");
            setSubmitting(false);
            return;
          }

          const formData = new FormData();
          formData.append("image", values.bookCover);
          formData.append("audiobook", values.bookAudio);
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("categories", JSON.stringify([values.category])); //wrap the category in array
          formData.append("authorId", authorId); // Append authorId
          formData.append(
            "subcategories",
            JSON.stringify(selectedSubcategories)
          );

          // Log FormData for debugging
          for (const entry of formData.entries()) {
            const [key, value] = entry;
            // console.log(`Key: ${key}, Value:`, value);
          }

          const result = await uploadAudiobook(formData).unwrap();
          // console.log("Upload successful:", result);
          toast.success("Upload successful!");
          resetForm();
          setBookCover(null);
          setBookAudio(null);
          setBookAudioName("");
          setSelectedCategory("");
          setSelectedSubcategories([]);
        } catch (userDataParseError) {
          console.error("Error parsing nested JSON data:", userDataParseError);
          toast.error("Error parsing user data. Please login again.");
          setSubmitting(false);
          return;
        }
      } catch (jsonError) {
        console.error("Error parsing authData JSON:", jsonError);
        toast.error("Error parsing authentication data. Please login again.");
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed: " + (err?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (e, setFieldValue) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFieldValue("category", category); // Update Formik's value
    setSelectedSubcategories([]); // Reset subcategories when category changes
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategory)) {
        return prev.filter((s) => s !== subcategory); // Unselect
      } else {
        return [...prev, subcategory]; // Select
      }
    });
  };

  const getAvailableSubcategories = () => {
    if (isCategoriesLoading || isCategoriesError || !categories) {
      return [];
    }
    return categories
      .map((category) => category.name)
      .filter((name) => name !== selectedCategory); // Exclude the selected category
  };

  return (
    <StyledUploadBooks className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-300 rounded-xl shadow-lg p-8 m-4 sm:m-0">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Upload Audiobook
        </h2>
        <Formik
          initialValues={{
            title: "",
            description: "",
            category: "",
            subcategories: [],
            bookCover: null,
            bookAudio: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpload}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <UploadSection>
                <InputArea>
                  <UploadLabel htmlFor="bookCover">
                    <UploadIcon className={bookCover ? "" : "default"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L4 8m4-4v12"
                        />
                      </svg>
                    </UploadIcon>
                    <UploadText>Click to upload book cover</UploadText>
                    <input
                      type="file"
                      id="bookCover"
                      name="bookCover"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue(
                          "bookCover",
                          event.currentTarget.files[0]
                        );
                        const file = event.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBookCover(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setBookCover(null);
                        }
                      }}
                      onBlur={handleBlur}
                    />
                  </UploadLabel>
                  {touched.bookCover && errors.bookCover && (
                    <ErrorMessage
                      name="bookCover"
                      component="div"
                      className="text-red-500 text-xs italic mt-1"
                    />
                  )}
                </InputArea>
                {bookCover && (
                  <PreviewContainer>
                    <CoverPreview src={bookCover} alt="Book Cover Preview" />
                  </PreviewContainer>
                )}
              </UploadSection>

              <UploadSection>
                <InputArea>
                  <UploadLabel htmlFor="bookAudio">
                    <UploadIcon className={bookAudio ? "" : "default"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-6 3-6zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 3-6 3-6z"
                        />
                      </svg>
                    </UploadIcon>
                    <UploadText>Click to upload audio file</UploadText>
                    <input
                      type="file"
                      id="bookAudio"
                      name="bookAudio"
                      accept="audio/*"
                      onChange={(event) => {
                        setFieldValue(
                          "bookAudio",
                          event.currentTarget.files[0]
                        );
                        const file = event.target.files[0];
                        if (file) {
                          setBookAudio(URL.createObjectURL(file));
                          setBookAudioName(file.name);
                        } else {
                          setBookAudio(null);
                          setBookAudioName("");
                        }
                      }}
                      onBlur={handleBlur}
                    />
                  </UploadLabel>
                  {touched.bookAudio && errors.bookAudio && (
                    <ErrorMessage
                      name="bookAudio"
                      component="div"
                      className="text-red-500 text-xs italic mt-1"
                    />
                  )}
                </InputArea>
                {bookAudio && (
                  <PreviewContainer>
                    <AudioPlayerContainer>
                      <PlayButton onClick={togglePlay}>
                        {isPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.75 5.25a3 3 0 013 3v1.5h2.25a3 3 0 013 3v0a3 3 0 01-3 3H9.75V18.75a3 3 0 01-3-3v-1.5H4.5a3 3 0 01-3-3v0a3 3 0 013-3H6.75V5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.333 2.779-1.643l11.54 6.757c.906.53 1.541 1.512 1.541 2.51v0c0 1.002-.635 1.983-1.541 2.51l-11.54 6.757c-1.25.739-2.779-.167-2.779-1.643v-11.304z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </PlayButton>
                      <AudioTitle>{bookAudioName}</AudioTitle>
                      <audio
                        src={bookAudio}
                        ref={audioRef}
                        style={{ display: "none" }}
                      />
                    </AudioPlayerContainer>
                  </PreviewContainer>
                )}
              </UploadSection>

              <UploadSection>
                <InputArea>
                  <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Title:
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs italic mt-1"
                  />
                </InputArea>
              </UploadSection>

              <UploadSection>
                <InputArea>
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description:
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs italic mt-1"
                  />
                </InputArea>
              </UploadSection>

              <UploadSection>
                <InputArea>
                  <label
                    htmlFor="category"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Category:
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => handleCategoryChange(e, setFieldValue)}
                    value={values.category} // Bind the value for Formik
                  >
                    <option value="">Select a category</option>
                    {isCategoriesLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : isCategoriesError ? (
                      <option disabled>Error loading categories</option>
                    ) : (
                      categories?.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-xs italic mt-1"
                  />
                </InputArea>
              </UploadSection>

              {/* Subcategory Section */}
              {selectedCategory && (
                <UploadSection>
                  <InputArea>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Subcategories:
                    </label>
                    <SubcategoryList>
                      {getAvailableSubcategories().map((subcategory) => (
                        <SubcategoryItem key={subcategory}>
                          <input
                            type="checkbox"
                            id={`subcategory-${subcategory}`}
                            value={subcategory}
                            checked={selectedSubcategories.includes(
                              subcategory
                            )}
                            onChange={() =>
                              handleSubcategoryChange(subcategory)
                            }
                          />
                          <label htmlFor={`subcategory-${subcategory}`}>
                            {subcategory}
                          </label>
                        </SubcategoryItem>
                      ))}
                    </SubcategoryList>
                  </InputArea>
                </UploadSection>
              )}

              <div className="flex items-center justify-center">
                <UploadButton
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isLoading || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading || isSubmitting ? "Uploading..." : "Upload"}
                </UploadButton>
              </div>

              {isSuccess && <p>Upload successful!</p>}
              {isError && <p>Error: {error?.data?.message || error.message}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </StyledUploadBooks>
  );
};

const StyledUploadBooks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
`;

const UploadSection = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribute space between label and preview */
  gap: 20px;
`;

const InputArea = styled.div`
  flex: 1; /* Take up remaining space */
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  border: 2px dashed #886ab5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(136, 106, 181, 0.1);
    transform: scale(1.03);
  }

  input[type="file"] {
    display: none;
  }
`;

const UploadIcon = styled.div`
  svg {
    width: 50px; /* Adjust as needed */
    height: 50px; /* Adjust as needed */
    color: #886ab5;
  }
  &.audio {
    svg {
      width: 40px; /* Adjust as needed */
      height: 40px; /* Adjust as needed */
    }
  }
`;

const UploadText = styled.span`
  font-size: 1rem;
  color: #4a3366;
  font-weight: 500;
  text-align: center;
`;

const PreviewContainer = styled.div`
  width: 200px;
  height: auto; /* Allow content to dictate height */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
`;

const CoverPreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
`;

const UploadButton = styled.button`
  background-color: #886ab5;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #664a85;
  }
`;

const AudioPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 5px 10px;
  width: 100%;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #886ab5;
  }
`;

const AudioTitle = styled.span`
  flex: 1;
  font-size: 0.9rem;
  color: #4a3366;
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubcategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SubcategoryItem = styled.div`
  display: flex;
  align-items: center;
  label {
    margin-left: 4px;
    color: #4a3366;
  }
`;

export default UploadBooks;
