import { BlobServiceClient } from "@azure/storage-blob";
import { env } from "@repo/env";
import { LogData } from "@repo/validation";
import mime from "mime";

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
      blobContentType: mime.getType(key) || undefined,
    },
  });
};

export const fetchSessionLogs = async (sessionKey: string) => {
  const logs: LogData[] = [];
  for await (const blob of containerClient.listBlobsFlat({
    prefix: sessionKey,
  })) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    const data = (await blockBlobClient.downloadToBuffer()).toString();
    logs.push(JSON.parse(data));
  }
  return logs;
};
