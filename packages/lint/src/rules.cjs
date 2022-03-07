module.exports = {
  // console 只允许 warn error
  'no-console': ['error', { allow: ['warn', 'error'] }],
  // class 方法内必须使用 this
  'class-methods-use-this': 'off',
  // 若一个文件内只有一个导出 使用 export default
  'import/prefer-default-export': 'off',
  // function 中必须 return
  'consistent-return': 'off',
  // 单文件最大 class 数量限制
  'max-classes-per-file': 'off',
  // for of 限制
  'no-restricted-syntax': 'off',
  // 不允许使用 @ts-ignore 等
  '@typescript-eslint/ban-ts-comment': 'off',
  // 函数返回值和参数必需显式标注类型
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  // 确保在导入路径中一致使用文件扩展名
  'import/extensions': 'off',
  // 禁止在循环中 出现 await
  'no-await-in-loop': 'off',
  // 禁止 ++
  'no-plusplus': 'off',
  // 禁止使用下划线变量
  'no-underscore-dangle': 'off',
}
