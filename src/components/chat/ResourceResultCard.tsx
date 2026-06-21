'use client';

import Link from 'next/link';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';
import type { AIResource } from '@/lib/api';

const typeIcon: Record<string, React.ReactNode> = {
  PDF: <FileText className="w-4 h-4 text-[#2D9B6E]" />,
  IMAGE: <ImageIcon className="w-4 h-4 text-[#2D9B6E]" />,
  VIDEO: <Video className="w-4 h-4 text-[#2D9B6E]" />,
};

const levelLabel = (l: string) => (l === 'LC' ? 'Leaving Cert' : l === 'JC' ? 'Junior Cert' : l);

interface Props {
  resource: AIResource;
  onNavigate?: () => void;
}

export function ResourceResultCard({ resource, onNavigate }: Props) {
  return (
    <Link
      href={resource.url}
      onClick={onNavigate}
      className="block bg-white rounded-xl border border-[#ECF0F1] p-3 text-left shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex-shrink-0">{typeIcon[resource.resourceType] || typeIcon.PDF}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#2C3E50] text-sm truncate">{resource.title}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[10px] bg-[#F0F7F4] text-[#2D9B6E] px-1.5 py-0.5 rounded font-medium">
              {levelLabel(resource.level)}
            </span>
            <span className="text-[10px] bg-[#ECF0F1] text-[#5D6D7E] px-1.5 py-0.5 rounded font-medium">
              {resource.subject}
            </span>
          </div>
          {resource.tutorName && (
            <p className="text-[11px] text-[#95A5A6] mt-1">by {resource.tutorName}</p>
          )}
        </div>
        <span className="text-base font-bold text-[#2D9B6E] flex-shrink-0">
          {resource.price > 0 ? `€${resource.price}` : 'Free'}
        </span>
      </div>
    </Link>
  );
}
