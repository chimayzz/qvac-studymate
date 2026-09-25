# QVAC StudyMate

QVAC StudyMate is a private offline study tool that uses the QVAC SDK to generate multiple-choice practice questions from a topic entered by the user.

The application runs QVAC inference locally through the app and does not use an external AI API.

## Features

- Generate a multiple-choice study question from any topic
- Supports topics such as Networking, Fiber Optics, Cybersecurity, and Information Technology
- Uses QVAC `loadModel` to load the local AI model
- Uses QVAC `completion` to generate study questions
- Simple web-based interface
- No external AI API required

## Tech Stack

- Node.js
- JavaScript
- HTML
- CSS
- QVAC SDK

## QVAC SDK Version

This project uses:

`@qvac/sdk` version `0.20.0`

## Installation

Clone the repository:

```bash
git clone https://github.com/chimayzz/qvac-studymate.git