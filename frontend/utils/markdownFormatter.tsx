/**
 * Formats markdown text to display like ChatGPT
 * - Converts ### headings to bold text
 * - Removes *** (bold/italic markers)
 * - Converts **text** to bold
 * - Converts *text* to italic
 * - Preserves line breaks
 */
export function formatMarkdownText(text: string): JSX.Element {
  if (!text) return <></>;

  // Split by lines to handle line breaks
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Skip empty lines but preserve them
        if (line.trim() === '') {
          return <br key={lineIndex} />;
        }

        let formattedLine: (string | JSX.Element)[] = [];
        let currentIndex = 0;
        let keyCounter = 0;

        // Process the line
        while (currentIndex < line.length) {
          // Check for #### heading (convert to bold) - check before ###
          if (line.substring(currentIndex).startsWith('#### ')) {
            const endIndex = line.indexOf('\n', currentIndex + 5);
            const headingText = endIndex === -1 
              ? line.substring(currentIndex + 5)
              : line.substring(currentIndex + 5, endIndex);
            formattedLine.push(
              <strong key={`bold-${keyCounter++}`} className="font-semibold text-gray-900">
                {formatInlineMarkdown(headingText)}
              </strong>
            );
            currentIndex = endIndex === -1 ? line.length : endIndex;
            continue;
          }

          // Check for ### heading (convert to bold)
          if (line.substring(currentIndex).startsWith('### ')) {
            const endIndex = line.indexOf('\n', currentIndex + 4);
            const headingText = endIndex === -1 
              ? line.substring(currentIndex + 4)
              : line.substring(currentIndex + 4, endIndex);
            formattedLine.push(
              <strong key={`bold-${keyCounter++}`} className="font-bold text-gray-900">
                {formatInlineMarkdown(headingText)}
              </strong>
            );
            currentIndex = endIndex === -1 ? line.length : endIndex;
            continue;
          }

          // Check for ## heading (convert to bold)
          if (line.substring(currentIndex).startsWith('## ')) {
            const endIndex = line.indexOf('\n', currentIndex + 3);
            const headingText = endIndex === -1 
              ? line.substring(currentIndex + 3)
              : line.substring(currentIndex + 3, endIndex);
            formattedLine.push(
              <strong key={`bold-${keyCounter++}`} className="font-bold text-gray-900 text-lg">
                {formatInlineMarkdown(headingText)}
              </strong>
            );
            currentIndex = endIndex === -1 ? line.length : endIndex;
            continue;
          }

          // Check for # heading (convert to bold)
          if (line.substring(currentIndex).startsWith('# ')) {
            const endIndex = line.indexOf('\n', currentIndex + 2);
            const headingText = endIndex === -1 
              ? line.substring(currentIndex + 2)
              : line.substring(currentIndex + 2, endIndex);
            formattedLine.push(
              <strong key={`bold-${keyCounter++}`} className="font-bold text-gray-900 text-xl">
                {formatInlineMarkdown(headingText)}
              </strong>
            );
            currentIndex = endIndex === -1 ? line.length : endIndex;
            continue;
          }

          // Find next markdown pattern - prioritize ** over *
          const nextTriple = line.indexOf('***', currentIndex);
          const nextBold = line.indexOf('**', currentIndex);

          // Handle *** (remove it)
          if (nextTriple !== -1 && nextTriple === currentIndex) {
            currentIndex += 3;
            continue;
          }

          // Handle **bold** (check this before single *)
          if (nextBold !== -1 && (nextTriple === -1 || nextBold < nextTriple)) {
            // Make sure it's not part of ***
            if (nextBold === nextTriple) {
              // It's part of ***, skip
              currentIndex += 3;
              continue;
            }
            
            // Add text before bold
            if (nextBold > currentIndex) {
              formattedLine.push(line.substring(currentIndex, nextBold));
            }
            
            // Find closing **
            const closingBold = line.indexOf('**', nextBold + 2);
            if (closingBold !== -1) {
              const boldText = line.substring(nextBold + 2, closingBold);
              formattedLine.push(
                <strong key={`bold-${keyCounter++}`} className="font-semibold text-gray-900">
                  {boldText}
                </strong>
              );
              currentIndex = closingBold + 2;
              continue;
            } else {
              // No closing, treat as regular text
              formattedLine.push(line.substring(currentIndex));
              currentIndex = line.length;
            }
            continue;
          }

          // Handle *italic* (only if not part of **)
          const nextItalic = line.indexOf('*', currentIndex);
          if (nextItalic !== -1 && nextItalic === currentIndex) {
            // Check if it's actually ** (bold) by looking ahead
            if (line.substring(nextItalic, nextItalic + 2) === '**') {
              // It's actually bold, skip and let bold handler catch it next iteration
              currentIndex += 1;
              continue;
            }
            
            const closingItalic = line.indexOf('*', nextItalic + 1);
            if (closingItalic !== -1 && closingItalic !== nextItalic + 1) {
              // Make sure the closing * is not part of **
              if (line.substring(closingItalic, closingItalic + 2) !== '**') {
                // Add text before italic
                if (nextItalic > currentIndex) {
                  formattedLine.push(line.substring(currentIndex, nextItalic));
                }
                
                const italicText = line.substring(nextItalic + 1, closingItalic);
                formattedLine.push(
                  <em key={`italic-${keyCounter++}`} className="italic text-gray-700">
                    {italicText}
                  </em>
                );
                currentIndex = closingItalic + 1;
                continue;
              }
            }
          }

          // No more patterns, add rest of line
          formattedLine.push(line.substring(currentIndex));
          currentIndex = line.length;
        }

        return (
          <p key={lineIndex} className="mb-3 leading-relaxed">
            {formattedLine}
          </p>
        );
      })}
    </>
  );
}

/**
 * Formats inline markdown (bold, italic) within a string
 */
function formatInlineMarkdown(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let currentIndex = 0;
  let keyCounter = 0;

  while (currentIndex < text.length) {
    // Find **bold**
    const nextBold = text.indexOf('**', currentIndex);
    if (nextBold !== -1) {
      // Add text before bold
      if (nextBold > currentIndex) {
        parts.push(text.substring(currentIndex, nextBold));
      }
      
      // Find closing **
      const closingBold = text.indexOf('**', nextBold + 2);
      if (closingBold !== -1) {
        const boldText = text.substring(nextBold + 2, closingBold);
        parts.push(
          <strong key={`inline-bold-${keyCounter++}`} className="font-semibold">
            {boldText}
          </strong>
        );
        currentIndex = closingBold + 2;
        continue;
      }
    }

    // Find *italic* (only if not part of **)
    const nextItalic = text.indexOf('*', currentIndex);
    if (nextItalic !== -1 && text.substring(nextItalic, nextItalic + 2) !== '**') {
      const closingItalic = text.indexOf('*', nextItalic + 1);
      if (closingItalic !== -1 && closingItalic !== nextItalic + 1) {
        // Add text before italic
        if (nextItalic > currentIndex) {
          parts.push(text.substring(currentIndex, nextItalic));
        }
        
        const italicText = text.substring(nextItalic + 1, closingItalic);
        parts.push(
          <em key={`inline-italic-${keyCounter++}`} className="italic">
            {italicText}
          </em>
        );
        currentIndex = closingItalic + 1;
        continue;
      }
    }

    // No more patterns, add rest
    parts.push(text.substring(currentIndex));
    break;
  }

  return parts;
}
