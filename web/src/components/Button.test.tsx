import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeTruthy();
    expect(button.className).toContain('bg-blue-600'); // primary variant
    expect(button.className).toContain('h-10'); // md size
  });

  it('applies correct classes for secondary variant and small size', () => {
    render(<Button variant="secondary" size="sm">Secondary Sm</Button>);
    const button = screen.getByRole('button', { name: /secondary sm/i });
    expect(button.className).toContain('bg-gray-100');
    expect(button.className).toContain('h-9');
  });

  it('applies correct classes for danger variant and large size', () => {
    render(<Button variant="danger" size="lg">Danger Lg</Button>);
    const button = screen.getByRole('button', { name: /danger lg/i });
    expect(button.className).toContain('bg-red-600');
    expect(button.className).toContain('h-11');
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
