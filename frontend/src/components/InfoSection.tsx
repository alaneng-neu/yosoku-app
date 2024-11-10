// InfoSection.js
const InfoSection = () => {
  const items = [
    {
      icon: "🤝",
      title: "The first community-driven prediction platform on Bitcoin",
      description:
        "Make predictions with friends and the community, all secured by Bitcoin through Stacks.",
    },
    {
      icon: "📈",
      title: "Predict community trends and outcomes with ease",
      description:
        "Join Stacks-based markets to predict outcomes on community-driven topics and events.",
    },
    {
      icon: "🛡️",
      title: "Community-focused security through Bitcoin",
      description:
        "Enjoy a secure experience backed by Bitcoin while participating in community-centered predictions.",
    },
    {
      icon: "🎉",
      title: "Get started for free and connect with others",
      description:
        "Fund your account with Stacks (STX) or Bitcoin and start predicting within the community.",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row justify-around my-8 bg-gray-100 p-4 rounded-lg">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center max-w-xs mb-4 md:mb-0 px-4"
        >
          <div className="text-4xl">{item.icon}</div>
          <h2 className="font-bold text-lg mt-2">{item.title}</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoSection;
