import { Redis, redis } from "@repo/redis";
import { KeyManager } from "@repo/redis/managers";

export class PartitionSessionStore {
  private redisClient: Redis;
  private localCache: Map<number, Map<string, string>>;

  constructor() {
    this.redisClient = redis;
    this.localCache = new Map();
  }

  public get(partitionId: number, userId: string): string | undefined {
    const localPartition = this.localCache.get(partitionId);
    if (localPartition && localPartition.get(userId)) {
      return localPartition.get(userId);
    }
  }

  public async set(
    partitionId: number,
    userId: string,
    sessionId: string,
  ): Promise<void> {
    await this.redisClient.hset(
      KeyManager.partitionKey(partitionId),
      userId,
      sessionId,
    );

    let localPartition = this.localCache.get(partitionId);
    if (!localPartition) {
      localPartition = new Map();
      this.localCache.set(partitionId, localPartition);
    }
    localPartition.set(userId, sessionId);
  }

  public async delete(partitionId: number, userId: string): Promise<void> {
    await this.redisClient.hdel(KeyManager.partitionKey(partitionId), userId);

    const localPartition = this.localCache.get(partitionId);
    if (localPartition) {
      localPartition.delete(userId);
    }
  }

  public getPartition(partitionId: number) {
    return [...(this.localCache.get(partitionId)?.keys() || [])];
  }

  public async loadPartition(
    partitionId: number,
  ): Promise<Record<string, string>> {
    const entries = await this.redisClient.hgetall(
      KeyManager.partitionKey(partitionId),
    );
    const localPartition = new Map<string, string>();
    for (const [userId, sessionId] of Object.entries(entries)) {
      localPartition.set(userId, sessionId);
    }
    this.localCache.set(partitionId, localPartition);
    return entries;
  }

  public clearPartition(partitionId: number): void {
    this.localCache.delete(partitionId);
  }

  public allPartitions() {
    return new Set(this.localCache.keys());
  }
}
