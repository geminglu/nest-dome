/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : application

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 11/05/2023 22:38:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for upload_file
-- ----------------------------
DROP TABLE IF EXISTS `upload_file`;
CREATE TABLE `upload_file` (
  `id` varchar(36) COLLATE utf8mb4_bin NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `path` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `mimetype` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uid` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `size` double DEFAULT NULL,
  `originalname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='上传文件表';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(36) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(25) COLLATE utf8mb4_bin NOT NULL COMMENT '用户名',
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '邮箱',
  `role` enum('0','1') COLLATE utf8mb4_bin NOT NULL DEFAULT '1' COMMENT '角色 0：管理员：1：普通用户',
  `gender` enum('0','1') COLLATE utf8mb4_bin DEFAULT NULL COMMENT '1：男；0：女',
  `isActive` enum('0','1') COLLATE utf8mb4_bin DEFAULT '1' COMMENT '1：启用；0：禁用',
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `phone` bigint DEFAULT NULL COMMENT '手机号',
  `avatars` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户头像',
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;
