// ! non toccare questo file perche e autogenerato con firebase-secrets-cli

import { defineSecret } from 'firebase-functions/params';

export const secret = {
    CORTEX_API_KEY: 'CORTEX_API_KEY',
    CORTEX_NOTIFY_URL: 'CORTEX_NOTIFY_URL',
    GEMINI_API_KEY: 'GEMINI_API_KEY',
} as const;

export const CORTEX_API_KEY = defineSecret('CORTEX_API_KEY');
export const CORTEX_NOTIFY_URL = defineSecret('CORTEX_NOTIFY_URL');
export const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
