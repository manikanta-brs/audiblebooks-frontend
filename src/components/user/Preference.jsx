// import { Formik, Form } from "formik";
// import { useGetLanguagesQuery } from "../../store/language/languageApiSlice";
// import { useSelector, useDispatch } from "react-redux";
// import LoadingSpinner from "../LoadingSpinner";
// import { toggleLanguageSelection } from "../../store/user/authSlice";
// import { useUpdateLanguageAPIMutation } from "../../store/user/userApiSlice";
// import { toast } from "react-toastify";

// const Preference = () => {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.auth);
//   const { data: languages, isLoading, error } = useGetLanguagesQuery();
//   const [updateLanguageAPI, { isLoading: languageUpdateLoading }] =
//     useUpdateLanguageAPIMutation();

//   const isLanguageSelected = (languageId) =>
//     userData.languages && userData.languages.includes(languageId);

//   const handleLanguageClick = (languageId) => {
//     dispatch(toggleLanguageSelection(languageId));
//   };

//   const submitHandler = async () => {
//     try {
//       const response = await updateLanguageAPI({
//         languageIds: userData.profileData.languages,
//       }).unwrap();
//       toast.success(response.message);
//     } catch (error) {
//       toast.error(error?.data?.message || error.error);
//     }
//   };

//   return (
//     <div>
//       <Formik>
//         <Form>
//           <h3 className="text-2xl text-white font-semibold tracking-tight">
//             Languages
//           </h3>

//           <div className="grid grid-cols-6 gap-x-6 gap-y-6 mt-3">
//             {isLoading ? (
//               <LoadingSpinner />
//             ) : error ? (
//               <p>Unable to load languages. Please try again later.</p>
//             ) : (
//               languages &&
//               languages.map((language) => (
//                 <div key={language._id}>
//                   <div
//                     className={`bg-transperent border p-4 rounded-lg hover:bg-active group active text-center ${
//                       isLanguageSelected(language._id)
//                         ? "bg-blueBack border-none"
//                         : ""
//                     }`}
//                     onClick={() => handleLanguageClick(language._id)}
//                   >
//                     <p className="line-clamp-2 text-link text-xl mt-1">
//                       {language.name}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="d-grid gap-2 mt-8">
//             <button
//               type="submit"
//               onClick={submitHandler}
//               disabled={languageUpdateLoading}
//               className={`py-2 px-4 btnPurpleColor ${
//                 languageUpdateLoading
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-700 text-white font-bold"
//               }`}
//             >
//               Update
//             </button>
//           </div>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default Preference;
// To update the user preference
import { Formik, Form } from "formik";
import { useGetLanguagesQuery } from "../../store/language/languageApiSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import { toggleLanguageSelection } from "../../store/user/authSlice";
import { useUpdateLanguageAPIMutation } from "../../store/user/userApiSlice";
import { toast } from "react-toastify";

const Preference = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  // console.log(userData);
  // {_id: '678e0f731a2a2d1abb51be10', first_name: 'Manikanta', last_name: 'Dong', email: 'dongala565@gmail.com', languages: Array(2)}
  const { data: languages, isLoading, error } = useGetLanguagesQuery();
  // console.log(languages);
  /*
  
(4) [{…}, {…}, {…}, {…}]
0
: 
{_id: '663c6cce6167b79746bbb56e', name: 'Tamil', code: 'ta', status: true, __v: 0, …}
1
: 
{_id: '663c6cce6167b79746bbb56f', name: 'English', code: 'en en-US en-AU en-GB', status: true, __v: 0, …}
2
: 
{_id: '663c6cce6167b79746bbb570', name: 'Telugu', code: 'te', status: true, __v: 0, …}
3
: 
{_id: '663c6cce6167b79746bbb571', name: 'Hindi', code: 'hi', status: true, __v: 0, …}
length
: 
4
[[Prototype]]
: 
Array(0)
  */
  const [updateLanguageAPI, { isLoading: languageUpdateLoading }] =
    useUpdateLanguageAPIMutation();

  const isLanguageSelected = (languageId) =>
    userData.languages && userData.languages.includes(languageId);

  // const handleLanguageClick = (languageId) => {
  //   dispatch(toggleLanguageSelection(languageId));
  // };
  const handleLanguageClick = (languageId) => {
    if (userData.languages) {
      dispatch(toggleLanguageSelection(languageId));
    }
    // console.log(languageId);
    console.log(userData);
  };

  // const submitHandler = async () => {
  //   try {
  //     const response = await updateLanguageAPI({
  //       languageIds: userData.languages,
  //     }).unwrap();

  //     toast.success(response.message);
  //   } catch (error) {
  //     toast.error(error?.data?.message || error.error);
  //   }
  // };
  const submitHandler = async () => {
    try {
      const response = await updateLanguageAPI({
        languageIds: userData.languages,
      }).unwrap();

      toast.success(response.message);
      dispatch(setUserProfile({ ...userData, languages: userData.languages })); // Update Redux with the latest languages
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div>
      <Formik>
        <Form>
          <h3 className="text-2xl text-white font-semibold tracking-tight">
            Languages
          </h3>

          <div className="grid grid-cols-6 gap-x-6 gap-y-6 mt-3">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <p>Unable to load languages. Please try again later.</p>
            ) : (
              languages &&
              languages.map((language) => (
                <div key={language._id}>
                  <div
                    className={`bg-transperent border p-4 rounded-lg hover:bg-active group active text-center ${
                      isLanguageSelected(language._id)
                        ? "bg-blueBack border-none"
                        : ""
                    }`}
                    onClick={() => handleLanguageClick(language._id)}
                  >
                    <p className="line-clamp-2 text-link text-xl mt-1">
                      {language.name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="d-grid gap-2 mt-8">
            <button
              type="submit"
              onClick={submitHandler}
              disabled={languageUpdateLoading}
              className={`py-2 px-4 btnPurpleColor ${
                languageUpdateLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white font-bold"
              }`}
            >
              Update
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Preference;
