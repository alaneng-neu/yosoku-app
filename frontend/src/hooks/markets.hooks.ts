import { marketTransformer } from "@/transformers/markets.transformers";
import { ClarityMarket, Market } from "@/types/markets.types";
import { toastError } from "@/utils/toast.utils";
import { openContractCall } from "@stacks/connect";
import {
  Cl,
  ClarityValue,
  fetchCallReadOnlyFunction,
  ListCV,
} from "@stacks/transactions";
import { useQuery } from "@tanstack/react-query";

const getAllMarkets = async (): Promise<Market[]> => {
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
  const markets = events.value.map((market) =>
    marketTransformer(
      (market as unknown as { type: string; value: ClarityMarket }).value
    )
  );
  console.log(markets);
  return markets;
};

export const useGetAllMarkets = () => {
  return useQuery<Market[], Error>({
    queryKey: ["markets"],
    queryFn: getAllMarkets,
  });
};

export const createMarket = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const end = parseInt(formData.get("end") as string);

  const randomId = Math.floor(Math.random() * 100000000).toString();

  if (!name || !description || !end)
    throw new Error("Name, description, and end are required");

  try {
    let result = { success: false };

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
      onFinish: ({ txId }: { txId: string }) => {
        console.log(txId);
        result = { success: true };
      },
      onCancel: () => {
        throw new Error("Transaction was cancelled");
      },
    });

    return result;
  } catch (e) {
    toastError((e as Error).message);
    return { success: false };
  }
};
