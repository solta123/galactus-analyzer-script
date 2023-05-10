"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var shelljs_1 = require("shelljs");
var execute = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // cat("echo shell.exec works");
        (0, shelljs_1.exec)("npm run test > output.txt");
        // var prompt = require('prompt-sync')({ sigint: false });
        //
        // const projectName = prompt('ProjectName: ');
        // const password = prompt('Password: ', { echo: '' });
        //
        // const lambdaClient = new LambdaClient({
        //     region: 'eu-central-1',
        //     apiVersion: '2015-03-31'
        // });
        //
        // const str = JSON.stringify({
        //     projectName,
        //     password,
        //     testCoverage: {
        //         "unit": 7,
        //         "component": 2,
        //         "integration": 0,
        //         "e2e": 1
        //     }
        // })
        //
        // const asciiEncoder = new TextEncoder();
        // const payload = asciiEncoder.encode(str);
        //
        // const command = new InvokeCommand({
        //     FunctionName: 'galactus-szakdoga-upload-test-results',
        //     Payload: payload
        // });
        //
        // const response = await lambdaClient.send(command);
        //
        // const asciiDecoder = new TextDecoder('ascii');
        // const data = JSON.parse(asciiDecoder.decode(response.Payload));
        /*
        * lehet egy alatt config fájl külön a modulnak mai azt olvasni próbálja
        * ha nincs ilyen fájl akkor alap config a node modulból
        * meg kell oldani, hogy node modulként hozzá lehessen adni, scriptet lehessen futtatni az appból a node odulon keresztül
        *  (pl galactus register, meg galactus test)
        * minta a react-scripts
        *
        * kapcsolók fittatáskot: verbose, findRelatedTests, watchAll=false
        *
        * */
        // return data;
        return [2 /*return*/, null];
    });
}); };
execute().then(function (event) { return console.log(event); });
