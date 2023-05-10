export interface Sales {
  tokenIds: string[];
  buyer: string;
  totalPrice: string;
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
  name: string;
  creator: string;
  profile: any;
  transactionHash: string;
  blockTimestamp: string;
}

export type SalesHistoryProps = {
  sales: Sales[];
  salesReducer: Sales[];
  salesLoading: boolean;
};
