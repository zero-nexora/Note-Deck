import { Client } from "@elastic/elasticsearch";
export const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY || "",
  },
});

export const CARD_INDEX = "cards";
export const BOARD_INDEX = "boards";