import ReactMarkdown, { Components } from 'react-markdown';
import { CodeBlock } from '../../utils/codeBlock';
import { OptimizedImage } from '../common/Image';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (!match) {
        return <code {...props}>{children}</code>;
      }
      return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>;
    },
    img: OptimizedImage,
  };

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};
