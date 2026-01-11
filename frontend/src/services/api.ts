import axios from 'axios';
import {
  DashboardData,
  AlertData,
  KPI,
  ProductionStandard,
  ApiResponse
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      console.error('未授权访问');
    } else if (error.response?.status >= 500) {
      // 处理服务器错误
      console.error('服务器错误');
    }
    return Promise.reject(error);
  }
);

// API服务类
export class ApiService {
  // 仪表板相关API
  static async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  }

  static async getKPIs(): Promise<KPI> {
    const response = await api.get('/api/analytics/kpis');
    return response.data;
  }

  static async getAlerts(): Promise<AlertData> {
    const response = await api.get('/api/analytics/comprehensive-alert-report');
    return response.data;
  }

  // 生产效率分析
  static async getProductionEfficiency() {
    const response = await api.get('/api/analytics/production-efficiency');
    return response.data;
  }

  // 成本分析
  static async getCostAnalysis() {
    const response = await api.get('/api/analytics/cost-analysis');
    return response.data;
  }

  // 质量指标
  static async getQualityMetrics() {
    const response = await api.get('/api/analytics/quality-metrics');
    return response.data;
  }

  // 门店绩效
  static async getStorePerformance() {
    const response = await api.get('/api/analytics/store-performance');
    return response.data;
  }

  // 预测分析
  static async getPredictiveAnalytics() {
    const response = await api.get('/api/analytics/predictive-analytics');
    return response.data;
  }

  // 生产标准化管理
  static async getProductionStandards(): Promise<ProductionStandard[]> {
    const response = await api.get('/api/production-standards');
    return response.data;
  }

  static async getProductionStandard(id: number): Promise<ProductionStandard> {
    const response = await api.get(`/api/production-standards/${id}`);
    return response.data;
  }

  static async createProductionStandard(data: Partial<ProductionStandard>): Promise<ProductionStandard> {
    const response = await api.post('/api/production-standards', data);
    return response.data;
  }

  static async updateProductionStandard(id: number, data: Partial<ProductionStandard>): Promise<ProductionStandard> {
    const response = await api.put(`/api/production-standards/${id}`, data);
    return response.data;
  }

  static async deleteProductionStandard(id: number): Promise<void> {
    await api.delete(`/api/production-standards/${id}`);
  }

  // 手动触发检查
  static async triggerInventoryCheck(): Promise<string> {
    const response = await api.post('/api/analytics/inventory-check');
    return response.data;
  }

  static async triggerQualityCheck(): Promise<string> {
    const response = await api.post('/api/analytics/quality-check');
    return response.data;
  }

  // 获取月度报告
  static async getMonthlyReport(year: number, month: number) {
    const response = await api.get(`/api/analytics/monthly-report/${year}/${month}`);
    return response.data;
  }

  // 获取趋势分析
  static async getTrends(period: string) {
    const response = await api.get(`/api/analytics/trends/${period}`);
    return response.data;
  }
}

export default api;
