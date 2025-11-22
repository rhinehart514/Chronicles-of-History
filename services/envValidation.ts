// Environment variable validation
// Run this at app startup to catch configuration issues early

interface EnvConfig {
  GEMINI_API_KEY: string;
}

interface ValidationError {
  variable: string;
  message: string;
}

export function validateEnv(): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Check for Gemini API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    errors.push({
      variable: 'GEMINI_API_KEY',
      message: 'Gemini API key is required. Get one at https://makersuite.google.com/app/apikey'
    });
  } else if (apiKey === 'your_api_key_here') {
    errors.push({
      variable: 'GEMINI_API_KEY',
      message: 'Please replace the placeholder API key with your actual Gemini API key'
    });
  } else if (apiKey.length < 20) {
    errors.push({
      variable: 'GEMINI_API_KEY',
      message: 'API key appears to be invalid (too short)'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function getEnvConfig(): EnvConfig {
  return {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || ''
  };
}

// Display validation errors in console and optionally in UI
export function displayEnvErrors(errors: ValidationError[]): void {
  console.error('Environment configuration errors:');
  errors.forEach(err => {
    console.error(`  - ${err.variable}: ${err.message}`);
  });
}

export default validateEnv;
