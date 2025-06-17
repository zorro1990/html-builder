import { Octokit } from '@octokit/rest';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML内容不能为空' });
    }
    
    // 生成唯一ID
    const contentId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    // GitHub配置（需要在Vercel环境变量中设置）
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_OWNER;
    const repoName = process.env.GITHUB_REPO;
    
    if (!githubToken || !repoOwner || !repoName) {
      console.error('Missing GitHub configuration');
      return res.status(500).json({ error: 'GitHub配置缺失' });
    }
    
    const octokit = new Octokit({
      auth: githubToken,
    });
    
    // 将HTML内容保存到GitHub仓库的data目录
    const filePath = `data/${contentId}.json`;
    const fileContent = JSON.stringify({
      id: contentId,
      content: html,
      createdAt: new Date().toISOString()
    });
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      message: `Add HTML content ${contentId}`,
      content: Buffer.from(fileContent).toString('base64'),
    });
    
    // 返回访问链接
    const viewUrl = `${req.headers.origin || 'https://your-app.vercel.app'}/view/${contentId}`;
    
    return res.status(200).json({
      success: true,
      contentId,
      url: viewUrl,  // 确保返回的字段名与前端期望的一致
      message: '发布成功'
    });
    
  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({ error: '发布失败', message: error.message });
  }
}