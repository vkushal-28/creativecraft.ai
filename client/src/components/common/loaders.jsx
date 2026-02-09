import React from "react";

export const DashboardLoader = () => {
  return (
    <>
      {Array(...Array(8).keys()).map((el) => (
        <div className="p-4 mb-4 max-w-5xl text-sm bg-white border  border-gray-200 rounded-lg cursor-pointer shadow-lg">
          <div className="flex justify-between items-center gap-4 animate-pulse ">
            <div className="flex items-center justify-between w-full pt-1">
              <div className="w-full">
                <div className="h-3 bg-gray-300 rounded-full  w-[80%] mb-3"></div>
                <div className=" w-[40%] h-3 bg-gray-200 rounded-full "></div>
              </div>
              <div className="h-7 bg-gray-300 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const CommunityLoader = () => {
  return (
    <div className="h-full w-full  overflow-y-scroll">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
        {Array(...Array(10).keys()).map((creation, index) => (
          <ImageCardLoader key={index} />
        ))}
      </div>
    </div>
  );
};

export const ImageCardLoader = () => {
  return (
    <div className="relative group  w-auto aspect-square  bg-gray-200 rounded-lg ">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse rounded-lg">
        <svg
          className="w-12 h-12 text-gray-50"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18">
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
    </div>
  );
};
