import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Uploads dizininin var olup olmadÄ±ÄŸÄ±nÄ± kontrol edin ve yoksa oluÅŸturun
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      multiples: true,
      uploadDir: uploadDir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Dosya yÃ¼klenirken bir hata oluÅŸtu.' });
      }

      const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
      const filePaths = uploadedFiles.map((file) => {
        if (!file) {
          return res.status(500).json({ error: 'Dosya yÃ¼klenirken bir hata oluÅŸtu.' });
        }

        const timestamp = Date.now();
        const newFileName = `${timestamp}-${file.originalFilename}`;
        const newFilePath = path.join(uploadDir, newFileName);

        try {
          fs.renameSync(file.filepath, newFilePath);
        } catch (renameError) {
          console.error('File rename error:', renameError);
          return res.status(500).json({ error: 'Dosya yeniden adlandÄ±rÄ±lÄ±rken bir hata oluÅŸtu.' });
        }

        return `/uploads/${newFileName}`;
      });

      res.status(200).json({ filePaths });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
