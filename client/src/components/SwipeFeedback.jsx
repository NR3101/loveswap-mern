import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";
import { useMatchStore } from "../store/useMatchStore";

const getFeedbackConfig = (swipeFeedback) => {
  const baseConfig = {
    icon: null,
    text: "",
    className: "",
  };

  switch (swipeFeedback) {
    case "liked":
      return {
        icon: Heart,
        text: "Liked!",
        className: "bg-green-500/90 text-white border-green-400",
      };
    case "passed":
      return {
        icon: X,
        text: "Passed",
        className: "bg-red-500/90 text-white border-red-400",
      };
    case "matched":
      return {
        icon: Sparkles,
        text: "It's a Match! 🎉",
        className: "bg-pink-500/90 text-white border-pink-400",
      };
    default:
      return baseConfig;
  }
};

const SwipeFeedback = () => {
  const { swipeFeedback } = useMatchStore();
  const config = getFeedbackConfig(swipeFeedback);

  return (
    <AnimatePresence>
      {swipeFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-0 right-0 mx-auto w-fit z-50"
        >
          <div
            className={`
              flex items-center gap-3 px-8 py-4
              rounded-full border-2 backdrop-blur-md
              shadow-xl font-semibold text-lg
              sm:text-xl md:text-2xl
              ${config.className}
            `}
          >
            {config.icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                  delay: 0.1,
                }}
              >
                <config.icon
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  strokeWidth={2.5}
                />
              </motion.div>
            )}
            <span className="font-bold">{config.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwipeFeedback;
