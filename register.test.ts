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

const givenSuccessfulAxiosRequest = () => {
    mockedAxios.post.mockResolvedValueOnce({
        data: 'Registration was successful!'
    });
};

const givenRejectedAxiosRequest = () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: 'Upload failed!' }});
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
        const logSpy = jest.spyOn(console, 'log');
        givenSuccessfulAxiosRequest();

        await whenExecuteRegister();
        
        // then
        expect(logSpy).toHaveBeenCalledWith('Credentials are now cached!');
        expect(logSpy).toHaveBeenCalledWith('Registration operation was successful!');
    });

    test('should log error if upload fails', async () => {
        // given
        const logSpy = jest.spyOn(console, 'log');
        givenRejectedAxiosRequest();
    
        await whenExecuteRegister();
        
        // then
        expect(logSpy).toHaveBeenCalledWith('Upload failed!');
        expect(logSpy).toHaveBeenCalledWith('Operation failed!');
    });
});
