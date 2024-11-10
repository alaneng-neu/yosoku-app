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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  if (!name || !description || !end)
    throw new Error("Name, description, and end are required");

  await openContractCall({
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    contractName: "prediction-market",
    functionName: "add-market",
    functionArgs: [
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
    },
    onCancel: () => {
      throw new Error("Transaction was cancelled");
    },
  });
};

export const useCreateMarket = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FormData>({
    mutationKey: ["markets"],
    mutationFn: createMarket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      window.location.href = "/";
    },
    onError: (error) => {
      toastError(error.message);
    },
  });
};
