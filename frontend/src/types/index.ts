// 数据分析相关类型
export interface DashboardData {
  productionEfficiency: ProductionEfficiency;
  costAnalysis: CostAnalysis;
  qualityMetrics: QualityMetrics;
  storePerformance: StorePerformance;
  overallScore: number;
  lastUpdated: string;
}

export interface ProductionEfficiency {
  productionStatusStats: Record<string, number>;
  productionCycle: {
    averageCycleTime: number;
    targetCycleTime: number;
    efficiency: number;
  };
  capacityUtilization: {
    dailyTarget: number;
    dailyActual: number;
    utilizationRate: number;
  };
}

export interface CostAnalysis {
  totalCost: number;
  costByCategory: Record<string, number>;
  costTrend: Record<string, number>;
  costMetrics: {
    costPerUnit: number;
    targetCostPerUnit: number;
    costVariance: number;
  };
}

export interface QualityMetrics {
  passRate: number;
  qualityIssues: Record<string, number>;
  supplierQualityScores: Record<string, number>;
  qualityTrend: {
    thisMonth: number;
    lastMonth: number;
    improvement: number;
  };
}

export interface StorePerformance {
  salesData: {
    totalSales: number;
    averageOrderValue: number;
    customerSatisfaction: number;
  };
  efficiencyMetrics: {
    averageServiceTime: number;
    orderFulfillmentRate: number;
    inventoryTurnover: number;
  };
  storeRanking: Array<{
    storeName: string;
    sales: number;
    rank: number;
  }>;
}

// KPI指标类型
export interface KPI {
  productionEfficiency: number;
  qualityPassRate: number;
  costPerUnit: number;
  customerSatisfaction: number;
  onTimeDelivery: number;
  inventoryTurnover: number;
}

// 预警信息类型
export interface AlertData {
  inventoryAlerts: {
    expiredItems: any[];
    expiringSoonItems: any[];
    lowStockItems: string[];
    totalAlerts: number;
  };
  demandPrediction: {
    predictedDemand: Record<string, number>;
    nextWeekTotal: number;
  };
  reorderAlerts: {
    reorderItems: Record<string, any>;
    totalReorderAlerts: number;
  };
  qualityAlerts: {
    failedInspections: any[];
    quarantinedItems: any[];
    totalQualityAlerts: number;
  };
}

// 生产标准化类型
export interface ProductionStandard {
  id: number;
  dishName: string;
  recipe: string;
  standardWeight: number;
  cookingTime: number;
  qualityStandards: string;
  preparationSteps?: string;
  equipmentRequired?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

// 质量追溯类型
export interface QualityTrace {
  id: number;
  batchNumber: string;
  ingredientId: string;
  ingredientName: string;
  productionDate: string;
  expiryDate: string;
  supplierInfo: string;
  qualityCheck?: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'QUARANTINED';
  inspector?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 供应商类型
export interface Supplier {
  id: number;
  name: string;
  category: string;
  qualityGrade: string;
  contractPrice: number;
  deliveryCycle: number;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
  certificates?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED' | 'PENDING';
  rating?: number;
  lastDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 图表数据类型
export interface ChartData {
  xAxis: string[];
  series: Array<{
    name: string;
    data: number[];
    type: 'line' | 'bar' | 'pie';
  }>;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ================ 生产管理相关类型 ================

// 生产订单类型
export interface ProductionOrder {
  id: number;
  orderNumber: string;
  franchise?: { id: number }; // 只保存ID用于API调用
  productionStandard?: { id: number }; // 只保存ID用于API调用
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'APPROVED' | 'SCHEDULED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED';
  orderDate: string;
  requiredDate: string;
  scheduledDate?: string;
  completedDate?: string;
  specialInstructions?: string;
  notes?: string;
  batches?: ProductionBatch[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 生产排程类型
export interface ProductionSchedule {
  id: number;
  scheduleNumber: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  productionLine: string;
  equipment?: string;
  assignedStaff?: string;
  status: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  capacityUtilization?: number;
  batches?: ProductionBatch[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 生产批次类型
export interface ProductionBatch {
  id: number;
  batchNumber: string;
  productionOrder?: ProductionOrder;
  productionSchedule?: ProductionSchedule;
  plannedQuantity: number;
  actualQuantity?: number;
  startTime: string;
  endTime?: string;
  status: 'PLANNED' | 'PREPARING' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'COMPLETED' | 'REJECTED' | 'ON_HOLD';
  yieldRate?: number;
  materialCost?: number;
  laborCost?: number;
  overheadCost?: number;
  totalCost?: number;
  steps?: ProductionStep[];
  qualityNotes?: string;
  issues?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 生产步骤类型
export interface ProductionStep {
  id: number;
  productionBatch?: ProductionBatch;
  stepNumber: number;
  stepName: string;
  instructions: string;
  plannedDurationMinutes: number;
  actualDurationMinutes?: number;
  plannedStartTime: string;
  actualStartTime?: string;
  completedTime?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
  assignedStaff?: string;
  equipment?: string;
  qualityCheckpoints?: string;
  notes?: string;
  issues?: string;
  qualityResult?: 'PASS' | 'FAIL' | 'PENDING' | 'NOT_REQUIRED';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 加盟商类型
export interface Franchise {
  id: number;
  name: string;
  code: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

// 生产统计类型
export interface ProductionStats {
  orderStats: {
    pendingOrders: number;
    completedOrders: number;
    totalAmount: number;
  };
  scheduleStats: {
    activeSchedules: number;
    averageUtilization: number;
  };
  batchStats: {
    totalBatches: number;
    completedBatches: number;
    averageYieldRate: number;
  };
  stepStats: {
    totalSteps: number;
    completedSteps: number;
    qualityPassRate: number;
  };
}
