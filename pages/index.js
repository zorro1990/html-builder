import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>StaticHTML Publisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      </Head>

      <header>
        <h1>StaticHTML Publisher</h1>
        <p>粘贴您的 HTML 代码，实时预览并一键发布。</p>
      </header>

      <main>
        <div className="grid">
          <section>
            <h2>欢迎使用 StaticHTML Publisher</h2>
            <p>这是一个简单的 HTML 发布工具，可以帮助您快速发布和分享 HTML 内容。</p>
            <Link href="/index.html">
              <a role="button">进入应用</a>
            </Link>
          </section>
        </div>
      </main>

      <footer>
        <p>StaticHTML Publisher - 简单高效的 HTML 发布工具</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      `}</style>
    </div>
  );
}