Steps Leaderboard API

An API for managing teams and step counters in a company-wide steps leaderboard application. Employees are grouped into teams and can accumulate steps to compete with other teams.

Table of Contents

	•	Features
	•	Architecture
	•	Prerequisites
	•	Installation
	•	Running the Application
	•	API Documentation
	•	Usage
	•	Teams
	•	Counters
	•	Testing
	•	Contributing
	•	License
	•	Contact

Features

	•	Team Management
	•	Create and delete teams.
	•	List all teams with their total step counts.
	•	Retrieve total steps taken by a team.
	•	Counter Management
	•	Create and delete counters (team members’ step counters).
	•	Increment counters to accumulate steps.
	•	List all counters in a team.
	•	Leaderboard
	•	Compare team scores by viewing total steps of all teams.

Architecture

The application is built with the following technologies:

	•	Node.js v18
	•	NestJS v10
	•	MongoDB (using Mongoose)
	•	TypeScript

It adheres to the SOLID, DRY, and KISS principles to ensure clean, maintainable, and scalable code.

Prerequisites

	•	Node.js v18 or higher
	•	npm package manager
	•	MongoDB (ensure it’s installed and running)

Installation

	1.	Clone the Repository
        git clone https://github.com/yourusername/steps-leaderboard-api.git
        cd steps-leaderboard-api

	2.	Install Dependencies

Running the Application

	1.	Start MongoDB
        Ensure MongoDB is running on your system. If installed locally, you can start it with:

        mongod

    2.	Run the Application
      •	Development Mode (with hot reload)

        npm run start:dev

      •	Production Mode
        
        npm run build
        npm run start:prod

	3.	Access the Application
      The server will start on http://localhost:3000.
      
      API Documentation
      
      The API is documented using Swagger. Access the Swagger UI at:

        http://localhost:3000/api

    Testing
    
      To run tests (if implemented):
    
        npm run test
    
    
    
    License
    
    This project is licensed under the MIT License.
    
    Contact
    
        •	Email: mischer86@gmail.com
        •	GitHub: Mischer
    
    Additional Information
    
    Persistence
    
    The application uses MongoDB for data persistence, ensuring that all counter states are stored even after a restart.
    
    Scalability and Fault Tolerance
    
    While not implemented in this version, considerations for scalability include:
    
        •	Load Balancing: Use of load balancers to distribute traffic.
        •	Database Scaling: Implement sharding or use a distributed database.
        •	Microservices Architecture: Breaking the application into smaller, manageable services.
    
    Authentication
    
    Currently, the API is open. Implementing authentication (e.g., JWT, OAuth2) would ensure that only authorized counters can interact with the API.
    
    Notes
    
        •	Ensure MongoDB is running before starting the application.
        •	Adjust the MongoDB connection string in app.module.ts if necessary.
        •	The Swagger UI provides a convenient way to test the API without the need for external tools.
    
    This README is crafted to provide clear instructions and information about the Steps Leaderboard API, following best practices for documentation.