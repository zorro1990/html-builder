import React, { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [publishedLink, setPublishedLink] = useState('');
  const [showPublishedLink, setShowPublishedLink] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

    setIsPublishing(true);
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
      } else {
        alert('发布失败: ' + (data.message || '未知错误'));
      }
    } catch (error) {
      alert('发布过程中出错，请重试');
      console.error('发布 HTML 出错:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  // 复制链接
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publishedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <>
      <Head>
        <title>HTML Publisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {!isAuthenticated ? (
        // 密码验证界面
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">HTML Publisher</h1>
              <p className="auth-subtitle">请输入访问密码</p>
            </div>
            <div className="auth-form">
              <div className="input-group">
                <input 
                  type="password" 
                  className="auth-input"
                  placeholder="请输入密码..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && verifyPassword()}
                />
                <button className="auth-button" onClick={verifyPassword}>
                  验证
                </button>
              </div>
              {authMessage && <p className="error-message">{authMessage}</p>}
            </div>
          </div>
        </div>
      ) : (
        // 主应用界面
        <div className="app-container">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">HTML Publisher</h1>
              <p className="app-subtitle">从代码到创意，一键发布</p>
            </div>
          </header>

          <main className="main-content">
            <div className="editor-layout">
              <section className="editor-section">
                <div className="section-header">
                  <h2 className="section-title">代码编辑器</h2>
                  <div className="editor-stats">
                    <span className="char-count">{htmlInput.length} 字符</span>
                  </div>
                </div>
                <div className="editor-container">
                  <textarea 
                    className="code-editor"
                    placeholder="在这里粘贴您的 HTML 代码...\n\n示例：\n<!DOCTYPE html>\n<html>\n<head>\n  <title>我的页面</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>"
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </section>

              <section className="preview-section">
                <div className="section-header">
                  <h2 className="section-title">实时预览</h2>
                  <div className="preview-controls">
                    <button 
                      className="refresh-btn"
                      onClick={() => {
                        const frame = document.getElementById('previewFrame');
                        if (frame) frame.src = frame.src;
                      }}
                      title="刷新预览"
                    >
                      🔄
                    </button>
                  </div>
                </div>
                <div className="preview-container">
                  <iframe 
                    id="previewFrame" 
                    className="preview-frame"
                    sandbox="allow-scripts allow-same-origin" 
                    title="Preview"
                  />
                </div>
              </section>
            </div>

            <div className="action-bar">
              <button 
                className={`publish-button ${isPublishing ? 'publishing' : ''}`}
                onClick={publishHtml}
                disabled={isPublishing || !htmlInput.trim()}
              >
                {isPublishing ? (
                  <>
                    <span className="spinner"></span>
                    发布中...
                  </>
                ) : (
                  '一键上线'
                )}
              </button>
            </div>

            {showPublishedLink && (
              <div className="result-section">
                <div className="result-card">
                  <h3 className="result-title">🎉 发布成功！</h3>
                  <p className="result-description">您的页面已成功发布，可以通过以下链接访问：</p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      className="link-input"
                      value={publishedLink}
                      readOnly
                      onClick={(e) => e.target.select()}
                    />
                    <button 
                      className={`copy-button ${copySuccess ? 'copied' : ''}`}
                      onClick={copyToClipboard}
                    >
                      {copySuccess ? '已复制!' : '复制'}
                    </button>
                  </div>
                  <div className="link-actions">
                    <a 
                      href={publishedLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="visit-link"
                    >
                      🔗 访问页面
                    </a>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        /* 认证页面样式 */
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .auth-header {
          margin-bottom: 2rem;
        }

        .auth-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .auth-subtitle {
          color: #6b7280;
          font-size: 1.1rem;
          margin: 0;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-input {
          padding: 1rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .auth-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .auth-button {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        /* 主应用样式 */
        .app-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        .app-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          text-align: center;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .app-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .app-subtitle {
          font-size: 1.25rem;
          margin: 0;
          opacity: 0.9;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .editor-section,
        .preview-section {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .editor-stats {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .preview-controls {
          display: flex;
          gap: 0.5rem;
        }

        .refresh-btn {
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover {
          background: #f3f4f6;
        }

        .editor-container,
        .preview-container {
          height: 500px;
        }

        .code-editor {
          width: 100%;
          height: 100%;
          border: none;
          padding: 2rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          resize: none;
          background: #fafafa;
          color: #2d3748;
        }

        .code-editor:focus {
          outline: none;
          background: white;
        }

        .preview-frame {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
        }

        .action-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .publish-button {
          padding: 1rem 3rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 160px;
          justify-content: center;
        }

        .publish-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        }

        .publish-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .publish-button.publishing {
          background: linear-gradient(135deg, #6b7280, #4b5563);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .result-section {
          display: flex;
          justify-content: center;
        }

        .result-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .result-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #059669;
          margin: 0 0 1rem 0;
        }

        .result-description {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        .link-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .link-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: #f8fafc;
        }

        .link-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .copy-button {
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .copy-button:hover {
          background: #5a67d8;
        }

        .copy-button.copied {
          background: #10b981;
        }

        .link-actions {
          margin-top: 1rem;
        }

        .visit-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .visit-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }
          
          .app-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          
          .header-content {
            padding: 0 1rem;
          }
          
          .app-title {
            font-size: 2rem;
          }
          
          .app-subtitle {
            font-size: 1rem;
          }
          
          .auth-card {
            padding: 2rem;
            margin: 1rem;
          }
          
          .auth-title {
            font-size: 2rem;
          }
          
          .section-header {
            padding: 1rem;
          }
          
          .code-editor {
            padding: 1rem;
            font-size: 13px;
          }
          
          .editor-container,
          .preview-container {
            height: 300px;
          }
          
          .link-container {
            flex-direction: column;
          }
          
          .copy-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 1rem;
          }
          
          .auth-card {
            padding: 1.5rem;
          }
          
          .publish-button {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
          
          .result-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}