"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.execute = void 0;
var axios_1 = require("axios");
var shelljs_1 = require("shelljs");
var fs_1 = require("fs");
var UNIT = 'unit';
var COMPONENT = 'component';
var INTEGRATION = 'integration';
var E2E = 'e2e';
var TEST_CASES = [UNIT, COMPONENT, INTEGRATION, E2E];
var prompt = require('prompt-sync')({ sigint: false });
var projectName = '';
var password = '';
var readFromCache = false;
var promptCredentials = function () {
    try {
        var jsonData = require("".concat(__dirname, "/credentials.json"));
        projectName = jsonData.projectName;
        password = jsonData.password;
        readFromCache = true;
        console.log('Credentials provided by cache!');
    }
    catch (error) {
        console.log('Credentials cache reading failed. Please enter your sign in data again!');
        projectName = prompt('ProjectName: ');
        password = prompt('Password: ', { echo: '' });
        if (!projectName || !password) {
            console.log('Either project name or password input was empty. Please try again!');
            return false;
        }
    }
    return true;
};
var uploadEndResult = function (endResult) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, response, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                payload = {
                    projectName: projectName,
                    password: password,
                    testCoverage: __assign({}, endResult)
                };
                console.log(JSON.stringify(payload));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post('https://jaf5lbsxlfuxjnycra72m2jfoq0srzqk.lambda-url.eu-central-1.on.aws/', JSON.stringify(payload), { withCredentials: true })];
            case 2:
                response = _b.sent();
                console.log(response.data);
                if (!readFromCache) {
                    (0, fs_1.writeFileSync)("".concat(__dirname, "/credentials.json"), JSON.stringify({ projectName: projectName, password: password }));
                    console.log('Credentials are now cached!');
                }
                console.log('Operation was successful! YAY!');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.log("Operation failed during result uploading process with the following response: ".concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var runTestCase = function (testParams, index, endResult) {
    if (Object.keys(endResult).length >= 4) {
        uploadEndResult(endResult);
        return;
    }
    var _a = testParams[index], type = _a.type, command = _a.command;
    (0, shelljs_1.exec)(command, function (code, stdout, stderr) {
        var _a, _b;
        var _c;
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
        try {
            var line = stderr.match(/Tests:([\s\da-z,])*\n/gi) || [];
            var str = line[0] || '';
            var passedSubstring = /(?<passed>\d*) passed/.exec(str);
            var passedTestsNumber = Number((_c = passedSubstring === null || passedSubstring === void 0 ? void 0 : passedSubstring.groups) === null || _c === void 0 ? void 0 : _c.passed);
            endResult = __assign(__assign({}, endResult), (_a = {}, _a[type] = passedTestsNumber || 0, _a));
        }
        catch (e) {
            endResult = __assign(__assign({}, endResult), (_b = {}, _b[type] = 0, _b));
        }
        runTestCase(testParams, index + 1, endResult);
    });
};
var execute = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testParams, endResult;
    return __generator(this, function (_a) {
        if (!promptCredentials()) {
            return [2 /*return*/];
        }
        testParams = [
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
        endResult = {};
        runTestCase(testParams, 0, endResult);
        return [2 /*return*/, null];
    });
}); };
exports.execute = execute;
(0, exports.execute)();
