-- Central Kitchen Management System - Initial Database Schema
-- Version: 1.0.0
-- Description: Create initial database tables for the central kitchen management system

-- ===========================================
-- USERS TABLE
-- ===========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('ADMIN', 'MANAGER', 'OPERATOR') NOT NULL DEFAULT 'OPERATOR',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_enabled (enabled)
);

-- ===========================================
-- FRANCHISES TABLE
-- ===========================================
CREATE TABLE franchises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(50),
    contact_phone VARCHAR(20),
    address TEXT,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ===========================================
-- SUPPLIERS TABLE
-- ===========================================
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quality_grade VARCHAR(20),
    contract_price DECIMAL(10,2),
    delivery_cycle INT,
    contact_person VARCHAR(50),
    contact_phone VARCHAR(20),
    address TEXT,
    certificates TEXT,
    status ENUM('ACTIVE', 'INACTIVE', 'BLACKLISTED') NOT NULL DEFAULT 'ACTIVE',
    rating DECIMAL(3,2) DEFAULT 5.00,
    last_delivery_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_last_delivery_date (last_delivery_date)
);

-- ===========================================
-- PRODUCTION STANDARDS TABLE
-- ===========================================
CREATE TABLE production_standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dish_name VARCHAR(100) NOT NULL,
    recipe TEXT,
    standard_weight DECIMAL(8,3),
    cooking_time INT,
    quality_standards TEXT,
    preparation_steps TEXT,
    equipment_required TEXT,
    status ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_dish_name (dish_name),
    INDEX idx_status (status)
);

-- ===========================================
-- PRODUCTION ORDERS TABLE
-- ===========================================
CREATE TABLE production_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    franchise_id BIGINT,
    production_standard_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    status ENUM('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    required_date TIMESTAMP,
    scheduled_date TIMESTAMP,
    completed_date TIMESTAMP,
    special_instructions TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),

    FOREIGN KEY (franchise_id) REFERENCES franchises(id),
    FOREIGN KEY (production_standard_id) REFERENCES production_standards(id),

    INDEX idx_order_number (order_number),
    INDEX idx_franchise_id (franchise_id),
    INDEX idx_production_standard_id (production_standard_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_order_date (order_date),
    INDEX idx_required_date (required_date),
    INDEX idx_scheduled_date (scheduled_date)
);

-- ===========================================
-- PRODUCTION SCHEDULES TABLE
-- ===========================================
CREATE TABLE production_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    production_order_id BIGINT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),

    FOREIGN KEY (production_order_id) REFERENCES production_orders(id),

    INDEX idx_production_order_id (production_order_id),
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time),
    INDEX idx_status (status)
);

-- ===========================================
-- PRODUCTION BATCHES TABLE
-- ===========================================
CREATE TABLE production_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_number VARCHAR(50) NOT NULL UNIQUE,
    production_order_id BIGINT,
    production_schedule_id BIGINT,
    planned_quantity INT NOT NULL,
    actual_quantity INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'QUALITY_CHECK', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    yield_rate DECIMAL(5,2),
    material_cost DECIMAL(12,2),
    labor_cost DECIMAL(12,2),
    overhead_cost DECIMAL(12,2),
    total_cost DECIMAL(12,2),
    quality_notes TEXT,
    issues TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),

    FOREIGN KEY (production_order_id) REFERENCES production_orders(id),
    FOREIGN KEY (production_schedule_id) REFERENCES production_schedules(id),

    INDEX idx_batch_number (batch_number),
    INDEX idx_production_order_id (production_order_id),
    INDEX idx_production_schedule_id (production_schedule_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time)
);

