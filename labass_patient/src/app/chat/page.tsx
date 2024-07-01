// pages/chat.tsx
import React from "react";
import Header from "../../components/common/header";

const ChatPage: React.FC = () => {
  return (
    <div>
      <Header title="chatting" showBackButton={true} />
      <div className="mt-16">{/* Chat interface content will go here */}</div>
    </div>
  );
};

export default ChatPage;
