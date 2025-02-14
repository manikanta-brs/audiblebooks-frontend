// import { Link } from "react-router-dom";
// const AuthorsList = ({ authors = [] }) => {
//   const currentUserId = localStorage.getItem("userId");

//   console.log("currentUserId:", currentUserId, typeof currentUserId);

//   const filteredAuthors = authors.filter((author) => {
//     console.log("author._id:", author._id, typeof author._id);
//     return String(author._id) !== currentUserId;
//   });

//   console.log("filteredAuthors:", filteredAuthors);

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
//         {/* Authors List */}
//         {filteredAuthors.length > 0 ? (
//           filteredAuthors.map((author) => (
//             <Link to={`/author/${author._id}`} key={author._id}>
//               {" "}
//               {/* Add Link here */}
//               <div className="p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:text-black">
//                 <div className="pt-[100%] relative mb-4">
//                   <img
//                     src={author.avatar}
//                     alt={author.first_name}
//                     className="absolute inset-0 object-cover w-full h-full rounded-lg"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src =
//                         "https://cdn-icons-png.flaticon.com/512/4322/4322991.png";
//                     }}
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div className="flex-1">
//                     <h6 className="text-lg font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
//                       {author.first_name}
//                     </h6>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <p>No authors found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthorsList;
