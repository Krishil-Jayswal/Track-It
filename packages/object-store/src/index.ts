import { BlobServiceClient } from "@azure/storage-blob";
import { env } from "@repo/env";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  env.ABS_CONNECTION_URL,
);
const containerClient = blobServiceClient.getContainerClient(
  env.ABS_CONTAINER_NAME,
);

await containerClient.createIfNotExists();

export const upload = async (key: string, data: string) => {
  const blockBlobClient = containerClient.getBlockBlobClient(key);
  await blockBlobClient.upload(data, data.length, {
    blobHTTPHeaders: {
      blobContentType: "application/json",
    },
  });
};
