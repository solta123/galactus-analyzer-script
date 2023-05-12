import { execute } from './index';
import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testOutput = `Program stderr: PASS src/App.test.js
✓ renders learn react link (41 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.371 s
Ran all test suites.`

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
    'shelljs',
    () => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', testOutput)}),
    { virtual: true }
);

describe('index.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('should successfully upload with prompted credentials', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: 'Upload was successful!'
        });
        jest.doMock(
            `${__dirname}/credentials.json`,
            () => { throw Error() },
            { virtual: true }
        );

        const spy = jest.spyOn(console, 'log');
        const axiosSpy = jest.spyOn(mockedAxios, 'post');
       
        await execute();
        
        expect(spy).toHaveBeenCalledWith('Credentials cache reading failed. Please enter your sign in data again!');
        expect(spy).toHaveBeenCalledWith('Credentials are now cached!');
        expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
        expect(axiosSpy).toHaveBeenCalledWith(
            "https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/",
            "{\"projectName\":\"asd\",\"password\":\"asd\",\"testCoverage\":{\"unit\":1,\"component\":1,\"integration\":1,\"e2e\":1}}", 
            {"withCredentials": true}
        );
    });

    test('should successfully upload with cached credentials', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: 'Upload was successful!'
        });
        jest.doMock(
            `${__dirname}/credentials.json`,
            () => ({ projectName: 'asd', password: 'asd' }),
            { virtual: true }
        );

        const spy = jest.spyOn(console, 'log');
        const axiosSpy = jest.spyOn(mockedAxios, 'post');
    
        await execute();
        
        expect(spy).toHaveBeenCalledWith('Credentials provided by cache!');
        expect(spy).not.toHaveBeenCalledWith('Credentials are now cached!');
        expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
        expect(axiosSpy).toHaveBeenCalledWith(
            "https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/",
            "{\"projectName\":\"asd\",\"password\":\"asd\",\"testCoverage\":{\"unit\":1,\"component\":1,\"integration\":1,\"e2e\":1}}", 
            {"withCredentials": true}
        );
    });

    test('should fail upload if http request throws error', async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { data: 'Upload failed!' }});
        jest.doMock(
            `${__dirname}/credentials.json`,
            () => ({ projectName: 'asd', password: 'asd' }),
            { virtual: true }
        );

        const spy = jest.spyOn(console, 'log');
    
        await execute();
        
        expect(spy).toHaveBeenCalledWith('Credentials provided by cache!');
        expect(spy).toHaveBeenCalledWith('Operation failed during result uploading process with the following response: Upload failed!');
    });
});
