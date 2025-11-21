import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './index';

describe('HomePage', () => {
  it('should render the hero heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Create Professional Word Search Puzzles in Seconds/i)
    ).toBeInTheDocument();
  });

  it('should have a link to the generator page', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const startButton = screen.getByText(/Start Creating/i);
    expect(startButton).toBeInTheDocument();
    expect(startButton.closest('a')).toHaveAttribute('href', '/generator');
  });
});
