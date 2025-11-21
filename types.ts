
export interface Magnet {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  description: string; // Static description
  location: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  acquiredDate?: string;
  aiStory?: string; // Dynamic content from Gemini
  series?: string; // The collection series this magnet belongs to
  isSecret?: boolean; // If true, this is a hidden/reward magnet
}

export interface Address {
  name: string;
  phone: string;
  region: string;
  detail: string;
}

export type DeliveryStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Exception';

export interface RedemptionRequest {
  id: string;
  userId: string;
  userName: string;
  magnetId: string;
  magnetTitle: string;
  magnetImage: string;
  address: string;
  status: DeliveryStatus;
  requestDate: string;
}

export enum ViewState {
  COLLECTION = 'COLLECTION',
  SCANNER = 'SCANNER',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE',
  DETAIL = 'DETAIL'
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  exp: number;
}
