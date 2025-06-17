import { Octokit } from '@octokit/rest';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: '内容ID不能为空' });
    }
    
    // GitHub配置
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_OWNER;
    const repoName = process.env.GITHUB_REPO;
    
    if (!githubToken || !repoOwner || !repoName) {
      return res.status(500).json({ error: 'GitHub配置缺失' });
    }
    
    const octokit = new Octokit({
      auth: githubToken,
    });
    
    // 从GitHub仓库获取HTML内容
    const filePath = `data/${id}.json`;
    
    try {
      const response = await octokit.rest.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: filePath,
      });
      
      const content = JSON.parse(
        Buffer.from(response.data.content, 'base64').toString()
      );
      
      return res.status(200).json({
        success: true,
        content: content.content,
        createdAt: content.createdAt
      });
      
    } catch (githubError) {
      console.error('GitHub API error:', JSON.stringify({
        status: githubError.status,
        message: githubError.message,
        path: filePath,
        owner: repoOwner,
        repo: repoName
      }));
      
      if (githubError.status === 404) {
        return res.status(404).json({ error: '内容不存在', details: filePath });
      }
      throw githubError;
    }
    
  } catch (error) {
    console.error('View content error:', error);
    return res.status(500).json({ error: '获取内容失败' });
  }
}