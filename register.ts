import axios from 'axios';
import { writeFileSync } from 'fs';

var prompt = require('prompt-sync')({ sigint: false });

export const execute = async () => {
    const projectName = prompt('ProjectName: ');
    const password = prompt('Password: ', { echo: '' });

    if (!projectName || !password) {
        console.log('Either project name or password input was empty. Please try again!');
        return;
    }

    try {
        const response = await axios.post(
            'https://wgifdy6owetmaju252hl6mrtuy0fhbko.lambda-url.eu-central-1.on.aws/',
            JSON.stringify({ projectName, password }),
            { withCredentials: true }
        );

        console.log(response.data)
        
        writeFileSync(`${__dirname}/credentials.json`, JSON.stringify({ projectName, password }));
        console.log('Credentials are now cached!');  
        console.log('Registration operation was successful!');
    } catch (error: any) {
        console.log(error.response?.data);
        console.log('Operation failed!');
    }
};

execute();