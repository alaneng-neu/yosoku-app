import { marketTransformer } from "@/transformers/markets.transformers";
import { ClarityMarket, Market } from "@/types/markets.types";
import {
  formDataParseBoolString,
  formDataParseString,
} from "@/utils/form.utils";
import { toastError } from "@/utils/toast.utils";
import { appDetails } from "@/utils/user.utils";
import { openContractCall } from "@stacks/connect";
import {
  Cl,
  ClarityValue,
  fetchCallReadOnlyFunction,
  ListCV,
  Pc,
  PostConditionMode,
} from "@stacks/transactions";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const getCurrentStacksBlock = async (): Promise<number> => {
  const response = await axios.get(
    `${import.meta.env.VITE_STACKS_API_URL}extended`
  );
  return response.data.chain_tip.block_height;
};

export const useCurrentStacksBlock = () => {
  return useQuery<number, AxiosError>({
    queryKey: ["block"],
    queryFn: getCurrentStacksBlock,
  });
};

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

/**
 * Hook to get all markets.
 *
 * @returns The query observer result
 */
export const useGetAllMarkets = (): UseQueryResult<Market[]> => {
  return useQuery<Market[], Error>({
    queryKey: ["markets"],
    queryFn: getAllMarkets,
  });
};

export const createMarket = async (formData: FormData) => {
  const name = formDataParseString(formData.get("name"));
  const description = formDataParseString(formData.get("description"));
  const end = parseInt(formDataParseString(formData.get("end")));

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
    appDetails,
    onFinish: ({ txId }: { txId: string }) => {
      console.log(txId);
    },
    onCancel: () => {
      throw new Error("Transaction was cancelled");
    },
  });
};

/**
 * Hook to create a new market.
 */
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

export const betOnMarket = async ({
  formData,
  walletSender,
}: {
  formData: FormData;
  walletSender: string;
}) => {
  const marketId = formDataParseString(formData.get("marketId"));
  const yesVote = formDataParseBoolString(formData.get("yesVote"));
  const betAmount = formDataParseString(formData.get("betAmount"));

  const amountInMicroStx = Number(betAmount) * 1_000_000;
  const postCondition = Pc.principal(walletSender)
    .willSendEq(amountInMicroStx)
    .ustx();

  await openContractCall({
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    contractName: "prediction-market",
    functionName: "bet",
    functionArgs: [
      Cl.stringUtf8(marketId),
      Cl.bool(yesVote),
      Cl.uint(amountInMicroStx),
    ],
    network: "devnet",
    appDetails,
    onFinish: ({ txId }: { txId: string }) => {
      console.log(txId);
    },
    onCancel: () => {
      throw new Error("Transaction was cancelled");
    },
    postConditionMode: PostConditionMode.Deny,
    postConditions: [postCondition],
  });
};

/**
 * Hook to bet on a market.
 */
export const useBetOnMarket = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { formData: FormData; walletSender: string }>(
    {
      mutationKey: ["markets"],
      mutationFn: betOnMarket,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        window.location.href = "/";
      },
      onError: (error) => {
        toastError(error.message);
      },
    }
  );
};

export const endMarketSession = async (formData: FormData) => {
  const marketId = formDataParseString(formData.get("marketId"));

  await openContractCall({
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    contractName: "prediction-market",
    functionName: "end-market",
    functionArgs: [Cl.stringUtf8(marketId)],
    network: "devnet",
    appDetails,
    onFinish: ({ txId }: { txId: string }) => {
      console.log(txId);
    },
    onCancel: () => {
      throw new Error("Transaction was cancelled");
    },
    postConditionMode: PostConditionMode.Allow,
  });
};

/**
 * Hook to end a market session.
 */
export const useEndMarketSession = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FormData>({
    mutationKey: ["markets"],
    mutationFn: endMarketSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      window.location.href = "/";
    },
    onError: (error) => {
      toastError(error.message);
    },
  });
};
