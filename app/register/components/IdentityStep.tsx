import * as React from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { Checkbox } from "@/components/atoms/Checkbox";
import { DocumentUpload, formatFileSize, type UploadedDocument } from "@/components/molecules/DocumentUpload";

interface IdentityStepProps {
  idDocument: UploadedDocument | undefined;
  acceptTerms: boolean;
  onDocumentUpload: (file: File) => void;
  onDocumentRemove: () => void;
  onAcceptTermsChange: (checked: boolean) => void;
}

export const IdentityStep = React.memo<IdentityStepProps>(({
  idDocument,
  acceptTerms,
  onDocumentUpload,
  onDocumentRemove,
  onAcceptTermsChange,
}) => {
  const handleUpload = React.useCallback((file: File) => {
    onDocumentUpload(file);
  }, [onDocumentUpload]);

  return (
    <m.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl space-y-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-8">
        Verifica tu identidad
      </h1>

      <div className="max-w-md mx-auto space-y-6">
        {/* File Upload */}
        <DocumentUpload
          document={idDocument}
          onUpload={(file) => {
            handleUpload(file);
          }}
          onRemove={onDocumentRemove}
          accept=".pdf"
          pendingTitle="Sube tu INE o Pasaporte"
          pendingDescription="Identificación oficial en PDF para mexicanos y pasaporte para extranjeros"
        />

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer justify-center">
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => onAcceptTermsChange(e.target.checked)}
          />
          <span className="text-sm text-text">
            Acepto los{" "}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              Términos y Condiciones
            </Link>
          </span>
        </label>
      </div>
    </m.div>
  );
});

IdentityStep.displayName = "IdentityStep";
