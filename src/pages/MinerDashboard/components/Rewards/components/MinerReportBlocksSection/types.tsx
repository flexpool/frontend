export type ApiBlock = {
  share: number;
  reward: number;
  confirmed: boolean;
  blockNumber: number;
  timestamp: number;
  hash: string;
  blockType: 'block' | 'uncle' | 'orphan';
};
