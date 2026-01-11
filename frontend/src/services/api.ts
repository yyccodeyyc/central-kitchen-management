import axios from 'axios';
import {
  DashboardData,
  AlertData,
  KPI,
  ProductionStandard,
  QualityTrace,
  Supplier,
  ApiResponse,
  ProductionOrder,
  ProductionSchedule,
  ProductionStats
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081',
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

  // ================ 库存管理API ================

  // 库存项目管理
  static async getInventory(): Promise<any[]> {
    const response = await api.get('/api/inventory');
    return response.data;
  }

  static async getInventoryItem(id: number): Promise<any> {
    const response = await api.get(`/api/inventory/${id}`);
    return response.data;
  }

  static async createInventoryItem(data: any): Promise<any> {
    const response = await api.post('/api/inventory', data);
    return response.data;
  }

  static async updateInventoryItem(id: number, data: any): Promise<any> {
    const response = await api.put(`/api/inventory/${id}`, data);
    return response.data;
  }

  static async deleteInventoryItem(id: number): Promise<void> {
    await api.delete(`/api/inventory/${id}`);
  }

  static async getLowStockItems(): Promise<any[]> {
    const response = await api.get('/api/inventory/low-stock');
    return response.data;
  }

  static async getInventoryAlerts(): Promise<any> {
    const response = await api.get('/api/inventory/alerts');
    return response.data;
  }

  static async updateStockLevel(id: number, quantity: number): Promise<any> {
    const response = await api.patch(`/api/inventory/${id}/stock`, { quantity });
    return response.data;
  }

  // 库存统计
  static async getInventoryStats(): Promise<any> {
    const response = await api.get('/api/inventory/stats');
    return response.data;
  }

  // 库存盘点
  static async createInventoryCheck(data: any): Promise<any> {
    const response = await api.post('/api/inventory/checks', data);
    return response.data;
  }

  static async getInventoryChecks(): Promise<any[]> {
    const response = await api.get('/api/inventory/checks');
    return response.data;
  }

  // ================ 质量管理API ================

  // 质量追溯管理
  static async getQualityTraces(): Promise<any[]> {
    const response = await api.get('/api/quality/traces');
    return response.data;
  }

  static async getQualityTrace(id: number): Promise<any> {
    const response = await api.get(`/api/quality/traces/${id}`);
    return response.data;
  }

  static async createQualityTrace(data: any): Promise<any> {
    const response = await api.post('/api/quality/traces', data);
    return response.data;
  }

  static async updateQualityTrace(id: number, data: any): Promise<any> {
    const response = await api.put(`/api/quality/traces/${id}`, data);
    return response.data;
  }

  static async deleteQualityTrace(id: number): Promise<void> {
    await api.delete(`/api/quality/traces/${id}`);
  }

  static async performQualityCheck(id: number, result: string, notes?: string): Promise<any> {
    const response = await api.post(`/api/quality/traces/${id}/check`, { result, notes });
    return response.data;
  }

  static async getQualityStats(): Promise<any> {
    const response = await api.get('/api/quality/stats');
    return response.data;
  }

  static async getExpiringItems(): Promise<any[]> {
    const response = await api.get('/api/quality/expiring');
    return response.data;
  }

  // ================ 供应商管理API ================

  // 供应商管理
  static async getSuppliers(): Promise<any[]> {
    const response = await api.get('/api/suppliers');
    return response.data;
  }

  static async getSupplier(id: number): Promise<any> {
    const response = await api.get(`/api/suppliers/${id}`);
    return response.data;
  }

  static async createSupplier(data: any): Promise<any> {
    const response = await api.post('/api/suppliers', data);
    return response.data;
  }

  static async updateSupplier(id: number, data: any): Promise<any> {
    const response = await api.put(`/api/suppliers/${id}`, data);
    return response.data;
  }

  static async deleteSupplier(id: number): Promise<void> {
    await api.delete(`/api/suppliers/${id}`);
  }

  static async getActiveSuppliers(): Promise<any[]> {
    const response = await api.get('/api/suppliers/active');
    return response.data;
  }

  static async updateSupplierRating(id: number, rating: number): Promise<any> {
    const response = await api.post(`/api/suppliers/${id}/rating`, { rating });
    return response.data;
  }

  static async getSupplierPerformance(): Promise<any> {
    const response = await api.get('/api/suppliers/performance');
    return response.data;
  }

  // ================ 系统管理API ================

  // 用户管理
  static async getUsers(): Promise<any[]> {
    const response = await api.get('/api/users');
    return response.data;
  }

  static async getUser(id: number): Promise<any> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }

  static async createUser(data: any): Promise<any> {
    const response = await api.post('/api/users', data);
    return response.data;
  }

  static async updateUser(id: number, data: any): Promise<any> {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  }

  static async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`);
  }

  static async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    await api.post(`/api/users/${id}/password`, { oldPassword, newPassword });
  }

  // 系统配置
  static async getSystemConfig(): Promise<any> {
    const response = await api.get('/api/system/config');
    return response.data;
  }

  static async updateSystemConfig(data: any): Promise<any> {
    const response = await api.put('/api/system/config', data);
    return response.data;
  }

  // 系统监控
  static async getSystemHealth(): Promise<any> {
    const response = await api.get('/actuator/health');
    return response.data;
  }

  static async getSystemMetrics(): Promise<any> {
    const response = await api.get('/actuator/metrics');
    return response.data;
  }

  // ================ 生产管理API ================

  // 生产订单管理
  static async getProductionOrders(): Promise<ProductionOrder[]> {
    const response = await api.get('/api/production/orders');
    return response.data;
  }

  static async getProductionOrder(id: number): Promise<ProductionOrder> {
    const response = await api.get(`/api/production/orders/${id}`);
    return response.data;
  }

  static async createProductionOrder(data: Partial<ProductionOrder>): Promise<ProductionOrder> {
    const response = await api.post('/api/production/orders', data);
    return response.data;
  }

  static async updateProductionOrder(id: number, data: Partial<ProductionOrder>): Promise<ProductionOrder> {
    const response = await api.put(`/api/production/orders/${id}`, data);
    return response.data;
  }

  static async deleteProductionOrder(id: number): Promise<void> {
    await api.delete(`/api/production/orders/${id}`);
  }

  static async getPendingOrders(): Promise<ProductionOrder[]> {
    const response = await api.get('/api/production/orders/pending');
    return response.data;
  }

  static async approveOrder(id: number, approvedBy: string): Promise<ProductionOrder> {
    const response = await api.post(`/api/production/orders/${id}/approve`, null, {
      params: { approvedBy }
    });
    return response.data;
  }

  static async scheduleOrder(id: number, scheduledDate: string, scheduledBy: string): Promise<ProductionOrder> {
    const response = await api.post(`/api/production/orders/${id}/schedule`, { scheduledDate }, {
      params: { scheduledBy }
    });
    return response.data;
  }

  static async completeOrder(id: number, completedBy: string): Promise<ProductionOrder> {
    const response = await api.post(`/api/production/orders/${id}/complete`, null, {
      params: { completedBy }
    });
    return response.data;
  }

  // 生产排程管理
  static async getProductionSchedules(): Promise<ProductionSchedule[]> {
    const response = await api.get('/api/production/schedules');
    return response.data;
  }

  static async getProductionSchedule(id: number): Promise<ProductionSchedule> {
    const response = await api.get(`/api/production/schedules/${id}`);
    return response.data;
  }

  static async createProductionSchedule(data: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    const response = await api.post('/api/production/schedules', data);
    return response.data;
  }

  static async updateProductionSchedule(id: number, data: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    const response = await api.put(`/api/production/schedules/${id}`, data);
    return response.data;
  }

  static async deleteProductionSchedule(id: number): Promise<void> {
    await api.delete(`/api/production/schedules/${id}`);
  }

  static async getSchedulesByDate(date: string): Promise<ProductionSchedule[]> {
    const response = await api.get(`/api/production/schedules/date/${date}`);
    return response.data;
  }

  static async confirmSchedule(id: number, confirmedBy: string): Promise<ProductionSchedule> {
    const response = await api.post(`/api/production/schedules/${id}/confirm`, null, {
      params: { confirmedBy }
    });
    return response.data;
  }

  static async startSchedule(id: number, startedBy: string): Promise<ProductionSchedule> {
    const response = await api.post(`/api/production/schedules/${id}/start`, null, {
      params: { startedBy }
    });
    return response.data;
  }

  static async completeSchedule(id: number, completedBy: string): Promise<ProductionSchedule> {
    const response = await api.post(`/api/production/schedules/${id}/complete`, null, {
      params: { completedBy }
    });
    return response.data;
  }

  // 生产统计
  static async getProductionStats(startDate: string, endDate: string): Promise<ProductionStats> {
    const response = await api.get('/api/production/stats/orders', {
      params: { startDate, endDate }
    });
    const orderStats = response.data;

    const scheduleResponse = await api.get('/api/production/stats/schedules', {
      params: { startDate, endDate }
    });
    const scheduleStats = scheduleResponse.data;

    return {
      orderStats,
      scheduleStats,
      batchStats: { totalBatches: 0, completedBatches: 0, averageYieldRate: 0 },
      stepStats: { totalSteps: 0, completedSteps: 0, qualityPassRate: 0 }
    };
  }
}

export default api;
