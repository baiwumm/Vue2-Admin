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

 Date: 25/11/2024 16:25:17
*/


-- ----------------------------
-- Table structure for Permission
-- ----------------------------
DROP TABLE IF EXISTS "public"."Permission";
CREATE TABLE "public"."Permission" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "roleId" text COLLATE "pg_catalog"."default" NOT NULL,
  "menuId" text COLLATE "pg_catalog"."default" NOT NULL,
  "actions" jsonb NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of Permission
-- ----------------------------
INSERT INTO "public"."Permission" VALUES ('bf0eb304-5cfc-4628-9980-71bb6e6734b9', 'e02b5eec-d7b9-4ff8-862c-0151448a390c', 'c87df89b-16ab-4e86-9ffc-ba44d9481769', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:11.697');
INSERT INTO "public"."Permission" VALUES ('4fcaeef0-2bb9-4262-8383-1df9a39e84d1', 'e02b5eec-d7b9-4ff8-862c-0151448a390c', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', '[]', '2024-11-22 08:24:11.697');
INSERT INTO "public"."Permission" VALUES ('6bd40a82-96e1-4744-9c6f-5d741a6b8c2b', 'e02b5eec-d7b9-4ff8-862c-0151448a390c', '930f1d79-22fd-4ed3-9cd3-edf5084f9a60', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:11.697');
INSERT INTO "public"."Permission" VALUES ('1dd8a082-7918-42dc-bcfc-5651cc42eb39', 'e02b5eec-d7b9-4ff8-862c-0151448a390c', '2325e977-b5d9-4baa-b233-8a07aa04ee65', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:11.697');
INSERT INTO "public"."Permission" VALUES ('04695102-5e2a-46ec-9d2f-c50c6ae35f79', 'e02b5eec-d7b9-4ff8-862c-0151448a390c', 'a1001ee7-8c5f-4e88-89de-2dcab8d3bf69', '[]', '2024-11-22 08:24:11.697');
INSERT INTO "public"."Permission" VALUES ('8ca24bd5-0fb9-464b-a0a8-3cbb21a62555', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '48196c1b-64fa-4661-a14c-43d451ceac39', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('302b1666-9cf5-420f-9830-3b4b684b1fe9', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('2a0582cd-14d0-4e5b-9c9d-5c361e63d4e8', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '188450e9-2edf-4bd9-a3ad-40665702354b', '["search", "delete", "batchDelete"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('c5b70930-6909-4126-96d5-97adfa76bfcd', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '0430389c-96ad-47e0-ab35-80b64f551f9b', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('faf3bed0-9b49-413e-a590-faa7cdc2a99f', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'b3d99a89-db5b-4228-a4bb-7e09211e1bad', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('3ad7cdf9-1475-4993-b86b-dccc64febdd1', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'a75f8c36-b470-4687-8fdd-31b2c3336308', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('12cac3c4-65b6-4dd2-9375-6416f4d2ec3b', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '848d83a2-d118-493c-be81-c689273d00b3', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('080f3fbf-4069-4cad-86ab-823aaa41ee58', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'c874c8d3-c840-4b7a-9dbf-62118280f9f6', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('017d91d5-b8c2-4fec-8733-24ae675d1126', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'ca17c991-d35d-49c8-9cef-434af9a2f827', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('8d673213-7f1b-446e-938d-4f102e8f08b2', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'e7dfb86a-71ae-4d7f-a188-c97b956b9df9', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('0eb0867c-3e9c-473c-bec6-fcf0ad94fc4b', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '587de1a4-56bd-46ff-9da4-9dd9f1d16ee0', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('a29e2d77-2871-4491-869c-b3c063bd2bb4', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'a0074134-f5e1-455c-9341-9fbe653a1e27', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('38a6cdea-c13a-4058-a8fd-6291ab3c0176', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '02d60226-1e81-4aa7-b3f0-b2f1d30f05a7', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('5be20a6a-a91b-4218-bad5-040f4d77f2d2', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'd588f69a-c9cf-42ca-9204-9a0afb8f0033', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('bf1f5142-1393-46a0-839a-8612f5cfd01b', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'd24bd57a-e7dc-4d6f-bdd4-13f463753cc0', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('caab75c3-702f-4c81-b396-57fb2f87573b', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'aa39fb97-ba48-4731-8e72-64d4037ae629', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('54533726-8c5e-485f-8bc6-4e081cc2baed', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '213f5947-8bce-4b1b-b218-057db18b2b87', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('3fdb47ab-925f-4307-be48-0468700c3f63', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '2798577d-64be-4606-9981-022cbe14a6d9', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('188a4164-1903-431c-a6c6-df3554a56d41', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '17cb3bcb-3be9-4229-a407-e0f93bbba17a', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('db9f47bb-8d75-4e75-9ca7-9bdadb9405ad', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '70fbcb81-0f6d-47f1-b38d-1b5f42726f53', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('24a8fa57-36f1-4218-b678-041b48f31ac9', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'c87df89b-16ab-4e86-9ffc-ba44d9481769', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('1c3d93f1-878d-4175-b22f-c721735dafa4', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('92c12d11-17cc-4354-b59b-23363d766857', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '930f1d79-22fd-4ed3-9cd3-edf5084f9a60', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('8d7b5397-6682-4368-aff2-5eedd5c8f1de', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '2325e977-b5d9-4baa-b233-8a07aa04ee65', '["search", "delete", "edit", "add"]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('5c8ab9cd-4a7b-454a-ae7c-6c533c0f9bfa', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'a1001ee7-8c5f-4e88-89de-2dcab8d3bf69', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('bef58978-e44c-4acf-bde0-f999909c7ff4', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '23a69f16-605a-4d91-8b72-8a84a6fe56d3', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('85fedba1-15e6-43d0-997b-7e8e449ddf73', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '06b3f2d4-a7c5-4d2a-8d04-8e8aec82fbaa', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('7ee58afa-48e0-4e6d-828c-d1a581e2003a', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '590f0913-0550-45e7-9b28-5ebaabbd3972', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('ae1e1c9e-9e49-4ff1-812d-8f8ab1971af7', '6db049fe-c944-4680-b6dc-f9f40d6ad018', 'e4d44a58-d2c0-4d90-98bd-3005bce9b5db', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('91266122-e61a-4f18-9f7b-f3bd7025ab1f', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '31eabc42-129f-4c5c-bd01-d1d46b899394', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('1925c5ff-4db6-4d79-955d-413a2959720c', '6db049fe-c944-4680-b6dc-f9f40d6ad018', '756f374c-42e4-48ea-b9aa-a3b764e26882', '[]', '2024-11-25 07:06:30.105');
INSERT INTO "public"."Permission" VALUES ('d3082699-6bc7-47d8-bd7a-736d883e60e2', '697da404-a1e6-4e8d-996d-7f488cedc250', '31eabc42-129f-4c5c-bd01-d1d46b899394', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('27c1b651-866a-410d-863c-1977515d3bad', '697da404-a1e6-4e8d-996d-7f488cedc250', 'a0074134-f5e1-455c-9341-9fbe653a1e27', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('9399dd2c-3975-460e-8b24-20143f884c31', '697da404-a1e6-4e8d-996d-7f488cedc250', '02d60226-1e81-4aa7-b3f0-b2f1d30f05a7', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('6490f299-8fc2-483b-b8f5-519da9b93783', '697da404-a1e6-4e8d-996d-7f488cedc250', '756f374c-42e4-48ea-b9aa-a3b764e26882', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('cbc316b3-2495-4f04-a16a-45d25716dd28', '697da404-a1e6-4e8d-996d-7f488cedc250', '0430389c-96ad-47e0-ab35-80b64f551f9b', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('93412dd2-2817-42b5-81e6-abb470d69e85', '697da404-a1e6-4e8d-996d-7f488cedc250', 'b68cb7e7-8719-41f0-8f3a-c4247566b3ac', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('fe62fa1b-276c-4510-9acf-e062aa2b4bc1', '697da404-a1e6-4e8d-996d-7f488cedc250', '213f5947-8bce-4b1b-b218-057db18b2b87', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('f3f7469d-fe2b-4ff9-a262-77012369bbe7', '697da404-a1e6-4e8d-996d-7f488cedc250', '17cb3bcb-3be9-4229-a407-e0f93bbba17a', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('e0139150-1f5e-4d9b-b7da-f42ad7869f48', '697da404-a1e6-4e8d-996d-7f488cedc250', '70fbcb81-0f6d-47f1-b38d-1b5f42726f53', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('86ad2fe1-d528-4f13-95c6-5afc8cad8144', '697da404-a1e6-4e8d-996d-7f488cedc250', '2798577d-64be-4606-9981-022cbe14a6d9', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('8c83456a-6b4f-461d-a536-dcfa74f85047', '697da404-a1e6-4e8d-996d-7f488cedc250', 'c87df89b-16ab-4e86-9ffc-ba44d9481769', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('8b08ad51-5cc3-499f-b53c-3dd51a51dcea', '697da404-a1e6-4e8d-996d-7f488cedc250', '930f1d79-22fd-4ed3-9cd3-edf5084f9a60', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('a52cfd5b-f1d5-4b69-9b67-8d18f08a1db0', '697da404-a1e6-4e8d-996d-7f488cedc250', '2325e977-b5d9-4baa-b233-8a07aa04ee65', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('bc5afbe7-2ffe-4415-8ef9-185fa3abcc5e', '697da404-a1e6-4e8d-996d-7f488cedc250', 'a1001ee7-8c5f-4e88-89de-2dcab8d3bf69', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('a0b1a889-2b1c-43fe-a45c-5568af3effc0', '697da404-a1e6-4e8d-996d-7f488cedc250', '23a69f16-605a-4d91-8b72-8a84a6fe56d3', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('9bab46c7-f880-44f0-826b-ebf3e2276c23', '697da404-a1e6-4e8d-996d-7f488cedc250', 'a75f8c36-b470-4687-8fdd-31b2c3336308', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('05c40909-b37e-4a71-93c9-bf21dffa7cec', '697da404-a1e6-4e8d-996d-7f488cedc250', '848d83a2-d118-493c-be81-c689273d00b3', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('6e25a5d2-679c-4a00-bb48-c093d433a3ac', '697da404-a1e6-4e8d-996d-7f488cedc250', 'c874c8d3-c840-4b7a-9dbf-62118280f9f6', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('71e32ab1-452d-4805-80ac-5217977d2721', '697da404-a1e6-4e8d-996d-7f488cedc250', 'ca17c991-d35d-49c8-9cef-434af9a2f827', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('b682e3c9-f717-4aaf-8d19-cb31bd6f2de5', '697da404-a1e6-4e8d-996d-7f488cedc250', 'e7dfb86a-71ae-4d7f-a188-c97b956b9df9', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('9a7eff8a-347f-45b1-8861-ee6651d583c2', '697da404-a1e6-4e8d-996d-7f488cedc250', '587de1a4-56bd-46ff-9da4-9dd9f1d16ee0', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('21b5dfda-2a36-4955-8ab5-4596901896f4', '697da404-a1e6-4e8d-996d-7f488cedc250', 'd588f69a-c9cf-42ca-9204-9a0afb8f0033', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('214a0bbf-34c0-4471-9912-022e2d45fb70', '697da404-a1e6-4e8d-996d-7f488cedc250', 'd24bd57a-e7dc-4d6f-bdd4-13f463753cc0', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('af0ede78-1821-4812-a410-3d963f109b99', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '213f5947-8bce-4b1b-b218-057db18b2b87', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('2e4c3b41-55cf-44cb-a75d-788168db41d2', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '17cb3bcb-3be9-4229-a407-e0f93bbba17a', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('d10b5128-8310-4e05-88f5-0d5d4f062c0d', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '70fbcb81-0f6d-47f1-b38d-1b5f42726f53', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('267ecba7-dcfc-4c29-a8d2-9efa6e8b8c95', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '2798577d-64be-4606-9981-022cbe14a6d9', '["search", "delete", "edit", "add"]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('2017dae5-3842-4146-a040-4b5034b04aed', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '0430389c-96ad-47e0-ab35-80b64f551f9b', '[]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('5f40c917-cc1d-4f19-b2a1-14be51191f5d', '2564f9b6-9288-49d4-b1b2-2d6f4f7946f3', '188450e9-2edf-4bd9-a3ad-40665702354b', '["search", "batchDelete", "delete"]', '2024-11-22 08:24:41.266');
INSERT INTO "public"."Permission" VALUES ('4215b5a2-a519-4a4c-a369-4702b37832fe', '697da404-a1e6-4e8d-996d-7f488cedc250', 'aa39fb97-ba48-4731-8e72-64d4037ae629', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('ac1446f7-4d7b-42a6-8535-3b0326caca1b', '697da404-a1e6-4e8d-996d-7f488cedc250', '06b3f2d4-a7c5-4d2a-8d04-8e8aec82fbaa', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('556b7dc4-5738-479e-a6c2-e4aad6e2e44d', '697da404-a1e6-4e8d-996d-7f488cedc250', 'b59c454c-ed36-4e02-82db-c24d2d21cfc1', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('e0cdfa16-df6e-4747-ab83-b806b52ef9cc', '697da404-a1e6-4e8d-996d-7f488cedc250', '590f0913-0550-45e7-9b28-5ebaabbd3972', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('7d8b43a5-64d6-4d7e-b0cd-289ac1ebcbf7', '697da404-a1e6-4e8d-996d-7f488cedc250', 'e4d44a58-d2c0-4d90-98bd-3005bce9b5db', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('f31982f8-b171-4b62-8405-97d644201ed5', '697da404-a1e6-4e8d-996d-7f488cedc250', '48196c1b-64fa-4661-a14c-43d451ceac39', '[]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('acefaaee-3e3c-403e-9017-81ec7ed427db', '697da404-a1e6-4e8d-996d-7f488cedc250', '188450e9-2edf-4bd9-a3ad-40665702354b', '["search"]', '2024-11-25 08:22:53.056');
INSERT INTO "public"."Permission" VALUES ('eedaa995-d5f7-485c-820f-cc308a26215a', '697da404-a1e6-4e8d-996d-7f488cedc250', 'b3d99a89-db5b-4228-a4bb-7e09211e1bad', '[]', '2024-11-25 08:22:53.056');

-- ----------------------------
-- Primary Key structure for table Permission
-- ----------------------------
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Permission
-- ----------------------------
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
