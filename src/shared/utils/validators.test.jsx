import {
    isEmailValid,
    isEmailEmpty,
    isPasswordValid,
    isPasswordEmpty,
    isNameEmpty,
} from '@/shared/utils/validators';

describe('validators', () => {
    describe('isEmailValid', () => {
        it('should return true for valid emails', () => {
            expect(isEmailValid('test@mail.com')).toBe(true);
            expect(isEmailValid('user.name+tag+sorting@example.com')).toBe(true);
            expect(isEmailValid('user_name@example.co.uk')).toBe(true);
        });
        it('should return false for invalid emails', () => {
            expect(isEmailValid('test@mail')).toBe(false);
            expect(isEmailValid('test@.com')).toBe(false);
            expect(isEmailValid('test@com.')).toBe(false);
            expect(isEmailValid('')).toBe(false);
            expect(isEmailValid('plainaddress')).toBe(false);
            expect(isEmailValid('@missingusername.com')).toBe(false);
        });
    });

    describe('isEmailEmpty', () => {
        it('should return true for empty email', () => {
            expect(isEmailEmpty('')).toBe(true);
            expect(isEmailEmpty('   ')).toBe(true);
        });
        it('should return false for non-empty email', () => {
            expect(isEmailEmpty('test@mail.com')).toBe(false);
            expect(isEmailEmpty(' a ')).toBe(false);
        });
    });

    describe('isPasswordValid', () => {
        it('should return true for valid passwords', () => {
            expect(isPasswordValid('Password1')).toBe(true);
            expect(isPasswordValid('abc12345')).toBe(true);
            expect(isPasswordValid('A1b2c3d4')).toBe(true);
        });
        it('should return false for invalid passwords', () => {
            expect(isPasswordValid('short1')).toBe(false); // less than 8 chars
            expect(isPasswordValid('abcdefgh')).toBe(false); // no number
            expect(isPasswordValid('12345678')).toBe(false); // no letter
            expect(isPasswordValid('')).toBe(false);
        });
    });

    describe('isPasswordEmpty', () => {
        it('should return true for empty password', () => {
            expect(isPasswordEmpty('')).toBe(true);
            expect(isPasswordEmpty('   ')).toBe(true);
        });
        it('should return false for non-empty password', () => {
            expect(isPasswordEmpty('password')).toBe(false);
            expect(isPasswordEmpty(' 1 ')).toBe(false);
        });
    });

    describe('isNameEmpty', () => {
        it('should return true for empty name', () => {
            expect(isNameEmpty('')).toBe(true);
            expect(isNameEmpty('   ')).toBe(true);
        });
        it('should return false for non-empty name', () => {
            expect(isNameEmpty('John')).toBe(false);
            expect(isNameEmpty(' a ')).toBe(false);
        });
    });
});