-- ===========================================
-- PRODUCTION STEPS TABLE
-- ===========================================
CREATE TABLE production_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    production_batch_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    description TEXT,
    planned_start_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    planned_end_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    quality_check_result ENUM('PASS', 'FAIL', 'PENDING') DEFAULT 'PENDING',
    quality_notes TEXT,
    issues TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (production_batch_id) REFERENCES production_batches(id),

    INDEX idx_production_batch_id (production_batch_id),
    INDEX idx_step_number (step_number),
    INDEX idx_status (status),
    INDEX idx_quality_check_result (quality_check_result),
    INDEX idx_actual_start_time (actual_start_time),
    INDEX idx_actual_end_time (actual_end_time)
);

-- ===========================================
-- QUALITY TRACE TABLE
-- ===========================================
CREATE TABLE quality_trace (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_number VARCHAR(50),
    ingredient_id VARCHAR(100),
    ingredient_name VARCHAR(100),
    production_date DATE NOT NULL,
    expiry_date DATE,
    supplier_info TEXT,
    quality_check TEXT,
    status ENUM('PASS', 'FAIL', 'PENDING', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    inspector VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_batch_number (batch_number),
    INDEX idx_ingredient_id (ingredient_id),
    INDEX idx_production_date (production_date),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_status (status),
    INDEX idx_inspector (inspector)
);

-- ===========================================
-- INSERT INITIAL DATA
-- ===========================================

-- Insert default admin user
INSERT INTO users (username, password, email, role, enabled) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxp7O5bLp5q0jYK', 'admin@ckm.com', 'ADMIN', TRUE);

-- Insert sample production standards
INSERT INTO production_standards (dish_name, recipe, standard_weight, cooking_time, quality_standards, status) VALUES
('宫保鸡丁', '鸡肉、花生米、黄瓜、胡萝卜等食材的经典川菜做法', 450.00, 15, '色泽红亮，鸡丁鲜嫩，花生米酥脆，味道麻辣鲜香', 'ACTIVE'),
('鱼香肉丝', '猪里脊肉、木耳、胡萝卜等食材制作的川菜经典', 400.00, 12, '色泽红亮，肉丝鲜嫩，口味酸甜适中', 'ACTIVE'),
('糖醋里脊', '猪里脊肉制作的经典鲁菜，酸甜口味', 380.00, 10, '色泽金黄，外酥里嫩，酸甜适口', 'ACTIVE');

-- Insert sample suppliers
INSERT INTO suppliers (name, category, quality_grade, contract_price, delivery_cycle, contact_person, contact_phone, status, rating) VALUES
('北京鲜美食品有限公司', '肉类', 'A', 25.50, 1, '王经理', '13800138001', 'ACTIVE', 4.8),
('上海绿园蔬菜合作社', '蔬菜', 'A', 8.80, 1, '李经理', '13800138002', 'ACTIVE', 4.6),
('广州南国调味品厂', '调料', 'A', 15.20, 3, '张经理', '13800138003', 'ACTIVE', 4.9);

-- Insert sample franchises
INSERT INTO franchises (name, contact_person, contact_phone, address, status) VALUES
('北京望京店', '刘店长', '13800138004', '北京市朝阳区望京街道001号', 'ACTIVE'),
('上海浦东店', '陈店长', '13800138005', '上海市浦东新区陆家嘴001号', 'ACTIVE'),
('广州天河店', '黄店长', '13800138006', '广州市天河区珠江新城001号', 'ACTIVE');

-- Create indexes for better query performance
CREATE INDEX idx_production_orders_status_date ON production_orders(status, order_date);
CREATE INDEX idx_production_batches_status_time ON production_batches(status, start_time, end_time);
CREATE INDEX idx_production_schedules_time_status ON production_schedules(start_time, end_time, status);
CREATE INDEX idx_quality_trace_expiry_status ON quality_trace(expiry_date, status);
CREATE INDEX idx_production_steps_batch_status ON production_steps(production_batch_id, status);

-- Create composite indexes for common queries
CREATE INDEX idx_users_role_enabled ON users(role, enabled);
CREATE INDEX idx_suppliers_category_status ON suppliers(category, status);
CREATE INDEX idx_franchises_status_created ON franchises(status, created_at);
