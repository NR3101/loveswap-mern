import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user);
    else if (dir === "left") swipeLeft(user);
  };

  return (
    <div className="relative w-full max-w-sm h-[28rem]">
      {userProfiles.map((userProfile) => (
        <TinderCard
          className="absolute shadow-none"
          key={userProfile._id}
          onSwipe={(dir) => handleSwipe(dir, userProfile)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={["up", "down"]}
        >
          <div
            className="card bg-white w-96 h-[28rem] select-none rounded-lg overflow-hidden border
					 border-gray-200"
          >
            <figure className="px-4 pt-4 h-3/4">
              <img
                src={userProfile.image || "/avatar.png"}
                alt={userProfile.name}
                className="rounded-lg object-cover h-full pointer-events-none"
              />
            </figure>
            <div className="card-body bg-gradient-to-b from-white to-pink-50">
              <h2 className="card-title text-2xl text-gray-800">
                {userProfile.name}, {userProfile.age}
              </h2>
              <p className="text-gray-600">{userProfile.bio}</p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default SwipeArea;
