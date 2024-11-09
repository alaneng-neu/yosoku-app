interface PercentageBarProps {
  options: {
    name: string;
    percentage: number;
  }[];
}

const PercentageBar: React.FC<PercentageBarProps> = ({ options }) => {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${options[0].percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span>{options[0].percentage}%</span>
        <span>{options[1].percentage}%</span>
      </div>
    </div>
  );
};

export default PercentageBar;
