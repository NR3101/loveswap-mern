import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ match }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const isEmojiPickerRef = useRef(null);
  const { sendMessage } = useMessageStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(match._id, message);
      setMessage("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isEmojiPickerRef.current &&
        !isEmojiPickerRef.current.contains(e.target)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEmojiPickerOpen]);

  return (
    <form className="flex relative" onSubmit={handleSendMessage}>
      <button
        type="button"
        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
      >
        <Smile size={24} />
      </button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-3 pl-12 rounded-l-lg border-2 border-pink-500 
        focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="Type a message..."
      />

      <button
        type="submit"
        className="bg-pink-500 text-white p-3 rounded-r-lg 
        hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        <Send size={24} />
      </button>
      {isEmojiPickerOpen && (
        <div ref={isEmojiPickerRef} className="absolute bottom-20 left-4">
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setMessage((prevMessage) => prevMessage + emojiObject.emoji);
            }}
          />
        </div>
      )}
    </form>
  );
};

export default MessageInput;
