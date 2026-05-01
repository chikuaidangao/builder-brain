import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <style>{`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Urbanist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #F7F8FC;
              color: #1A1D2E;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            ::selection {
              background: #6366F1;
              color: #fff;
            }
            input::placeholder {
              color: #9CA3C4;
            }
            button:focus-visible {
              outline: 2px solid #6366F1;
              outline-offset: 2px;
            }
            /* 滚动条美化 */
            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-track {
              background: #F7F8FC;
            }
            ::-webkit-scrollbar-thumb {
              background: #C5CBE0;
              border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #9CA3C4;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
