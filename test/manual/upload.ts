import * as path from 'path';
import { AuthConfig } from 'node-sp-auth-config';
import * as ProgressBar from 'progress';
import * as filesize from 'filesize';

import { Upload } from '../../src';

const filePath = path.join(__dirname, '../ReplaceWithLargeOne.avi');
const folderUrl = 'Shared Documents'; // Web relative target folder

new AuthConfig().getContext()
  .then((context) => {

    const upload = new Upload(context);
    const folderRelativeUrl = `/${context.siteUrl.split('/').slice(3).join('/')}/${folderUrl}`;

    let progress: ProgressBar = null;
    return upload.addChunked(folderRelativeUrl, filePath, (data) => {
      if (!progress) {
        progress = new ProgressBar(`Uploading ${filePath} [:bar] ${filesize(data.fileSize)}`, {
          total: data.totalBlocks,
          width: 20
        });
      }
      progress.tick();
    });

  })
  .then(() => console.log('Done'))
  .catch(console.warn);
