# galactus-analyzer-script

This package is part of my thesis called Test-shape visualizer. It could be used on node projects, such as React.
We can create your app's test shape using unit, component, integration and e2e tests.

## Usage

1. Install package:
```
npm i --save-dev galactus-analyzer-script
```

2. Add galactus commands to `package.json` file:

```
{
    ...
    scripts: {
        ...
        "galactus:register": "node ./node_modules/galactus-analyzer-script/dist/register.js",
        "galactus:upload": "node ./node_modules/galactus-analyzer-script/dist/index.js",
        ...
    }
}
```

3. Add testing commands. You need to add specific commands to your `package.json` file, naming them based on what type on tests you would like to run:

```
{
    ...
    scripts: {
        ...
        "test:unit": "react-scripts test --watchAll=false",
        "test:component": ...,
        "test:integration": ...,
        "test:e2e": ...,
        ...
    }
}
```
(Note: This package currently only support Jest. If you are using Jest, please add `watchAll=false` to your command, as displayed above.)

4. In order to upload your results, you must register an account first, by running the command below, and providing your credentials when you are propmpted. 
Your project name must be unique, if an account has been registered already with the given project name, you will get an error.

```
npm run galactus:register
```

5. Now you can run your tests and upload the results using the folowing command:
```
npm run galactus:upload
```

6. Now you can access your results on the following link: https://netlify--resonant-kulfi-8d6938.netlify.app/login
