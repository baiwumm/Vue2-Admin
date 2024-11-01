import type { Internalization } from '@prisma/client';
import dayjs from 'dayjs';
import { Request } from 'express';
import * as fs from 'fs';

import { LOCALES, RESPONSE_CODE, RESPONSE_MSG } from '@/enums';

/**
 * @description: 统一返回体
 */
export const responseMessage = <T = any>(
  data,
  msg: string = RESPONSE_MSG.SUCCESS,
  code: number = RESPONSE_CODE.SUCCESS,
): CommonType.Response<T> => ({ data, msg, code, timestamp: dayjs().valueOf() });

/**
 * @description: 将扁平数据转换为树形结构
 */
type TreeNode<T> = T & { children?: TreeNode<T>[] };
export const convertFlatDataToTree = <T extends { id: any; parentId?: any }>(
  flatData: T[],
  rootId?: any,
): TreeNode<T>[] => {
  const map: Record<any, TreeNode<T>> = {};
  const roots: TreeNode<T>[] = [];

  // 将所有节点添加到 map 中，以 id 作为 key
  flatData.forEach((node) => {
    map[node.id] = { ...node } as TreeNode<T>; // 明确类型转换为 TreeNode<T>
  });

  // 遍历所有节点，构建树形结构
  flatData.forEach((node) => {
    const parentNode = map[node.parentId ?? rootId];
    if (parentNode) {
      let children = parentNode.children;
      if (!children) {
        children = [];
        Object.assign(parentNode, { children }); // 添加 children 属性
      }
      children.push(map[node.id]);
    } else {
      // 如果找不到父节点，将当前节点作为根节点
      roots.push(map[node.id]);
    }
  });

  // 移除空的 children 属性
  const cleanUpEmptyChildren = (nodes: TreeNode<T>[]): TreeNode<T>[] =>
    nodes.map((node) => ({
      ...node,
      children: node.children && node.children.length > 0 ? cleanUpEmptyChildren(node.children) : undefined,
    }));

  return cleanUpEmptyChildren(roots);
};

/**
 * @description: 生成文件上传文件夹
 * @param {string} filePath
 */
export const checkDirAndCreate = (filePath: string): void => {
  const pathArr = filePath.split('/');
  let checkPath = '.';
  let item: string;
  for (item of pathArr) {
    checkPath += `/${item}`;
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
};

/**
 * 从对象中排除指定的键，并返回一个新的对象。
 * @param obj - 原始对象。
 * @param keys - 需要排除的键的数组。
 * @returns 新的对象，不包含指定的键。
 */
export const omit = <T, TKeys extends keyof T>(obj: T, keys: TKeys[]): Omit<T, TKeys> => {
  if (!obj) return {} as Omit<T, TKeys>;
  if (!keys || keys.length === 0) return obj as Omit<T, TKeys>;
  return keys.reduce(
    (acc, key) => {
      delete acc[key];
      return acc;
    },
    { ...obj },
  );
};

/**
 * @description: 将树形树形转成层级对象
 */
export const convertToLocalization = (data: Internalization[]): CommonType.LanguageResult => {
  const result: CommonType.LanguageResult = {
    'zh-CN': {},
    'en-US': {},
    'ja-JP': {},
    'zh-TW': {},
  };

  function buildNestedObject(
    item: Internalization & {
      children?: Internalization[];
    },
    obj: Record<string, any>,
    lang: string,
  ) {
    if (item.children) {
      obj[item.name] = {};
      for (const child of item.children) {
        buildNestedObject(child, obj[item.name], lang);
      }
    } else {
      obj[item.name] = item[lang];
    }
  }

  for (const lang of Object.values(LOCALES)) {
    for (const item of data) {
      buildNestedObject(item, result[lang], lang.replace('-', ''));
    }
  }

  return result;
};

/**
 * @description: 获取客户端真实 IP
 * @param {Request} req
 */
export const getRealIp = (req: Request): string => {
  const result = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || req.ip;
  return Array.isArray(result) ? result[0] : result;
};

/**
 * @description: 将数组转成树形数据
 * @param {any} resource: 源数据
 * @param {string} id
 * @param {string} parentId
 * @param {string} children
 * @author: 白雾茫茫丶
 */
export function initializeTree<T>(resource: T[], id: string, parentId: string, children: string): T[] {
  const temp = JSON.parse(JSON.stringify(resource));
  // 以id为键，当前对象为值，存入一个新的对象中
  const tempObj = {};
  for (const i in temp) {
    tempObj[temp[i][id]] = temp[i];
  }
  return temp.filter((father: T) => {
    // 把当前节点的所有子节点找到
    const childArr = temp.filter((child: T) => father[id] == child[parentId]);
    childArr.length > 0 ? (father[children] = childArr) : '';
    // 只返回第一级数据；如果当前节点的fatherId不为空，但是在父节点不存在，也为一级数据
    return father[parentId] === null || !tempObj[father[parentId]];
  });
}

/**
 * @description: 将树形数据转成层级对象，主要是国际化数据
 * @param {LangModel} resource
 * @param {string} lang
 * @param {string} name
 * @author: 白雾茫茫丶
 */
export const initializeLang = (resource: Internalization[], lang: string, name = 'name'): Record<string, any> => {
  const result = {};
  // 遍历数组
  for (let i = 0; i < resource.length; i++) {
    const resourceItem = resource[i];
    // 递归函数
    function recursive(
      obj: Internalization & {
        children?: Internalization[];
      },
      serilKey = '',
    ) {
      // 拼接对象名
      let pKey = serilKey;
      pKey += pKey ? `.${obj[name]}` : obj[name];
      const newLang = lang.replace('-', '');
      // 当前层级是否有数据，给 result 赋值
      if (obj[newLang]) {
        result[pKey] = obj[newLang];
      }
      // 判断是否有子级，有就递归遍历
      if (obj.children?.length && Array.isArray(obj.children)) {
        for (let j = 0; j < obj.children.length; j++) {
          const child = obj.children[j];
          recursive(child, pKey);
        }
      }
    }
    // 循环执行
    recursive(resourceItem);
  }
  return result;
};
