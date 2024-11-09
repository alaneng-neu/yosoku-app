import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EventHeadlinerProps {
  className?: string;
  title: string;
  options: {
    name: string;
    percentage: number;
  }[];
  expirationDate: Date;
  imageUrl: string;
  pot: string;
}

const EventHeadliner: React.FC<EventHeadlinerProps> = ({
  className,
  title,
  options,
  expirationDate,
  imageUrl,
  pot,
}) => {
  const onVote = (choice: number) => {
    console.log(choice);
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg shadow-slate-300 shadow-md p-6 flex flex-col sm:flex-row",
        className
      )}>
      <div className="flex-initial mb-4 sm:mb-0 sm:w-1/3 md:max-w-[150px] md:flex md:flex-col md:justify-center">
        <img
          src={imageUrl}
          alt="Market image"
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="flex-1 sm:ml-8 flex flex-col justify-center">
        <h1 className="font-bold text-2xl sm:text-3xl">{title}</h1>
        <div className="mt-4">
          {options.map((option, index) => (
            <p key={index} className="text-xl">
              {option.name}
            </p>
          ))}
        </div>
        <p className="mt-2 text-xl">
          Add to the current pot: <b>{pot}</b>
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Expires at {expirationDate.toDateString()}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-end sm:items-start mt-4 sm:mt-0">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Cast Your Vote
          </h2>
          <div className="space-y-4 w-full max-w-xs sm:max-w-none">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onVote(index)}
                className="w-full"
                variant="outline">
                Vote for {option.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeadliner;
