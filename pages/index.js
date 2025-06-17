import React, { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [publishedLink, setPublishedLink] = useState('');
  const [showPublishedLink, setShowPublishedLink] = useState(false);

  // 验证密码
  const verifyPassword = async () => {
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setAuthMessage('');
      } else {
        setAuthMessage('密码错误，请重试');
      }
    } catch (error) {
      setAuthMessage('验证过程中出错，请重试');
      console.error('验证密码出错:', error);
    }
  };

  // 更新预览
  useEffect(() => {
    if (isAuthenticated) {
      const previewFrame = document.getElementById('previewFrame');
      if (previewFrame) {
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(htmlInput);
        frameDoc.close();
      }
    }
  }, [htmlInput, isAuthenticated]);

  // 发布 HTML
  const publishHtml = async () => {
    if (!htmlInput.trim()) {
      alert('请先输入 HTML 代码');
      return;
    }

    try {
      const response = await fetch('/api/publish-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput })
      });

      const data = await response.json();

      if (data.success && data.url) {
        setPublishedLink(data.url);
        setShowPublishedLink(true);
        
        // 更新输入框
        const linkInput = document.getElementById('publishedLinkInput');
        if (linkInput) linkInput.value = data.url;
      } else {
        alert('发布失败: ' + (data.message || '未知错误'));
      }
    } catch (error) {
      alert('发布过程中出错，请重试');
      console.error('发布 HTML 出错:', error);
    }
  };

  return (
    <>
      <Head>
        <title>StaticHTML Publisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      </Head>

      {!isAuthenticated ? (
        // 密码验证界面
        <div className="container">
          <header>
            <h1>StaticHTML Publisher</h1>
            <p>请输入访问密码</p>
          </header>
          <main>
            <div className="auth-form">
              <input 
                type="password" 
                placeholder="请输入密码..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyPassword()}
              />
              <button onClick={verifyPassword}>验证</button>
              {authMessage && <p className="error-message">{authMessage}</p>}
            </div>
          </main>
        </div>
      ) : (
        // 主应用界面
        <main className="container">
          <header>
            <h1>StaticHTML Publisher</h1>
            <p>粘贴您的 HTML 代码，实时预览并一键发布。</p>
          </header>

          <div className="grid">
            <section>
              <h2>输入 HTML</h2>
              <textarea 
                rows="15" 
                placeholder="在这里粘贴您的 HTML 代码..."
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
              />
            </section>
            <section>
              <h2>实时预览</h2>
              <iframe 
                id="previewFrame" 
                sandbox="allow-scripts allow-same-origin" 
                title="Preview"
                style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
              />
            </section>
          </div>

          <footer>
            <button onClick={publishHtml}>发布</button>
            {showPublishedLink && (
              <div style={{ marginTop: '1em' }}>
                <p>发布成功！访问链接：
                  <a href={publishedLink} target="_blank" rel="noopener noreferrer">
                    {publishedLink}
                  </a>
                </p>
                <input 
                  type="text" 
                  id="publishedLinkInput" 
                  value={publishedLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
              </div>
            )}
          </footer>
        </main>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }
        .error-message {
          color: #d32f2f;
        }
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}