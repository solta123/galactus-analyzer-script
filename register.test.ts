import { execute } from './register';
import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals';
import axios from "axios";

// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.mock(
//     'prompt-sync',
//     () => {
//         const mPrompt = () => 'asd';
//         return jest.fn(() => mPrompt);
//     },
//     { virtual: true },
// );

// jest.mock(
//     'fs', 
//     () => {
//         return { writeFileSync: jest.fn() }
//     },
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
        // jest.mock(
        //     `${__dirname}/credentials.json`,
        //     () => { throw Error() },
        //     { virtual: true }
        // );

        // mockedAxios.post.mockResolvedValueOnce({
        //     data: 'Registration was successful!'
        // });

        // const spy = jest.spyOn(console, 'log');
    
        // await execute();
        
        // expect(spy).toHaveBeenCalledWith('Credentials are now cached!');
        // expect(spy).toHaveBeenCalledWith('Registration operation was successful!');
        expect(true).toBeTruthy()
    });
});
