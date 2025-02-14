import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import AuthorAccount from "../components/authors/AuthorAccount";
import AuthorUpdatePassword from "../components/authors/AuthorUpdatePassword"; // Changed import

const ProfilePage = () => {
  return (
    <>
      <div className="mx-16">
        <Tabs activeTab="1" className="mt-6" activityClassName="bg-success">
          <Tab
            title="Account"
            class="text-base text-white font-semibold tracking-tight border-b pb-2"
          >
            <AuthorAccount />
          </Tab>
          <Tab
            title="Update Password"
            class="text-base text-white font-semibold tracking-tight border-b pb-2"
          >
            <AuthorUpdatePassword /> {/* Use AuthorUpdatePassword */}
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
