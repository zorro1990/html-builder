export default function handler(req, res) {
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
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: '密码不能为空' });
    }
    
    // 正确的密码（在实际生产环境中，应该使用环境变量）
    const correctPassword = process.env.ADMIN_PASSWORD || 'html-publisher-2023';
    
    if (password === correctPassword) {
      return res.status(200).json({ 
        success: true, 
        message: '验证成功' 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        error: '密码错误' 
      });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}