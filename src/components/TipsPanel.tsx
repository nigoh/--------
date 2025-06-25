import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TipsPanelProps {
  markdownContent?: string;
  tips?: string[];
}

/**
 * 進行のコツ・ヒント表示パネル
 */
export default function TipsPanel({ markdownContent, tips }: TipsPanelProps) {
  if (markdownContent) {
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ 
          '& h1': { 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: 'primary.main',
            mt: 0,
            mb: 1
          },
          '& h2': { 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: 'text.primary',
            mt: 1.5,
            mb: 1
          },
          '& h3': { 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: 'text.secondary',
            mt: 1,
            mb: 0.5
          },
          '& p': { 
            fontSize: '0.9rem', 
            lineHeight: 1.6,
            color: 'text.primary',
            mb: 1
          },
          '& ul': { 
            paddingLeft: '1.2rem',
            mb: 1
          },
          '& li': { 
            fontSize: '0.9rem', 
            lineHeight: 1.5,
            color: 'text.primary',
            mb: 0.5
          },
          '& ol': { 
            paddingLeft: '1.2rem',
            mb: 1
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            backgroundColor: 'grey.50',
            padding: '0.5rem 1rem',
            margin: '1rem 0',
            borderRadius: '0 4px 4px 0',
            '& p': {
              margin: 0,
              fontStyle: 'italic',
              fontWeight: 'bold'
            }
          },
          '& strong': {
            fontWeight: 'bold',
            color: 'primary.main'
          },
          '& code': {
            backgroundColor: 'grey.100',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.85rem'
          }
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </Box>
      </Box>
    );
  }

  // 従来のtips表示（後方互換性のため）
  if (tips && tips.length > 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          💡 進行のコツ
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {tips.map((tip, index) => (
            <Paper key={index} elevation={1} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                {tip}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
}
