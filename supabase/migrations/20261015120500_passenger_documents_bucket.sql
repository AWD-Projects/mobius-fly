-- Bucket privado para documentos de identidad de pasajeros de una reserva.
-- Sin politicas en storage.objects: solo el backend (service_role) lee y escribe.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('passenger-documents', 'passenger-documents', false, 10485760,
        ARRAY['image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;
