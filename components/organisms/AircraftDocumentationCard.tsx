import React from 'react';

export interface DocumentItem {
  name: string;
  status: string;
  statusVariant: 'validated' | 'review' | 'rejected';
}

export interface AircraftDocumentationCardProps {
  /** Card title */
  title?: string;
  /** Array of documents */
  documents: DocumentItem[];
}

const statusStyles = {
  validated: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#2E7D32]',
  },
  review: {
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#E65100]',
    dot: 'bg-[#E65100]',
  },
  rejected: {
    bg: 'bg-[#FFEBEE]',
    text: 'text-[#C62828]',
    dot: 'bg-[#C62828]',
  },
};

export const AircraftDocumentationCard: React.FC<AircraftDocumentationCardProps> = ({
  title = 'Documentación',
  documents,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-3">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-[13px] font-semibold">{title}</h3>

      {/* Documents List */}
      <div className="flex flex-col">
        {documents.map((doc, index) => {
          const statusStyle = statusStyles[doc.statusVariant];
          const isLast = index === documents.length - 1;

          return (
            <div
              key={index}
              className={`flex flex-col gap-1.5 py-2.5 ${
                !isLast ? 'border-b border-[#F0F0F0]' : ''
              }`}
            >
              <span className="text-[#0A0A0A] text-[11px] font-medium">
                {doc.name}
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`${statusStyle.bg} rounded px-1.5 py-0.5 flex items-center gap-1.5`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  <span className={`${statusStyle.text} text-[9px] font-medium`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
