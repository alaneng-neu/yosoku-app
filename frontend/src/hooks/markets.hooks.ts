import { openContractCall } from "@stacks/connect";
import {
  Cl,
  ClarityValue,
  fetchCallReadOnlyFunction,
  ListCV,
} from "@stacks/transactions";

export const useGetAllMarkets = async () => {
  const network = "devnet";

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const contractName = "prediction-market";
  const functionName = "get-current-markets";

  const call: ClarityValue = await fetchCallReadOnlyFunction({
    contractName,
    contractAddress,
    senderAddress: contractAddress,
    functionName,
    functionArgs: [],
    network,
  });

  const events = call as ListCV;
  console.log(events);
  return events;
};

export const createMarket = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const end = parseInt(formData.get("end") as string);

  const randomId = Math.floor(Math.random() * 1000000).toString();

  if (!name || !description || !end)
    throw new Error("Name, description, and end are required");

  await openContractCall({
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    contractName: "prediction-market",
    functionName: "add-market",
    functionArgs: [
      Cl.stringUtf8(randomId),
      Cl.stringUtf8(name),
      Cl.stringUtf8(description),
      Cl.uint(end),
    ],
    network: "devnet",
    appDetails: {
      name: "Stacks Prediction Market",
      icon: window.location.origin + "/vite.svg",
    },
    onFinish: ({ txId }: { txId: string }) => console.log(txId),
  });
};
