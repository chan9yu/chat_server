<a name="readme-top"></a>

# Meet Link Server

> 🖥️ 실시간 채팅, 화면 공유, 및 미디어 통화를 제공하는 NestJS 기반의 MeetLink Server.
> <br />
> 원격 커뮤니케이션을 위한 앱 서비스입니다.

<br />

## 🔗 Link

- <a href="https://github.com/chan9yu/meet-link" target="_blank" rel="noreferrer">App Repository</a>

<p align="right">
  <a href="#readme-top">맨 위로</a>
</p>

## 🔧 Tech Stack

- <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
- <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
- <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
- <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white">
- <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

<p align="right">
  <a href="#readme-top">맨 위로</a>
</p>

## 🚀 Getting Started

로컬환경에서 앱을 실행하는 방법입니다.

### Prerequisites

해당 앱을 실행시키기 위한 필수 조건 입니다.

1. pnpm install

```shell
# pnpm 설치
npm -g install pnpm
```

2. node setup

```shell
# .nvmrc 기준 node version 설치
# nvm을 사용하지 않는다면 수동으로 노드버전을 맞춰주세요.
nvm use
```

### Installation

1. 프로젝트 클론

```shell
git clone https://github.com/chan9yu/meet-link_server
```

2. 프로젝트 디렉토리로 이동

```shell
cd meet-link_server
```

3. 종속성 설치

```shell
pnpm install
```

4. 개발 서버 시작

```
pnpm dev
```

<p align="right">
  <a href="#readme-top">맨 위로</a>
</p>

## ✨ Features

- 실시간 채팅
- 화면 공유
- 미디어 통화
- 사용자 관리
- 채팅 기록 저장

<p align="right">
  <a href="#readme-top">맨 위로</a>
</p>

## ⚙️ Environment Variables

환경 변수를 설정하는 방법입니다.

```shell
# .env.example 기준으로 .env 파일 생성
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
```

<p align="right">
  <a href="#readme-top">맨 위로</a>
</p>
