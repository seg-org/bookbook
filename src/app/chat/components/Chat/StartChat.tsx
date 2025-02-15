import { IoLogoWechat } from "react-icons/io5";

function StartChat() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-gray-600">
      <IoLogoWechat className="h-1/4 w-1/4" />
      <p className="text-xl">เริ่มแชทกัน</p>
    </div>
  );
}

export default StartChat;
