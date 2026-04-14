import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <style>
            {`
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
              
              @layer base {
                body {
                  font-family: 'Inter', sans-serif;
                  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                }
              }
              
              @layer components {
                .card {
                  @apply bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl;
                }
                .btn {
                  @apply px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2;
                }
                .btn-primary {
                  @apply bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg;
                }
                .btn-secondary {
                  @apply bg-white border border-gray-200 text-gray-700 hover:bg-gray-50;
                }
                .input-field {
                  @apply w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all;
                }
                .select-field {
                  @apply w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none bg-white;
                }
                .badge {
                  @apply px-3 py-1 rounded-full text-xs font-medium;
                }
                .badge-primary {
                  @apply bg-indigo-100 text-indigo-700;
                }
              }
            `}
          </style>
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