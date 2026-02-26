import React from 'react';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

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

const statusVariantMap: Record<DocumentItem['statusVariant'], StatusBadgeVariant> = {
  validated: 'approved',
  review: 'pending',
  rejected: 'rejected',
};

export const AircraftDocumentationCard: React.FC<AircraftDocumentationCardProps> = ({
  title = 'Documentacion',
  documents,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-3">
      <h3 className="text-text text-small font-semibold">{title}</h3>

      <div className="flex flex-col">
        {documents.map((doc, index) => {
          const isLast = index === documents.length - 1;
          return (
            <div
              key={index}
              className={`flex flex-col gap-1.5 py-2.5 ${!isLast ? 'border-b border-border' : ''}`}
            >
              <span className="text-text text-caption font-medium">{doc.name}</span>
              <StatusBadge status={statusVariantMap[doc.statusVariant]}>
                {doc.status}
              </StatusBadge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
