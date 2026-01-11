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
