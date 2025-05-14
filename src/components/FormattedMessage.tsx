import React from 'react';

interface FormattedMessageProps {
  text: string;
  isTyping?: boolean;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, isTyping = false }) => {
  // Convert URLs to clickable links
  const formatText = (text: string) => {
    // Split text by newlines first
    return text.split('\n').map((line, lineIndex) => {
      // URL regex pattern
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      
      // Split the line by URLs and map each part
      const parts = line.split(urlPattern);
      const formatted = parts.map((part, partIndex) => {
        if (part.match(urlPattern)) {
          return (
            <a
              key={`link-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              {part}
            </a>
          );
        }

        // Format bold text
        return part.split(/(\*\*.*?\*\*)/).map((segment, i) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return (
              <strong key={`bold-${i}`}>
                {segment.slice(2, -2)}
              </strong>
            );
          }

          // Format bullet points
          return segment.split(/\n[*-]\s/).map((bullet, bulletIndex) => {
            if (bulletIndex === 0) return bullet;
            return (
              <React.Fragment key={`bullet-${bulletIndex}`}>
                <br />• {bullet}
              </React.Fragment>
            );
          });
        });
      });

      // Join parts with line breaks
      return (
        <React.Fragment key={`line-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {formatted}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`whitespace-pre-wrap ${isTyping ? 'relative' : ''}`}>
      {formatText(text)}
      {isTyping && (
        <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-pulse" />
      )}
    </div>
  );
};

export default FormattedMessage;
