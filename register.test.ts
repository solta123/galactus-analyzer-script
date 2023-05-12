import { execute } from './register';
import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals';
import axios from "axios";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock(
    'prompt-sync',
    () => {
        const mPrompt = () => 'asd';
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
    () => ({}),
    { virtual: true }
);

const givenMockAxiosResponse = (rejected = false) => {
    if (rejected) {
        mockedAxios.post.mockRejectedValueOnce({ response: { data: 'Upload failed!' }});
    } else {
        mockedAxios.post.mockResolvedValueOnce({
            data: 'Registration was successful!'
        });
    }
};

const whenExecuteRegister = async () => await execute();

describe('register.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
    
    test('should successfully upload with prompted credentials', async () => {
        // given
        const spy = jest.spyOn(console, 'log');
        givenMockAxiosResponse();

        await whenExecuteRegister();
        
        // then
        expect(spy).toHaveBeenCalledWith('Credentials are now cached!');
        expect(spy).toHaveBeenCalledWith('Registration operation was successful!');
    });

    test('should log error if upload fails', async () => {
        // given
        const spy = jest.spyOn(console, 'log');
        givenMockAxiosResponse(true)
    
        await whenExecuteRegister();
        
        // then
        expect(spy).toHaveBeenCalledWith('Upload failed!');
        expect(spy).toHaveBeenCalledWith('Operation failed!');
    });
});
