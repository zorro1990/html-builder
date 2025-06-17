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
    
    fetch(`/api/view-html?id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setContent(data.content);
        } else {
          setError(data.error || '加载失败');
        }
      })
      .catch(err => {
        setError('网络错误');
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