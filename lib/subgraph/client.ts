import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/chromadin/v23",
  headers: {
    authorization: `Bearer ${process.env.GRAPH_API_KEY}`,
  },
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
