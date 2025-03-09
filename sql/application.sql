/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80200 (8.2.0)
 Source Host           : localhost:3306
 Source Schema         : application

 Target Server Type    : MySQL
 Target Server Version : 80200 (8.2.0)
 File Encoding         : 65001

 Date: 09/03/2025 20:25:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dictionary
-- ----------------------------
DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE `dictionary` (
  `name` varchar(36) NOT NULL COMMENT '字典名称',
  `code` varchar(36) NOT NULL COMMENT '字典编码',
  `remark` varchar(255) NOT NULL COMMENT '备注',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('0','1') NOT NULL COMMENT '启用状态：0:禁用；1:激活',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b1f11f5f4bb7a63eee2583596c` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for dictionary_info
-- ----------------------------
DROP TABLE IF EXISTS `dictionary_info`;
CREATE TABLE `dictionary_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dictionary_code` varchar(36) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `status` enum('0','1') NOT NULL COMMENT '启用状态：0:禁用；1:激活',
  `sort` int DEFAULT '0',
  `fields_text` varchar(36) NOT NULL,
  `fields_value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for graphic_code
-- ----------------------------
DROP TABLE IF EXISTS `graphic_code`;
CREATE TABLE `graphic_code` (
  `id` varchar(36) NOT NULL,
  `code` char(4) NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '验证码生成时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for login_log
-- ----------------------------
DROP TABLE IF EXISTS `login_log`;
CREATE TABLE `login_log` (
  `id` varchar(36) NOT NULL,
  `uid` varchar(36) NOT NULL COMMENT '用户ID',
  `login_ip` varchar(64) NOT NULL COMMENT '登陆设备的IP',
  `device_info` varchar(500) DEFAULT NULL COMMENT '登陆页设备信息',
  `location` varchar(500) NOT NULL COMMENT '位置',
  `login_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '登陆时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` int DEFAULT NULL COMMENT '父部门id',
  `dept_name` varchar(30) DEFAULT NULL COMMENT '部门名称',
  `order_num` int DEFAULT '0' COMMENT '显示顺序',
  `phone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) NOT NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建者',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `leader` int DEFAULT NULL COMMENT '负责人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for system_menu
-- ----------------------------
DROP TABLE IF EXISTS `system_menu`;
CREATE TABLE `system_menu` (
  `icon` varchar(255) DEFAULT NULL COMMENT 'icon',
  `title` varchar(255) NOT NULL COMMENT 'title',
  `pid` varchar(255) DEFAULT NULL COMMENT 'pid',
  `hidden` enum('0','1') NOT NULL COMMENT '在系统菜单中隐藏',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `status` enum('0','1') NOT NULL COMMENT '0:禁用；\n1:启用',
  `path` varchar(100) NOT NULL COMMENT '路由地址',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for upload_file
-- ----------------------------
DROP TABLE IF EXISTS `upload_file`;
CREATE TABLE `upload_file` (
  `id` varchar(36) NOT NULL,
  `filename` varchar(255) DEFAULT NULL COMMENT '文件名称',
  `path` varchar(255) NOT NULL COMMENT '文件存储路径',
  `mimetype` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `uid` varchar(255) DEFAULT NULL COMMENT '上传用户UID',
  `size` double DEFAULT NULL COMMENT '文件大小',
  `originalname` varchar(255) DEFAULT NULL COMMENT '文件原始名称',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '上传文件的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(25) NOT NULL COMMENT '用户名',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `role` enum('0','1') NOT NULL DEFAULT '1' COMMENT '角色 0：管理员：1：普通用户',
  `gender` enum('0','1') DEFAULT NULL COMMENT '1：男；0：女',
  `isActive` enum('0','1') DEFAULT '1' COMMENT '1：启用；0：禁用',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `phone` bigint DEFAULT NULL COMMENT '手机号',
  `avatars` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `password` varchar(255) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
