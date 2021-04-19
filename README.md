# Electron + React + Typescript 프로젝트 생성 관련 연구[2]

Date: Apr 16, 2021

## 작업 과정

### 프로젝트 무에서 유 생성 작업 간 트러블 슈팅

1. React로 앱을 만들기
2. React 과련 타입 스크립트 의존 라이브러리 설치
    - 설치 관련 라이브러리들

        npm install @types/react @types/react-dom @types/react-router-dom

3. electron-is-dev 모듈 설치
    - 바벨 core-js 버전 관련 경고 발생
        - 설치 간 바벨의 core-js 워닝 발생, 리액트에서는 3버전대, 바벨에서는 2버전 대, 프로젝트 자체에 3.10.1을 설치 하면서 해결
    - fsevents 버전 관련 이슈 발생
        - 2버전을 프로젝트 자체에 설치
4. webpack 버전은 리액트 ^17.0.0 사용 시 4.44.2 버전을 사용해줘야 한다. 

## 프로젝트 빌드 과정 중 트러블 슈팅

1. webpack으로 electron.ts 를 빌드하면서 electron 관련 작업 파일 하나로 빌드
    - ts-loader를 사용하는데 오류가 남...
        - react-cli를 사용해 typescript 용 프로젝트를 만들게 되면  **tsconfig.json 안에 noEmit 설정이 true가 되어 있다. 이걸 제거해줘야 webpack으로 번들이 진행된다.** true로 되어 있을 경우 아래와 같은 에러 메시지를 보게 된다.

            ```bash
            Hash: b10e74c843cfd1a7c674
            Version: webpack 4.44.2
            Time: 3026ms
            Built at: 2021. 04. 16. 오전 11:21:31
                  Asset      Size  Chunks             Chunk Names
            electron.js  4.24 KiB       0  [emitted]  main
            Entrypoint main = electron.js
            [0] ./public/electron.ts 682 bytes {0} [built] [failed] [1 error]

            ERROR in ./public/electron.ts
            Module build failed (from ./node_modules/ts-loader/index.js):
            Error: TypeScript emitted no output for /Users/birdhead/Documents/vc_workspace/broadCastProject/electron-react-boilerplate/public/electron.ts.
                at makeSourceMapAndFinish (/Users/birdhead/Documents/vc_workspace/broadCastProject/electron-react-boilerplate/node_modules/ts-loader/dist/index.js:53:18)
                at successLoader (/Users/birdhead/Documents/vc_workspace/broadCastProject/electron-react-boilerplate/node_modules/ts-loader/dist/index.js:40:5)
                at Object.loader (/Users/birdhead/Documents/vc_workspace/broadCastProject/electron-react-boilerplate/node_modules/ts-loader/dist/index.js:23:5)
            ```

            추가 트러블 이슈 정리

            webpack은 noEmit가 false가 되어야 한다. 하지만 react-srcipts build의 경우 noEmit가 true가 되어야 한다. webpack과 react-script build를 할 때 마다 noEmit 설정 값을 바꾸는 것은 매우 귀찮다. 그래서 webpack의 loader 옵션을 사용하자.

            ```jsx
            const path = require('path');

            module.exports = {
                entry: './public/electron.ts',
                target: 'electron-main',
                output: {
                    path: path.join(__dirname, 'public'),
                    filename: 'electron.js'
                },
                mode: 'none',
                module: {
                    rules: [
                        { test: /\.ts$/,
                            loader: 'ts-loader',
                            options: {
            										# 해당 옵션을 사용하면 tsconfig.js에 noEmit가 true 여도 
            										# webpack 으로 번들 시 false 로 동작한다. 
                                **compilerOptions: {
                                    "noEmit": false
                                }**
                            }     
                        }
                    ]
                },
                resolve: {
                    extensions: [".ts", ".js", ".json"]
                }
            }
            ```

2. 일렉트론 빌드 진행
    1. React 빌드 결과물 같이 빌드 할 수 있도록 package.json 설정에 build property 추가 후 일렉트론 빌드 시 추가 되어야할 관련 파일 정의

        ```json
        .....
         "devDependencies": {
            "concurrently": "^6.0.2",
            "cross-env": "^7.0.3",
            "electron": "^12.0.4",
            "electron-builder": "^22.10.5",
            "wait-on": "^5.3.0",
            "webpack": "^4.44.2",
            "webpack-cli": "^4.6.0"
          },
          "build": {
            "extends": null,
            "files": [
              "./build/**/*",
              "./public/electron.js"
            ]
          }
        }
        ```

    2. Not allowed to load local resource: file:///build/index.html 관련 이슈... 

        해당 이슈 발생 이유, electron 로직 관련 한 파일들을 번들 하기 위해 electron.ts 파일을 webpack을 이용해서 번들을 진행한다. 
        이 과정에서 webpack이 __dirname을 default로 / 경로로 설정한 다음 번들을 진행 하기 때문에 발생하는 문제였다. 

        - 해결 방법

            ```jsx
            const path = require('path');

            module.exports = {
                entry: './public/electron.ts',
                target: 'electron-main',
                node: {
                    __dirname: true,
                    __filename: true
                },
                output: {
                    path: path.join(__dirname, 'public'),
                    filename: 'electron.js'
                },
                mode: 'none',
                module: {
                    rules: [
                        { test: /\.ts$/,
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    "noEmit": false
                                }
                            }     
                        }
                    ]
                },
                resolve: {
                    extensions: [".ts", ".js", ".json"]
                }
            }
            ```
