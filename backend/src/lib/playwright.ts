import { chromium } from 'playwright';

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});