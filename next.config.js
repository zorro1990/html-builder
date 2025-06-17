module.exports = {
  // 启用动态路由
  trailingSlash: false,
  // 确保API路由正常工作
  rewrites: async () => {
    return [
      {
        source: '/view/:id',
        destination: '/view/[id]',
      },
    ];
  },
};