import axios from 'axios';

// 使用Web应用的API端点
const API_BASE_URL = 'https://3000-iyasrztoojmd7m0imhfai-d6807d2b.manusvm.computer/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 任务相关API
export const tasksApi = {
  list: async () => {
    const response = await apiClient.get('/trpc/tasks.list');
    return response.data.result.data;
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/trpc/tasks.getById?input=${JSON.stringify({ id })}`);
    return response.data.result.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/trpc/tasks.create', data);
    return response.data.result.data;
  },
};

// 类型定义
export interface Task {
  id: number;
  publisherId: number;
  title: string;
  description: string;
  category: 'study' | 'fitness' | 'travel' | 'food' | 'life' | 'skill' | 'other';
  taskType: 'oneTime' | 'recurring' | 'group';
  bountyAmount: number;
  participantCount: number;
  currentParticipants: number;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  isOnline: number;
  radius: number;
  startTime: Date | null;
  endTime: Date | null;
  tags: string | null;
  requiredSkills: string | null;
  status: 'open' | 'matched' | 'inProgress' | 'completed' | 'cancelled' | 'disputed';
  verificationMethod: 'photo' | 'checkin' | 'mutual' | 'gps';
  createdAt: Date;
  updatedAt: Date;
}

