/*
 Navicat Premium Dump SQL

 Source Server         : postgreSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 160003 (160003)
 Source Host           : localhost:5432
 Source Catalog        : vue2-admin
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160003 (160003)
 File Encoding         : 65001

 Date: 25/11/2024 16:24:53
*/


-- ----------------------------
-- Table structure for Menu
-- ----------------------------
DROP TABLE IF EXISTS "public"."Menu";
CREATE TABLE "public"."Menu" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "parentId" text COLLATE "pg_catalog"."default",
  "name" text COLLATE "pg_catalog"."default",
  "path" text COLLATE "pg_catalog"."default",
  "component" text COLLATE "pg_catalog"."default",
  "redirect" text COLLATE "pg_catalog"."default",
  "hidden" bool NOT NULL DEFAULT false,
  "meta" jsonb NOT NULL,
  "actions" jsonb NOT NULL,
  "sort" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Menu
-- ----------------------------
INSERT INTO "public"."Menu" VALUES ('2325e977-b5d9-4baa-b233-8a07aa04ee65', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', 'post-manage', '/administrative/post-manage', 'administrative/post-manage', NULL, 'f', '{"icon": "PostIcon", "title": "menu.administrative.post-manage", "keepAlive": true, "permission": "post-manage"}', '["search", "delete", "edit", "add"]', 3, '2024-11-14 10:13:24.519', '2024-11-14 10:13:58.435');
INSERT INTO "public"."Menu" VALUES ('17cb3bcb-3be9-4229-a407-e0f93bbba17a', '0430389c-96ad-47e0-ab35-80b64f551f9b', 'menu-manage', '/system-manage/menu-manage', 'system-manage/menu-manage', NULL, 'f', '{"icon": "menu", "title": "menu.system-manage.menu-manage", "keepAlive": true, "permission": "menu-manage"}', '["search", "delete", "edit", "add"]', 1, '2024-11-05 02:58:35.085', '2024-11-05 02:58:35.085');
INSERT INTO "public"."Menu" VALUES ('a1001ee7-8c5f-4e88-89de-2dcab8d3bf69', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', 'framework', '/administrative/framework', 'administrative/framework', NULL, 'f', '{"icon": "apartment", "title": "menu.administrative.framework", "keepAlive": true, "permission": "framework"}', '[]', 4, '2024-11-15 01:45:13.263', '2024-11-15 01:46:42.619');
INSERT INTO "public"."Menu" VALUES ('0430389c-96ad-47e0-ab35-80b64f551f9b', NULL, 'system-manage', '/system-manage', 'RouteView', '/system-manage/user-manage', 'f', '{"icon": "setting", "title": "menu.system-manage", "keepAlive": true, "permission": "system-manage"}', '[]', 88, '2024-11-05 02:27:17.027', '2024-11-11 07:38:34.298');
INSERT INTO "public"."Menu" VALUES ('188450e9-2edf-4bd9-a3ad-40665702354b', '0430389c-96ad-47e0-ab35-80b64f551f9b', 'operation-log', '/system-manage/operation-log', 'system-manage/operation-log', NULL, 'f', '{"icon": "LogIcon", "title": "menu.system-manage.operation-log", "keepAlive": true, "permission": "operation-log"}', '["search", "batchDelete", "delete"]', 99, '2024-11-18 07:02:56.58', '2024-11-18 08:00:37.803');
INSERT INTO "public"."Menu" VALUES ('2798577d-64be-4606-9981-022cbe14a6d9', '0430389c-96ad-47e0-ab35-80b64f551f9b', 'user-manage', '/system-manage/user-manage', 'system-manage/user-manage', NULL, 'f', '{"icon": "team", "title": "menu.system-manage.user-manage", "keepAlive": true, "permission": "user-manage"}', '["search", "delete", "edit", "add"]', 1, '2024-11-07 03:31:42.128', '2024-11-07 03:31:42.128');
INSERT INTO "public"."Menu" VALUES ('06b3f2d4-a7c5-4d2a-8d04-8e8aec82fbaa', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', 'vue2', 'https://v2.cn.vuejs.org/', 'vue2', NULL, 'f', '{"icon": "VueIcon", "title": "menu.document.vue2", "keepAlive": true, "permission": "vue2"}', '[]', 1, '2024-11-15 10:05:42.563', '2024-11-15 10:06:50.07');
INSERT INTO "public"."Menu" VALUES ('b59c454c-ed36-4e02-82db-c24d2d21cfc1', NULL, 'document', '/document', 'document', '/dashboard', 'f', '{"icon": "read", "title": "menu.document", "keepAlive": true, "permission": "document"}', '[]', 77, '2024-11-15 10:02:01.934', '2024-11-15 10:07:42.287');
INSERT INTO "public"."Menu" VALUES ('70fbcb81-0f6d-47f1-b38d-1b5f42726f53', '0430389c-96ad-47e0-ab35-80b64f551f9b', 'internationalization', '/system-manage/internationalization', 'system-manage/internationalization', NULL, 'f', '{"icon": "InternationalizationIcon", "title": "menu.system-manage.internationalization", "keepAlive": true, "permission": "internationalization"}', '["search", "delete", "edit", "add"]', 88, '2024-11-05 02:57:49.303', '2024-11-11 07:54:39.019');
INSERT INTO "public"."Menu" VALUES ('213f5947-8bce-4b1b-b218-057db18b2b87', '0430389c-96ad-47e0-ab35-80b64f551f9b', 'role-manage', '/system-manage/role-manage', 'system-manage/role-manage', NULL, 'f', '{"icon": "solution", "title": "menu.system-manage.role-manage", "keepAlive": true, "permission": "role-manage"}', '["search", "delete", "edit", "add"]', 77, '2024-11-05 05:48:03.487', '2024-11-11 07:54:47.751');
INSERT INTO "public"."Menu" VALUES ('590f0913-0550-45e7-9b28-5ebaabbd3972', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', 'nestjs', 'https://nestjs.com/', 'nestjs', NULL, 'f', '{"icon": "NestjsIcon", "title": "menu.document.nestjs", "keepAlive": true, "permission": "nestjs"}', '[]', 2, '2024-11-15 10:09:11.144', '2024-11-15 10:09:11.144');
INSERT INTO "public"."Menu" VALUES ('e4d44a58-d2c0-4d90-98bd-3005bce9b5db', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', 'antd', 'https://1x.antdv.com/docs/vue/introduce-cn/', 'antd', NULL, 'f', '{"icon": "AntdIcon", "title": "menu.document.antd", "keepAlive": true, "permission": "antd"}', '[]', 3, '2024-11-15 10:10:08.143', '2024-11-15 10:10:08.143');
INSERT INTO "public"."Menu" VALUES ('48196c1b-64fa-4661-a14c-43d451ceac39', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', 'antd-pro', 'https://pro.antdv.com/', 'antd-pro', NULL, 'f', '{"icon": "AntdIcon", "title": "menu.document.antd-pro", "keepAlive": true, "permission": "antd-pro"}', '[]', 4, '2024-11-15 10:10:38.946', '2024-11-15 10:10:38.946');
INSERT INTO "public"."Menu" VALUES ('b68cb7e7-8719-41f0-8f3a-c4247566b3ac', NULL, 'administrative', '/administrative', 'RouteView', '/administrative/message', 'f', '{"icon": "AdministrativeIcon", "title": "menu.administrative", "keepAlive": true, "permission": "administrative"}', '[]', 1, '2024-11-08 06:34:17.634', '2024-11-14 08:27:42.949');
INSERT INTO "public"."Menu" VALUES ('c87df89b-16ab-4e86-9ffc-ba44d9481769', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', 'message', '/administrative/message', 'administrative/message', NULL, 'f', '{"icon": "bell", "title": "menu.administrative.message", "keepAlive": true, "permission": "message"}', '["search", "delete", "edit", "add"]', 1, '2024-11-08 06:36:27.104', '2024-11-14 08:27:50.7');
INSERT INTO "public"."Menu" VALUES ('23a69f16-605a-4d91-8b72-8a84a6fe56d3', NULL, 'user-center', '/user-center', 'user-center', NULL, 'f', '{"icon": "idcard", "title": "menu.user-center", "keepAlive": true, "permission": "user-center"}', '[]', 66, '2024-11-11 07:37:12.469', '2024-11-14 08:29:33.379');
INSERT INTO "public"."Menu" VALUES ('930f1d79-22fd-4ed3-9cd3-edf5084f9a60', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', 'organization', '/administrative/organization', 'administrative/organization', NULL, 'f', '{"icon": "OrganizationIcon", "title": "menu.administrative.organization", "keepAlive": true, "permission": "organization"}', '["search", "delete", "edit", "add"]', 2, '2024-11-14 08:34:29.799', '2024-11-14 08:35:44.088');
INSERT INTO "public"."Menu" VALUES ('848d83a2-d118-493c-be81-c689273d00b3', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'vue-directive', '/features/vue-directive', 'features/vue-directive', NULL, 'f', '{"icon": "DirectiveIcon", "title": "menu.features.vue-directive", "keepAlive": false, "permission": "vue-directive"}', '[]', 2, '2024-11-20 02:19:22.926', '2024-11-20 06:08:34.854');
INSERT INTO "public"."Menu" VALUES ('b3d99a89-db5b-4228-a4bb-7e09211e1bad', NULL, 'about', '/about', 'about', NULL, 'f', '{"icon": "AboutIcon", "title": "menu.about", "keepAlive": true, "permission": "about"}', '[]', 99, '2024-11-18 08:11:24.213', '2024-11-18 08:11:44.964');
INSERT INTO "public"."Menu" VALUES ('31eabc42-129f-4c5c-bd01-d1d46b899394', NULL, 'features', '/features', 'RouteView', '/features/captcha', 'f', '{"icon": "FeaturesIcon", "title": "menu.features", "keepAlive": true, "permission": "features"}', '[]', 70, '2024-11-18 10:07:00.241', '2024-11-18 10:07:00.241');
INSERT INTO "public"."Menu" VALUES ('a75f8c36-b470-4687-8fdd-31b2c3336308', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'captcha', '/features/captcha', 'features/captcha', NULL, 'f', '{"icon": "CaptchaIcon", "title": "menu.features.captcha", "keepAlive": false, "permission": "captcha"}', '[]', 1, '2024-11-18 10:09:36.006', '2024-11-19 06:13:28.299');
INSERT INTO "public"."Menu" VALUES ('c874c8d3-c840-4b7a-9dbf-62118280f9f6', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'lazyload', '/features/lazyload', 'features/lazyload', NULL, 'f', '{"icon": "LazyloadIcon", "title": "menu.features.lazyload", "keepAlive": false, "permission": "lazyload"}', '[]', 3, '2024-11-20 06:08:28.853', '2024-11-20 06:08:28.853');
INSERT INTO "public"."Menu" VALUES ('ca17c991-d35d-49c8-9cef-434af9a2f827', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'waterfall', '/features/waterfall', 'features/waterfall', NULL, 'f', '{"icon": "WaterfallIcon", "title": "menu.features.waterfall", "keepAlive": false, "permission": "waterfall"}', '[]', 4, '2024-11-20 07:03:36.527', '2024-11-20 07:03:36.527');
INSERT INTO "public"."Menu" VALUES ('e7dfb86a-71ae-4d7f-a188-c97b956b9df9', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'viewer', '/features/viewer', 'features/viewer', NULL, 'f', '{"icon": "ViewerIcon", "title": "menu.features.viewer", "keepAlive": false, "permission": "viewer"}', '[]', 5, '2024-11-21 07:54:40.022', '2024-11-21 07:54:40.022');
INSERT INTO "public"."Menu" VALUES ('587de1a4-56bd-46ff-9da4-9dd9f1d16ee0', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'pickr', '/features/pickr', 'features/pickr', NULL, 'f', '{"icon": "PickrIcon", "title": "menu.features.pickr", "keepAlive": false, "permission": "pickr"}', '[]', 6, '2024-11-21 08:57:03.32', '2024-11-21 08:57:03.32');
INSERT INTO "public"."Menu" VALUES ('d588f69a-c9cf-42ca-9204-9a0afb8f0033', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'colorthief', '/features/colorthief', 'features/colorthief', NULL, 'f', '{"icon": "ColorthiefIcon", "title": "menu.features.colorthief", "keepAlive": false, "permission": "colorthief"}', '[]', 7, '2024-11-21 09:20:46.362', '2024-11-21 09:20:46.362');
INSERT INTO "public"."Menu" VALUES ('d24bd57a-e7dc-4d6f-bdd4-13f463753cc0', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'eye-dropper', '/features/eye-dropper', 'features/eye-dropper', NULL, 'f', '{"icon": "EyeDropperIcon", "title": "menu.features.eye-dropper", "keepAlive": false, "permission": "eye-dropper"}', '[]', 8, '2024-11-22 02:09:27.622', '2024-11-22 02:09:27.622');
INSERT INTO "public"."Menu" VALUES ('aa39fb97-ba48-4731-8e72-64d4037ae629', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'swiper', '/features/swiper', 'features/swiper', NULL, 'f', '{"icon": "SwiperIcon", "title": "menu.features.swiper", "keepAlive": false, "permission": "swiper"}', '[]', 9, '2024-11-22 02:28:12.834', '2024-11-22 02:28:12.834');
INSERT INTO "public"."Menu" VALUES ('a0074134-f5e1-455c-9341-9fbe653a1e27', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'print', '/features/print', 'features/print', NULL, 'f', '{"icon": "printer", "title": "menu.features.print", "keepAlive": false, "permission": "print"}', '[]', 10, '2024-11-22 09:28:11.593', '2024-11-22 09:28:11.593');
INSERT INTO "public"."Menu" VALUES ('02d60226-1e81-4aa7-b3f0-b2f1d30f05a7', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'vue-office', '/features/vue-office', 'features/vue-office', NULL, 'f', '{"icon": "file-excel", "title": "menu.features.vue-office", "keepAlive": false, "permission": "vue-office"}', '[]', 11, '2024-11-22 10:08:34.444', '2024-11-22 10:08:43.348');
INSERT INTO "public"."Menu" VALUES ('756f374c-42e4-48ea-b9aa-a3b764e26882', '31eabc42-129f-4c5c-bd01-d1d46b899394', 'draggable', '/features/draggable', 'features/draggable', NULL, 'f', '{"icon": "drag", "title": "menu.features.draggable", "keepAlive": false, "permission": "draggable"}', '[]', 12, '2024-11-25 07:06:06.126', '2024-11-25 07:06:06.126');

-- ----------------------------
-- Indexes structure for table Menu
-- ----------------------------
CREATE UNIQUE INDEX "Menu_name_key" ON "public"."Menu" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Menu_path_key" ON "public"."Menu" USING btree (
  "path" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Menu
-- ----------------------------
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Menu
-- ----------------------------
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Menu" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
