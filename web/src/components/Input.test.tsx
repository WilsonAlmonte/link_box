import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input component', () => {
  it('renders standard input field', () => {
    render(<Input placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeTruthy();
  });

  it('renders label and links it via htmlFor/id', () => {
    render(<Input label="Username" placeholder="Enter username" id="username-input" />);
    const label = screen.getByText('Username');
    expect(label).toBeTruthy();
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input.getAttribute('id')).toBe('username-input');
    expect(label.getAttribute('for')).toBe('username-input');
  });

  it('renders error message and applies error styles', () => {
    render(<Input error="Username is required" placeholder="Enter username" />);
    const errorText = screen.getByText('Username is required');
    expect(errorText).toBeTruthy();

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.className).toContain('border-red-500');
  });

  it('uses automatic fallback useId when no id is passed', () => {
    render(<Input label="Auto ID Label" placeholder="Auto ID" />);
    const label = screen.getByText('Auto ID Label');
    const input = screen.getByPlaceholderText('Auto ID');
    
    const id = input.getAttribute('id');
    expect(id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(id);
  });
});
