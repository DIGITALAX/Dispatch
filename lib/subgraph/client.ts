import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/chromadin",
  // headers: {
  //   authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
  // },
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
