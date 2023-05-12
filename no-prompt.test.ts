import { execute as whenExecuteRegister } from './register';
import { execute as whenExecuteIndex } from './index';
import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals';

jest.mock(
    'prompt-sync',
    () => {
        const mPrompt = () => '';
        return jest.fn(() => mPrompt);
    },
    { virtual: true },
);

jest.mock(
    'fs', 
    () => {
        return { writeFileSync: jest.fn() }
    },
    { virtual: true }
);

jest.mock(
    `${__dirname}/credentials.json`,
    () => { throw Error() },
    { virtual: true }
);

describe('No prompts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
    
    test('should stop testing if prompts are empty', async () => {
        // given
        const spy = jest.spyOn(console, 'log');
    
        await whenExecuteIndex();
        
        // then
        expect(spy).toHaveBeenCalledWith('Either project name or password input was empty. Please try again!');
    });

    test('should stop registering if prompts are empty', async () => {
        // given
        const spy = jest.spyOn(console, 'log');
    
        await whenExecuteRegister();
        
        // then
        expect(spy).toHaveBeenCalledWith('Either project name or password input was empty. Please try again!');
    });
});
