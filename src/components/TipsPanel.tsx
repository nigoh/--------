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
            fontWeight: 600, 
            color: 'text.primary',
            mt: 0,
            mb: 1
          },
          '& h2': { 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: 'text.primary',
            mt: 1.5,
            mb: 1
          },
          '& h3': { 
            fontSize: '1rem', 
            fontWeight: 500, 
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
            borderLeft: '3px solid',
            borderColor: 'grey.400',
            backgroundColor: 'grey.50',
            padding: '0.75rem 1rem',
            margin: '1rem 0',
            borderRadius: '0 4px 4px 0',
            '& p': {
              margin: 0,
              fontStyle: 'italic',
              color: 'text.secondary'
            }
          },
          '& strong': {
            fontWeight: 600,
            color: 'text.primary'
          },
          '& code': {
            backgroundColor: 'grey.100',
            color: 'text.primary',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            border: '1px solid',
            borderColor: 'grey.300'
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            mb: 2,
            fontSize: '0.85rem'
          },
          '& thead': {
            backgroundColor: 'grey.100',
            color: 'text.primary'
          },
          '& th': {
            padding: '12px 16px',
            textAlign: 'left',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderBottom: '1px solid',
            borderColor: 'grey.300'
          },
          '& tbody tr': {
            '&:nth-of-type(even)': {
              backgroundColor: 'grey.25'
            },
            '&:hover': {
              backgroundColor: 'grey.100'
            }
          },
          '& td': {
            padding: '12px 16px',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            verticalAlign: 'top'
          },
          '& td strong': {
            color: 'text.primary',
            fontWeight: 600
          },
          '& td code': {
            backgroundColor: 'grey.100',
            color: 'text.primary',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            border: '1px solid',
            borderColor: 'grey.300'
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          💡 進行のコツ
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {tips.map((tip, index) => (
            <Paper key={index} elevation={0} sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
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
