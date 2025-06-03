import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { exportToPdf } from './exportToPdf';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

vi.mock('react-dom/client', () => ({
  __esModule: true,
  default: { createRoot: vi.fn() },
  createRoot: vi.fn(),
}));
vi.mock('html2canvas', () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock('jspdf', () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => ({
      internal: { pageSize: { getWidth: () => 595 } },
      getImageProperties: vi.fn(() => ({ width: 1190, height: 1684 })),
      addImage: vi.fn(),
      save: vi.fn(),
    })),
  };
});
vi.mock('@/features/recipes/components/RecipePDFTemplate', () => ({
  __esModule: true,
  default: () => null,
}));

describe('exportToPdf', () => {
  let appendChildSpy, removeChildSpy, unmountSpy, renderSpy;

  beforeEach(() => {
    appendChildSpy = vi.spyOn(document.body, 'appendChild');
    removeChildSpy = vi.spyOn(document.body, 'removeChild');
    unmountSpy = vi.fn();
    renderSpy = vi.fn();
    ReactDOM.createRoot.mockReturnValue({
      render: renderSpy,
      unmount: unmountSpy,
    });
    html2canvas.mockResolvedValue({
      toDataURL: () => 'data:image/png;base64,FAKE',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the template, generate PDF, and clean up', async () => {
    const recipe = { name: 'TestRecipe' };
    await exportToPdf(recipe);

    expect(appendChildSpy).toHaveBeenCalled();
    expect(ReactDOM.createRoot).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalled();
    expect(html2canvas).toHaveBeenCalled();
    expect(jsPDF).toHaveBeenCalledWith('p', 'pt', 'a4');
    // Check that addImage and save were called
    const pdfInstance = jsPDF.mock.results[0].value;
    expect(pdfInstance.addImage).toHaveBeenCalled();
    expect(pdfInstance.save).toHaveBeenCalledWith('TestRecipe.pdf');
    expect(unmountSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});