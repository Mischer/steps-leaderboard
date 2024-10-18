
# steps-leaderboard

### Version: 0.0.1

## Description
An API for managing teams and step counters in a company-wide steps leaderboard application.

This is a backend application built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Prerequisites

To run this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for running MongoDB)

## Installation

1. Clone the repository to your local machine:
    ```bash
    git clone git@github.com:Mischer/steps-leaderboard.git
    ```

2. Navigate to the project directory:
    ```bash
    cd steps-leaderboard
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Start MongoDB using Docker Compose

This project uses MongoDB as a database, and it can be easily started using Docker Compose. Run the following command to spin up MongoDB:

```bash
docker-compose up
```

### Start the Application

Once MongoDB is running, you can start the NestJS application using the following command:

```bash
npm run start
```

The application should now be running on `http://localhost:3000`.

## API Documentation (Swagger)

This application provides API documentation using Swagger. Once the application is running, you can access the Swagger UI at:

`http://localhost:3000/explore`

## Testing

To run the test suite, use:

```bash
npm run test
```

You can also run tests in watch mode:

```bash
npm run test:watch
```

## Building the Project

To build the project for production, use:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Environment Variables

This project uses environment variables to manage configuration. You can configure them in a `.env` file at the root of the project.

## License

This project is licensed under the MIT License.
