// src/utils/codeBlock.tsx
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

// 사용할 언어 등록
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);

interface CodeBlockProps {
  language: string;
  children: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  return (
    <div className="rounded-lg overflow-hidden my-4">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.9rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
