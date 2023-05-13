import { execute } from './index';
import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals';
import axios from "axios";

jest.mock("axios");
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
    'shelljs',
    () => ({ exec: (command: string, callback: (code: any, stdout: string, stderr: string) => void) => callback(1, '', '')}),
    { virtual: true }
);

const givenSuccessfulAxiosRequest = () => {
    mockedAxios.post.mockResolvedValueOnce({
        data: 'Upload was successful!'
    });
}

const givenSuccessfulCacheRead = () => {
    jest.doMock(
        `${__dirname}/credentials.json`,
        () => ({ projectname: 'asd', password: 'asd' }),
        { virtual: true }
    );
}

const whenExecuteIndex = async () => await execute();

describe('index.ts with failed test cases', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('should successfully upload result with zeros when tests fail', async () => {
        // given
        const spy = jest.spyOn(console, 'log');
        const axiosSpy = jest.spyOn(mockedAxios, 'post');
        givenSuccessfulAxiosRequest();
        givenSuccessfulCacheRead();
    
        await whenExecuteIndex();
        
        // then
        expect(axiosSpy).toHaveBeenCalledWith(
            "https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/",
            "{\"password\":\"asd\",\"testCoverage\":{\"unit\":0,\"component\":0,\"integration\":0,\"e2e\":0}}", 
            {"withCredentials": true}
        );
        expect(spy).toHaveBeenCalledWith('Operation was successful! YAY!');
    });

});
