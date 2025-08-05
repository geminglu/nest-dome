# NestJS 项目 MDC 文件说明

本目录包含了 NestJS 企业级中后台管理系统的完整 MDC (Model-Driven Configuration) 文件集合，用于指导项目开发和维护。

## 文件列表

### 1. project-structure.mdc

**用途**: 项目结构说明和概述
**适用范围**: 整个项目
**内容包含**:

- 项目概述和技术栈
- 详细的目录结构说明
- 核心功能模块介绍
- 开发环境配置
- 部署说明
- 相关项目链接

### 2. coding-standards.mdc

**用途**: 代码规范和最佳实践
**适用范围**: `src/**/*.ts`, `test/**/*.ts`
**内容包含**:

- TypeScript 编码规范
- NestJS 最佳实践
- 命名规范和文件组织
- 依赖注入和异常处理
- 数据库操作规范
- API 设计规范
- 安全规范
- 日志规范
- 测试规范
- 性能优化
- 代码审查清单

### 3. api-standards.mdc

**用途**: API 接口规范和文档标准
**适用范围**: `src/api/**/*.ts`, `src/dto/**/*.ts`
**内容包含**:

- RESTful API 设计原则
- URL 设计规范
- 控制器设计规范
- DTO 设计规范
- 响应格式规范
- 错误处理规范
- API 文档规范 (Swagger)
- 版本控制规范
- 性能优化规范
- 安全规范

### 4. database-standards.mdc

**用途**: 数据库设计和实体规范
**适用范围**: `src/entities/**/*.ts`, `src/config/**/*.ts`, `sql/**/*.sql`
**内容包含**:

- 数据库设计原则
- TypeORM 实体设计规范
- 关系映射规范
- 查询优化规范
- 数据迁移规范
- 数据库配置规范
- 数据验证规范
- 软删除规范
- 审计日志规范
- 性能监控规范

### 5. testing-standards.mdc

**用途**: 测试规范和最佳实践
**适用范围**: `src/**/*.spec.ts`, `test/**/*.ts`, `src/**/*.test.ts`
**内容包含**:

- 测试策略和原则
- 单元测试规范
- 集成测试规范
- 端到端测试规范
- 测试工具和辅助函数
- 测试配置
- 测试覆盖率规范
- 性能测试规范
- 测试最佳实践

## 使用说明

### 自动应用

所有 MDC 文件都配置为 `alwaysApply: true`，会在相关文件编辑时自动应用相应的规范。

### 文件匹配规则

- `project-structure.mdc`: 适用于所有项目文件
- `coding-standards.mdc`: 适用于 TypeScript 源码和测试文件
- `api-standards.mdc`: 适用于 API 相关文件
- `database-standards.mdc`: 适用于数据库相关文件
- `testing-standards.mdc`: 适用于测试文件

### 开发流程

1. **新功能开发**: 参考 `coding-standards.mdc` 和 `api-standards.mdc`
2. **数据库设计**: 参考 `database-standards.mdc`
3. **测试编写**: 参考 `testing-standards.mdc`
4. **项目结构**: 参考 `project-structure.mdc`

## 规范特点

### 全面性

- 覆盖了 NestJS 项目的所有重要方面
- 从代码规范到架构设计
- 从开发到测试到部署

### 实用性

- 提供了大量实际可用的代码示例
- 包含了最佳实践和常见陷阱
- 涵盖了企业级应用的需求

### 可维护性

- 规范清晰明确
- 示例代码可直接使用
- 便于团队协作和知识传承

## 更新维护

### 版本控制

- 所有 MDC 文件都应该纳入版本控制
- 重大更新需要团队讨论
- 保持与项目技术栈的同步

### 持续改进

- 根据项目发展调整规范
- 收集团队反馈进行优化
- 参考业界最佳实践更新

## 团队协作

### 新人入职

- 新团队成员应该首先阅读 `project-structure.mdc`
- 根据工作内容学习相应的规范文件
- 通过代码审查确保规范执行

### 代码审查

- 使用 MDC 文件作为审查标准
- 重点关注安全、性能和可维护性
- 确保代码符合项目规范

### 知识分享

- 定期组织技术分享会
- 讨论规范执行中的问题和改进
- 更新和完善规范文档

## 相关资源

- **NestJS 官方文档**: <https://docs.nestjs.com/>
- **TypeORM 文档**: <https://typeorm.io/>
- **Jest 测试框架**: <https://jestjs.io/>
- **Swagger 文档**: <https://swagger.io/>

## 联系方式

如有问题或建议，请联系项目维护团队。
