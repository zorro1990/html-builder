import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ViewContent() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!id) return;
    
    // 只使用相对路径
    const apiUrl = `/api/view-html?id=${id}`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || `请求失败: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setContent(data.content);
        } else {
          setError(data.error || '加载失败');
        }
      })
      .catch(err => {
        console.error('加载错误:', err);
        setError(err.message || '网络错误');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>加载中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>错误</h1>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>查看内容 - {id}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}