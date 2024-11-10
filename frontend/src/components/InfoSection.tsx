// InfoSection.js
const InfoSection = () => {
  const items = [
    {
      icon: "🏛️",
      title: "The first decentralized smart contract platform on Bitcoin",
      description: "Build secure, Bitcoin-secured applications with Stacks.",
    },
    {
      icon: "🚀",
      title: "Trade tokens and assets with high liquidity and no fees",
      description:
        "Access Stacks-based markets for trading tokens and NFTs seamlessly.",
    },
    {
      icon: "🔒",
      title: "Enhanced security through Bitcoin",
      description:
        "Benefit from the security of Bitcoin while leveraging Stacks’ smart contracts.",
    },
    {
      icon: "💰",
      title: "Get started for free and fund your account easily",
      description:
        "Fund your account with Stacks (STX), Bitcoin, or other supported assets.",
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
