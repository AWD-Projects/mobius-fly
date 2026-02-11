import React from 'react';

export interface DocumentationInfoCardProps {
  /** Card title */
  title?: string;
  /** Documentation text/requirements */
  text: string;
}

export const DocumentationInfoCard: React.FC<DocumentationInfoCardProps> = ({
  title = 'Documentación',
  text,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-5 flex flex-col gap-3">
      {/* Title */}
      <h4 className="text-[#0A0A0A] text-xs font-semibold">{title}</h4>

      {/* Text */}
      <p className="text-[#666666] text-[11px] font-normal leading-relaxed w-full">
        {text}
      </p>
    </div>
  );
};
