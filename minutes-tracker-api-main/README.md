MinutesTracker API<br>

This is an API for tracking study minutes. It allows users to register, log in, and record how many minutes they study.<br>

Prerequisites: You need to have Node.js and PostgreSQL installed on your computer.<br>

Steps:<br>

Clone the repository:<br>

git clone https://github.com/yisroelgugenheim/minutes-tracker-api.git<br>

cd minutes-tracker-api<br>

Install dependencies:<br>

run npm install<br>
Set up your database and .env file<br>
(make sure psql is running):<br>

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";<br>

CREATE TABLE users ( user_id uuid DEFAULT uuid_generate_v4 (), first_name VARCHAR NOT NULL,<br> last_name VARCHAR NOT NULL, email VARCHAR NOT NULL, password VARCHAR NOT NULL, pledged_minutes<br> INT NOT NULL, verified INT DEFAULT 0, admin INT DEFAULT 0, PRIMARY KEY (user_id) );<br>

CREATE TABLE sessions( session_id INT GENERATED ALWAYS AS IDENTITY, user_id UUID NOT NULL,<br> session_length INT NOT NULL, time TIMESTAMP NOT NULL, CONSTRAINT fk_user FOREIGN KEY(user_id)<br>
REFERENCES users(user_id) );<br>

Start the server:<br>

run npm start, or for project runner: npm run dev (or nodemon app.js)<br>

Visit http://localhost:3000 in your browser or API client to see the API in action.<br>

API Endpoints<br>

Register a new user:<br>

Endpoint: /signup<br>
Method: POST<br>
Copy code:<br>
{
  "first_name": "John",<br>
  "last_name": "Doe",<br>
  "email": "john@example.com",<br>
  "password": "password123",<br>
  "pledged_minutes": 50<br>
}
Log in:<br>

Endpoint: /login<br>
Method: POST<br>
Copy code<br>
{
  "email": "john@example.com",<br>
  "password": "password123"<br>
}
Record study minutes:<br>
Endpoint: /sessions<br>
Method: POST<br>
Copy code:<br>
{
  "session_length": 120,<br>
  "time": "time_stamp",<br>
  "user_id": "uuid"<br>

}

## Known Issues
- There may be an issue with date handling due to timezone discrepancies that may affect how<br> dates are displayed. Further testing is needed.<br>


For help and support, contact yisgug@gmail.com. <br>

