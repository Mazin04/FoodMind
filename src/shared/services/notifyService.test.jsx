import { describe, it, vi, afterEach, expect } from 'vitest';
import { notifyService } from './notifyService';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
    __esModule: true,
    default: Object.assign(
        vi.fn(),
        {
            success: vi.fn(),
            error: vi.fn(),
        }
    ),
}));

describe('notifyService', () => {
    const message = 'Test message';

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('calls toast.success with message and default options', () => {
        notifyService.success(message);
        expect(toast.success).toHaveBeenCalledWith(
            message,
            expect.objectContaining({
                duration: 4000,
                position: "top-center",
                style: expect.any(Object),
            })
        );
    });

    it('calls toast.error with message and default options', () => {
        notifyService.error(message);
        expect(toast.error).toHaveBeenCalledWith(
            message,
            expect.objectContaining({
                duration: 4000,
                position: "top-center",
                style: expect.any(Object),
            })
        );
    });

    it('calls toast (info) with message and default options', () => {
        notifyService.info(message);
        expect(toast).toHaveBeenCalledWith(
            message,
            expect.objectContaining({
                duration: 4000,
                position: "top-center",
                style: expect.any(Object),
            })
        );
    });

    it('merges custom options with default options', () => {
        const customOptions = { duration: 1000, style: { color: 'red' } };
        notifyService.success(message, customOptions);
        expect(toast.success).toHaveBeenCalledWith(
            message,
            expect.objectContaining({
                duration: 1000,
                style: expect.objectContaining({ color: 'red' }),
            })
        );
    });
});