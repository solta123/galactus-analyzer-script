import { execute } from './index';
import { afterAll, afterEach, describe, expect, jest, test, beforeAll } from '@jest/globals';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedSuccessExec = () => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: 1 passed, 1 total`)});

const mockedFailedExec = () => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: 1 failed, 1 total`)});

const mockedExec = (param: string): any => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: ${param}, 1 total`)});


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


// jest.mock(
//     'shelljs',
//     jest.fn()
//         .mockImplementationOnce(() => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: 1 passed, 1 total`)}))
//         .mockImplementationOnce(() => mockedExec('1 failed')),
//     { virtual: true }
// );


describe('index.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
    
    test('should successfully upload with prompted credentials', async () => {
        jest.mock(
            `${__dirname}/credentials.json`,
            () => { throw Error() },
            { virtual: true }
        );
        mockedAxios.post.mockResolvedValueOnce({
            data: 'Upload was successful!'
        });

        jest.doMock('shelljs', () => ({
            exec: jest.fn(() => (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: 1 passed, 1 total`)),
        }));
        const shelljs = require('shelljs');

        const spy = jest.spyOn(console, 'log');
        const axiosSpy = jest.spyOn(mockedAxios, 'post');
        // shelljs.exec.mockReturnedValue(() => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', `Test suites: 1 passed, 1 total`)}))
    
        await execute();
        
        expect(spy).toHaveBeenCalledWith('Credentials cache reading failed. Please enter your sign in data again!');
        expect(spy).toHaveBeenCalledWith('Credentials are now cached!');
        expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
        expect(axiosSpy).toHaveBeenCalledWith(
            "https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/",
            "{\"password\":\"asd\",\"testCoverage\":{\"unit\":1,\"component\":1,\"integration\":1,\"e2e\":1}}", 
            {"withCredentials": true}
        );
    });

    // test('should successfully upload with cached credentials', async () => {
    //     jest.mock(
    //         `${__dirname}/credentials.json`,
    //         () => ({ projectname: 'asd', password: 'asd' }),
    //         { virtual: true }
    //     );
    //     mockedAxios.post.mockResolvedValueOnce({
    //         data: 'Upload was successful!'
    //     });

    //     const spy = jest.spyOn(console, 'log');
    //     const axiosSpy = jest.spyOn(mockedAxios, 'post');
    //     // const shellSpy = jest.spyOn(shelljs, 'exec').mockImplementation(() => mockedExec('1 failed'));
    
    //     await execute();
        
    //     // expect(spy).toHaveBeenCalledWith('Credentials provided by cache!');
    //     // expect(spy).not.toHaveBeenCalledWith('Credentials are now cached!');
    //     expect(axiosSpy).toHaveBeenCalledWith(
    //         "https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/",
    //         "{\"password\":\"asd\",\"testCoverage\":{\"unit\":0,\"component\":0,\"integration\":0,\"e2e\":0}}", 
    //         {"withCredentials": true}
    //     );
    //     expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
    //     // shellSpy.mockRestore();
    // });

    // test('should successfully upload with cached credentials', async () => {
    //     jest.doMock(
    //         `${__dirname}/credentials.json`,
    //         () => ({ projectname: 'asd', password: 'asd' }),
    //         { virtual: true }
    //     );
    //     jest.doMock(
    //         'shelljs',
    //         () => {
    //             return { exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', 'Test suites: 1 passed, 1 total') }
    //         },
    //         { virtual: true }
    //     );

    //     mockedAxios.post.mockResolvedValueOnce({
    //         data: 'Upload was successful!'
    //     });

    //     const spy = jest.spyOn(console, 'log');
    
    //     await execute();
        
    //     expect(spy).toHaveBeenCalledWith('Credentials provided by cache!');
    //     expect(spy).not.toHaveBeenCalledWith('Credentials are now cached!');
    //     expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
    // });
});
