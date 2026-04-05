import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge tailwind classes properly', () => {
    const result = cn('px-2 py-1', 'bg-red-500');
    expect(result).toBe('px-2 py-1 bg-red-500');
  });

  it('should resolve class conflicts correctly using tailwind-merge', () => {
    // bg-blue-500 should override bg-red-500
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should conditionally apply classes with clsx', () => {
    const isEditing = false;
    const isError = true;
    
    const result = cn(
      'base-class',
      isEditing && 'editing-class',
      isError && 'error-class',
      { 'object-prop': true }
    );
    
    expect(result).toBe('base-class error-class object-prop');
  });

  it('should ignore undefined and null values', () => {
    const result = cn('text-sm', null, undefined, 'font-bold');
    expect(result).toBe('text-sm font-bold');
  });
});
