export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRegistration(name: string, email: string, password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.length < 2) errors.push('Name must be at least 2 characters');
  if (!validateEmail(email)) errors.push('Invalid email address');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  
  return { valid: errors.length === 0, errors };
}

export function validateLogin(email: string, password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!validateEmail(email)) errors.push('Invalid email address');
  if (!password) errors.push('Password is required');
  
  return { valid: errors.length === 0, errors };
}

export function validateBuildingParams(params: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  
  if (typeof params.floors !== 'number' || params.floors < 1 || params.floors > 50) {
    errors.push('Floors must be between 1 and 50');
  }
  if (typeof params.width !== 'number' || params.width < 2 || params.width > 100) {
    errors.push('Width must be between 2 and 100');
  }
  if (typeof params.depth !== 'number' || params.depth < 2 || params.depth > 100) {
    errors.push('Depth must be between 2 and 100');
  }
  if (typeof params.floorHeight !== 'number' || params.floorHeight < 2 || params.floorHeight > 10) {
    errors.push('Floor height must be between 2 and 10');
  }
  
  return { valid: errors.length === 0, errors };
}
