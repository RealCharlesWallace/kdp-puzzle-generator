import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './index';

describe('HomePage', () => {
  it('should render configuration controls and preview heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText(/Preview/i)).toBeInTheDocument();
  });

  it('should render the generate button in a disabled state before words are added', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const generateButton = screen.getByRole('button', { name: /Generate Puzzle/i });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toBeEnabled();
  });
});
