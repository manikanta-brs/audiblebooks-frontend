// import { Link } from "react-router-dom";

// const EmailVerifyPage = () => {
//   return (
//     <>
//       <div>
//         <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
//           <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
//             <div className="max-w-md text-center mt-7">
//               <div>
//                 <figure>
//                   <Link to="/home">
//                     <section className="hero container max-w-screen-lg mx-auto flex justify-center">
//                       <img
//                         className="hidden lg:block h-8 w-auto mr-2"
//                         src="/images/logo.svg"
//                         alt="Workflow"
//                       />
//                     </section>
//                   </Link>
//                   <figcaption className="mb-4">Storytime</figcaption>
//                 </figure>
//               </div>
//               <p className="text-2xl font-semibold md:text-3xl mb-3">
//                 Email Verified
//               </p>

//               <Link
//                 className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
//                 to="/login"
//               >
//                 Login to continue
//               </Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default EmailVerifyPage;
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const EmailVerifyPage = () => {
  const { verifyToken } = useParams();
  const [status, setStatus] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`/verifyEmail/${verifyToken}`);
        const data = await res.json();

        if (data.success) {
          setIsAuthor(data.isAuthor); // Assuming the backend response includes isAuthor
          setStatus(data.message);
        } else {
          setStatus(data.message);
        }
      } catch (error) {
        setStatus("An error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [verifyToken]);

  return (
    <div>
      <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center mt-7">
            <div>
              <figure>
                <Link to="/home">
                  <section className="hero container max-w-screen-lg mx-auto flex justify-center">
                    <img
                      className="hidden lg:block h-8 w-auto mr-2"
                      src="/images/logo.svg"
                      alt="Workflow"
                    />
                  </section>
                </Link>
                <figcaption className="mb-4">Storytime</figcaption>
              </figure>
            </div>
            <p className="text-2xl font-semibold md:text-3xl mb-3">{status}</p>

            {/* Conditional Link based on whether it's an author or a user */}
            <Link
              className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
              to="/login"
            >
              {isAuthor ? "Author Login" : "User Login"} to continue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailVerifyPage;
