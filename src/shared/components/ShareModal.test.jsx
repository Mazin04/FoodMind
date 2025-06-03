import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareModal from './ShareModal';
import React from 'react';

// Mock react-modal to render children directly
vi.mock('react-modal', () => ({
  __esModule: true,
  default: ({ isOpen, children }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ShareModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<ShareModal isOpen={true} onClose={onClose} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('share_recipe')).toBeInTheDocument();
    expect(screen.getByText('share_recipe_description')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ShareModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ShareModal isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getAllByRole('button')[0]; // Primer botón es el de cerrar
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls navigator.share if available', () => {
    const shareMock = vi.fn().mockResolvedValue();
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    render(<ShareModal isOpen={true} onClose={onClose} />);
    const shareBtn = screen.getAllByRole('button')[1]; // First social button
    fireEvent.click(shareBtn);
    expect(shareMock).toHaveBeenCalled();
  });

  it('alerts if navigator.share is not available', () => {
    vi.spyOn(window.navigator, 'share', 'get').mockReturnValue(undefined);
    window.alert = vi.fn();
    render(<ShareModal isOpen={true} onClose={onClose} />);
    const shareBtn = screen.getAllByRole('button')[1];
    fireEvent.click(shareBtn);
    expect(window.alert).toHaveBeenCalled();
  });

  it('opens WhatsApp, Twitter, and Facebook share links', () => {
    window.open = vi.fn();
    render(<ShareModal isOpen={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    // WhatsApp
    fireEvent.click(buttons[2]);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('whatsapp'), '_blank');
    // Twitter
    fireEvent.click(buttons[3]);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('twitter'), '_blank');
    // Facebook
    fireEvent.click(buttons[4]);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('facebook'), '_blank');
  });
});