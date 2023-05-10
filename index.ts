import axios from 'axios';
import { exec } from 'shelljs';
import { writeFileSync } from 'fs';

const UNIT = 'unit';
const COMPONENT = 'component';
const INTEGRATION = 'integration';
const E2E = 'e2e';

const TEST_CASES = [UNIT, COMPONENT, INTEGRATION, E2E]

type TestCases = typeof TEST_CASES;

interface GalactusResultObject {
    [key: TestCases[number]]: number
}

interface GalactusResultPayload {
    projectName: string,
    password: string,
    testCoverage: Partial<GalactusResultObject>
}

const prompt = require('prompt-sync')({ sigint: false });

let projectName: string = '';
let password: string = '';
let readFromCache = false;

const promptCredentials = (): boolean => {
    try {
        let jsonData = require(`${__dirname}/credentials.json`);
        projectName = jsonData.projectName;
        password = jsonData.password;
        readFromCache = true;
        console.log('Credentials provided by cache!');
    } catch (error) {
        console.log('Credentials cache reading failed. Please enter your sign in data again!');
        projectName = prompt('ProjectName: ');
        password = prompt('Password: ', { echo: '' });
        if (!projectName || !password) {
            console.log('Either project name or password input was empty. Please try again!');
            return false;
        }
    }
    return true;
}

const uploadEndResult = async (endResult: Partial<GalactusResultObject>) => {
    const payload: GalactusResultPayload = {
        projectName,
        password,
        testCoverage: {
            ...endResult
        }
    };

    console.log(JSON.stringify(payload))

    try {
        const response = await axios.post(
            'https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/',
            JSON.stringify(payload),
            { withCredentials: true }
        );
        console.log(response.data);
        if (!readFromCache) {
            writeFileSync(`${__dirname}/credentials.json`, JSON.stringify({ projectName, password }));
            console.log('Credentials are now cached!');
        }
        console.log('Operation was successful! YAY!');
    } catch (error: any) {
        console.log(`Operation failed during result uploading process with the following response: ${error.response?.data}`);
    }
    
    return;
};

const runTestCase = (testParams: any[], index: number, endResult: Partial<GalactusResultObject>) => {
    if (Object.keys(endResult).length >= 4) {
        uploadEndResult(endResult);
        return;
    }

    const { type, command } = testParams[index];
    exec(command, (code: any, stdout: string, stderr: string) => {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);

        try {
            const line = stderr.match(/Tests:([\s\da-z,])*\n/gi) || [];
            const str = line[0] || '';
            const passedSubstring = /(?<passed>\d*) passed/.exec(str)
            const passedTestsNumber = Number(passedSubstring?.groups?.passed);
            endResult = { ...endResult, [type]: passedTestsNumber || 0 }
        } catch(e) {
            endResult = { ...endResult, [type]: 0 };
        }
        runTestCase(testParams, index+1, endResult);
    });
}

export const execute = async () => {
    if (!promptCredentials()) {
        return;
    }

    const testParams = [
        {
            type: UNIT,
            command: 'npm run test:unit'
        },
        {
            type: COMPONENT,
            command: 'npm run test:component'
        },
        {
            type: INTEGRATION,
            command: 'npm run test:integration'
        },
        {
            type: E2E,
            command: 'npm run test:e2e'
        }
    ];

    let endResult: Partial<GalactusResultObject> = {};

    runTestCase(testParams, 0, endResult);

    return null;
}

execute();
