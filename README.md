
# Backend Readme

This repository contains the backend code for a project written in NestJS. The backend is deployed to Amazon EC2 and uses Amazon RDS for the database.

## About

The website is a platform for doctors worldwide to register, provide online consultations, and efficiently manage their schedules. Doctors can easily view their appointments in user-friendly calendars, update their profiles, and set their preferred working hours. To ensure punctuality, doctors receive a notification 5 minutes prior to each scheduled Zoom meeting. The platform facilitates seamless communication between doctors and patients through Zoom calls and an online chat feature. It offers a secure and convenient way for patients to schedule appointments, share medical records, and receive personalized care from a diverse range of doctors. By leveraging technology, the website aims to enhance accessibility to healthcare and empower doctors with greater control over their practice.

## Prerequisites

Before running the backend locally or deploying it to a server, ensure that you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (version 18.16.0 or higher)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (version 9.4.2 or higher)
- [Amazon Web Services (AWS) Account](https://aws.amazon.com/)

## Installation

1. Clone this repository:

   ```shell
   git clone https://github.com/ZenBit-Tech/WebWizards_be.git
   ```

2. Install the dependencies:

   ```shell
   cd backend
   npm install
   ```

## Configuration

Before running or deploying the backend, you need to configure some settings.

1. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```plaintext
   # Database Configuration
   DB_HOST=your-database-host
   DB_PORT=your-database-port
   DB_USERNAME=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name

   # SMTP Configuration
   SMTP_HOST=your-smtp-host
   SMTP_PORT=your-smtp-port
   SMTP_USER=your-smtp-username
   SMTP_PASSWORD=your-smtp-password

   # API URLs
   API_URL=your-api-url
   CLIENT_URL=your-client-url

   # JWT Configuration
   PRIVATE_KEY=your-private-key
   ACCESS_TOKEN_MAX_AGE=your-access-token-max-age

   # Google Authentication Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_SECRET=your-google-secret
   GOOGLE_REDIRECT_URL=your-google-redirect-url

   # Access Token Configuration
   ACCESS_TOKEN_DOMAIN=your-access-token-domain

   # Other Configuration
   # Add any other required configuration variables here
   ```

2. Replace the placeholders in the `.env` file with your actual values.

## Local Development

To run the backend locally, follow these steps:

1. Start the server:

   ```shell
   npm run start:dev
   ```

   The backend server should now be running on `http://localhost:5001`.

2. Use a tool like [Postman](https://www.postman.com/) to test the API endpoints.


## Deployment

To deploy the backend to Amazon EC2 using PM2 and a start script, follow these steps:

1. Set up an EC2 instance with your preferred operating system.

2. Install Node.js on the EC2 instance.

3. Clone the repository onto the EC2 instance.

4. Install the dependencies:

   ```shell
   cd backend
   npm install
   ```

5. Build the project:

   ```shell
   npm run build
   ```

   This will create a `dist` folder containing the compiled JavaScript files.

6. Create a start script file named `start.sh` in the root directory of the project with the following contents:

   ```shell
   #!/bin/bash
   npm run start:prod
   ```

7. Make the `start.sh` file executable:

   ```shell
   chmod +x start.sh
   ```

8. Configure the environment variables either by setting them in the environment or by modifying the `.env` file.

9. Start the backend using PM2:

   ```shell
   pm2 start start.sh
   ```

   The backend should now be running using PM2.

10. Optionally, you can set up PM2 to automatically start the backend on system boot:

    ```shell
    pm2 startup
    pm2 save
    ```

    This will generate a command that you need to run. Execute the generated command to set up the startup script.

11. Access your backend API using the appropriate URL or IP address of your EC2 instance.

## Database Setup

The backend uses Amazon RDS for the database. To set up the database:

1. Log in to your AWS Management Console.

2. Navigate to the Amazon RDS service.

3. Create a new database instance with MySQL.

4. Configure the database credentials and connection details in the `.env` file or set them as environment variables on your EC2 instance.

## API Documentation

The backend API is documented using Swagger. You can explore and interact with the API using the Swagger UI.

To access the Swagger documentation, visit [Swagger UI](http://your-api-url/docs) or use the following endpoints:

![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/7410ba0d-78e2-4c10-819c-9efd47b33874)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/956c0534-8c66-4202-8342-bcc3432a8d74)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/2b41ab5d-daac-45fe-a12c-40e348382c79)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/40f7654a-ab59-4c9f-acd8-e02bb52d3cbc)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/1e9c23ff-9a4e-4edf-9b8b-fcddae0114a2)

### Schemas

![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/a633854f-ca7d-4b32-9289-b038e7ed5113)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/c1f757f1-1493-489a-b5bb-ee0bd5a49014)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/6aeac931-4106-4608-9685-76ca747dc1fa)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/642fcad0-7eed-485b-9cce-c140728702c3)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/3b61a9ad-69e3-4fef-a3a3-9a758c3cb8be)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/f4cb73f8-2b35-4b05-8a34-61c0f1951db1)
![image](https://github.com/ZenBit-Tech/WebWizards_be/assets/72575014/f1b956b4-5a1f-487c-9bd8-165262391975)
