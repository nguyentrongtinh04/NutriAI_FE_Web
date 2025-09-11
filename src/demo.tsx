import React from "react";
import { useSelector } from "react-redux";
import { RootState } from ".././src/redux/store";

const ProfilePage: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth);
const userState = useSelector((state: RootState) => state.user);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Dữ liệu Redux sau khi đăng nhập</h1>

      <pre
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          overflowX: "auto",
          fontSize: "14px",
        }}
      >
        {JSON.stringify(authState, null, 2)}
        {JSON.stringify(userState, null, 2)}
      </pre>
    </div>
  );
};

export default ProfilePage;
