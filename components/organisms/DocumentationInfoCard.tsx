import React from 'react';

export interface DocumentationInfoCardProps {
  /** Card title */
  title?: string;
  /** Documentation text/requirements */
  text: string;
}

export const DocumentationInfoCard: React.FC<DocumentationInfoCardProps> = ({
  title = 'Documentacion',
  text,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-5 flex flex-col gap-3">
      {/* Title */}
      <h4 className="text-text text-caption font-semibold">{title}</h4>

      {/* Text */}
      <p className="text-muted text-caption font-normal leading-relaxed w-full">
        {text}
      </p>
    </div>
  );
};
