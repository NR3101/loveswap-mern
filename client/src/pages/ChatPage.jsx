import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { MessageCircleMore, UserX } from "lucide-react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";

const ChatPage = () => {
  const { getMatches, matches, isLoadingMatches } = useMatchStore();
  const {
    messages,
    getMessages,
    subscribeToNewMessages,
    unsubscribeFromNewMessages,
  } = useMessageStore();
  const { authUser } = useAuthStore();

  const { id } = useParams();

  const match = matches.find((m) => m?._id === id);

  useEffect(() => {
    if (authUser && id) {
      getMatches();
      getMessages(id);
      subscribeToNewMessages();
    }

    return () => {
      unsubscribeFromNewMessages();
    };
  }, [
    getMatches,
    authUser,
    getMessages,
    subscribeToNewMessages,
    unsubscribeFromNewMessages,
    id,
  ]);

  if (isLoadingMatches) return <LoadingChatUI />;

  if (!match) return <MatchNotFound />;

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
      <Header />

      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-4 bg-white rounded-lg shadow p-3">
          <img
            src={match.image || "/avatar.png"}
            className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pink-300"
          />
          <h2 className="text-xl font-semibold text-gray-800">{match.name}</h2>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <EmptyState match={match} />
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-3 ${
                  msg.sender === authUser._id ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                    msg.sender === authUser._id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))
          )}
        </div>
        <MessageInput match={match} />
      </div>
    </div>
  );
};

const EmptyState = ({ match }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-full flex items-center justify-center">
        <MessageCircleMore className="size-8 md:w-10 md:h-10 text-pink-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
        No messages yet
      </h3>
      <p className="text-center text-gray-500 max-w-sm">
        Start your conversation with {match.name} by sending your first message!
      </p>
    </div>
  );
};

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <UserX size={64} className="mx-auto text-pink-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Match Not Found
      </h2>
      <p className="text-gray-600">
        Oops! It seems this match doesn&apos;t exist or has been removed.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors 
				focus:outline-none focus:ring-2 focus:ring-pink-300 inline-block"
      >
        Go Back To Home
      </Link>
    </div>
  </div>
);

const LoadingChatUI = () => (
  <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
    <Header />
    <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
      <div className="flex items-center mb-4 bg-white rounded-lg shadow p-3 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>

      <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`h-10 rounded-lg animate-pulse ${
                  i % 2 === 0 ? "bg-pink-200" : "bg-gray-200"
                } w-64`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 opacity-50">
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

export default ChatPage;
