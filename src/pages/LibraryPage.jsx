import { Link } from "react-router";
import LibraryList from "../components/LibraryList";

const library = [
  {
    _id: 1,
    name: "history",
    url: "",
    publisher: "sam",
  },
  {
    _id: 2,
    name: "geography",
    url: "",
    publisher: "john",
  },
  {
    _id: 3,
    name: "math",
    url: "",
    publisher: "jane",
  },
  {
    _id: 4,
    name: "science",
    url: "",
    publisher: "bill",
  },
  {
    _id: 5,
    name: "english",
    url: "",
    publisher: "tom",
  },
  {
    _id: 6,
    name: "biology",
    url: "",
    publisher: "sarah",
  },
  {
    _id: 7,
    name: "politics",
    url: "",
    publisher: "mike",
  },
];
// const library = [];
const LibraryPage = () => {
  return (
    <div className="container mx-auto px-6 mt-8">
      {/* Return empty messsage if no items found in library*/}
      {library.length === 0 && (
        <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
          <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
            <div className="max-w-md text-center mt-7">
              <p className="text-2xl font-semibold md:text-3xl">
                The library is currently empty
              </p>
              <p className="mt-4 mb-8 dark:text-gray-400">
                Find more of the stories among our popular stories
              </p>
              <Link
                className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
                to={"/home"}
              >
                Go To Popular Stories
              </Link>
            </div>
          </div>
        </section>
      )}
      {library.length > 0 && <LibraryList library={library} />}
    </div>
  );
};

export default LibraryPage;
