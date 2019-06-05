import DownloadManager from './DownloadManager';

const widget = document.querySelector('[data-widget="download-manager"]');

new DownloadManager(widget).init();
