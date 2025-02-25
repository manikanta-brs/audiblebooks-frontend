import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import default styles or customize
import AuthorAccount from "../components/authors/AuthorAccount";
import AuthorUpdatePassword from "../components/authors/AuthorUpdatePassword";
import UpdatePassword from "../components/user/UpdatePassword";
import FileUploadForm from "../components/authors/FileUploadForm";
import Account from "../components/user/Account";
import React from "react"; // Ensure React is imported
import MyAudiobooks from "../components/authors/MyAudiobooks";

const ProfilePage = ({ isAuthor }) => {
  // console.log("isAuthor in ProfilePage:", isAuthor); // Add this line
  console.log(`%c hmm author loggged anta mari...`, "color:green");

  return (
    <div className="mx-16">
      <Tabs className="mt-6">
        <TabList className="flex space-x-8 border-b-2 border-gray-300 pb-2 mt-16">
          {/* Use a flex container for the TabList */}
          <Tab className="text-lg text-gray-700 font-semibold tracking-tight cursor-pointer transition-colors duration-300 hover:text-blue-500 focus:outline-none">
            Account
          </Tab>
          <Tab className="text-lg text-gray-700 font-semibold tracking-tight cursor-pointer transition-colors duration-300 hover:text-blue-500 focus:outline-none">
            Update Password
          </Tab>
          {isAuthor && (
            <Tab className="text-lg text-gray-700 font-semibold tracking-tight cursor-pointer transition-colors duration-300 hover:text-blue-500 focus:outline-none">
              Upload Books
            </Tab>
          )}
          {isAuthor && (
            <Tab className="text-lg text-gray-700 font-semibold tracking-tight cursor-pointer transition-colors duration-300 hover:text-blue-500 focus:outline-none">
              My Audiobooks
            </Tab>
          )}
        </TabList>

        <TabPanel>
          {isAuthor ? <AuthorAccount isAuthor={isAuthor} /> : <Account />}
        </TabPanel>
        <TabPanel>
          {isAuthor ? <AuthorUpdatePassword /> : <UpdatePassword />}
        </TabPanel>
        {isAuthor && (
          <TabPanel>
            <FileUploadForm />
          </TabPanel>
        )}
        {isAuthor && (
          <TabPanel>
            <MyAudiobooks />
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
