const TopStories = ({ stories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
      {stories.map((story) => {
        return (
          <div
            className="mb-7 p-2 rounded hover:bg-active group active hover:cursor-pointer rounded-xl"
            key={story.id}
          >
            <div className="pt-[100%] relative mb-4">
              <img
                src={story.url}
                alt="Story image" // Added more descriptive alt text
                className="absolute inset-0 object-cover w-full rounded-xl"
              />
              <button className="w-10 h-10 rounded-full bg-primary absolute group-hover:flex group-focus:flex bottom-2 right-2 items-center justify-center hidden">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  ></polygon>
                </svg>
              </button>
            </div>
            <h6 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-semibolb">
              {story.name}
            </h6>
            <p className="line-clamp-2 text-link text-sm mt-1">
              {story.publisher}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TopStories;
