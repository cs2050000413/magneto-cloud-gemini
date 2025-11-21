
import { Magnet } from '../types';

export const INITIAL_MAGNETS: Magnet[] = [
  {
    id: 'hz-001',
    title: '断桥残雪',
    artist: '宋韵文创',
    imageUrl: 'https://images.unsplash.com/photo-1613901872880-94eb060d961a?q=80&w=800&auto=format&fit=crop',
    description: '西湖十景之一。冬日雪后，桥向阳面冰雪消融，背阴面仍有残雪，从高处眺望，似断非断。',
    location: '杭州·西湖·断桥',
    rarity: 'Common',
    series: '西湖十景'
  },
  {
    id: 'hz-002',
    title: '雷峰夕照',
    artist: '宋韵文创',
    imageUrl: 'https://images.unsplash.com/photo-1536013240727-9050ac3311e2?q=80&w=800&auto=format&fit=crop',
    description: '西湖十景之一。夕阳西下，晚霞镀塔，佛光普照。传说中镇压白娘子的所在。',
    location: '杭州·夕照山',
    rarity: 'Common',
    series: '西湖十景'
  },
  {
    id: 'hz-003',
    title: '三潭印月',
    artist: '杭州工美',
    imageUrl: 'https://images.unsplash.com/photo-1525493019215-5101b1f85507?q=80&w=800&auto=format&fit=crop',
    description: '西湖十景之一。中秋之夜，在塔中点烛，洞口蒙纸，灯光透出，与月光交相辉映。',
    location: '杭州·西湖中心',
    rarity: 'Rare',
    series: '西湖十景'
  },
  {
    id: 'hz-004',
    title: '曲院风荷',
    artist: '杭州工美',
    imageUrl: 'https://images.unsplash.com/photo-1599572975136-29798360d7db?q=80&w=800&auto=format&fit=crop',
    description: '西湖十景之一。夏日荷花盛开，香风徐来，荷叶田田，是赏荷的最佳去处。',
    location: '杭州·岳湖',
    rarity: 'Rare',
    series: '西湖十景'
  },
  // Reward Magnet
  {
    id: 'hz-reward-001',
    title: '西湖金龙·限定版',
    artist: '国宝级大师·吴',
    imageUrl: 'https://images.unsplash.com/photo-1583244532610-2a234e7c3eca?q=80&w=800&auto=format&fit=crop', 
    description: '集齐西湖十景系列解锁的隐藏款。纯金浮雕工艺，象征着西湖的灵气与祥瑞。',
    location: '云深不知处',
    rarity: 'Legendary',
    series: '西湖十景',
    isSecret: true
  }
];
