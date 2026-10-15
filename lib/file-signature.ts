/**
 * Detects PDF / JPG / PNG from the file's real bytes (magic numbers), never from
 * the client-sent MIME type or file name.
 */
export function detectFileType(buf: Buffer): { mime: string; ext: string } | null {
    if (buf.length >= 4 && buf.subarray(0, 4).toString("latin1") === "%PDF") {
        return { mime: "application/pdf", ext: "pdf" };
    }
    if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return { mime: "image/jpeg", ext: "jpg" };
    }
    if (
        buf.length >= 8 &&
        buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        return { mime: "image/png", ext: "png" };
    }
    return null;
}
