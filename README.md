# JobPortal
This job portal will make it easy for both employers and job seekers to find jobs and candidates based on their preferences.

Steps to Run the Frontend Application (React)

1). Install All Required Dependencies
Make sure you have Node.js installed.
Run the following command to install all libraries (both dependencies and devDependencies) listed in package.json:
npm install

This will install:

React & React DOM

Material UI components (@mui/material, @mui/icons-material, @emotion/react, etc.)

Routing (react-router-dom)

Form Handling & Validation (react-hook-form, yup, @hookform/resolvers)

Date Handling (dayjs, @mui/x-date-pickers)

Icons (react-icons, lucide-react)

Toast Notifications (react-hot-toast)

Tailwind CSS with PostCSS and Autoprefixer

Testing Libraries (@testing-library/*)

2). Start the Development Server
npm start
The application will start on http://localhost:3000

3). Build for Production
npm run build

 Steps to Run the Backend Application (Spring Boot)

1). Prerequisites
Java 21 installed
Maven installed
MySQL Server running

2). Update your application.properties or application.yml with your DB credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

3). Install Dependencies and Build the Project
Use the following command to download all dependencies and compile the project:
mvn clean install

4). Run the Application
You can run the Spring Boot application using:
mvn spring-boot:run
The backend will start (by default) at:
👉 http://localhost:8080

📦 Dependencies Used
Your Spring Boot application uses the following Maven dependencies:

✅ Core Dependencies
spring-boot-starter-web – Build REST APIs

spring-boot-starter-data-jpa – ORM with Hibernate

spring-boot-starter-security – Spring Security

spring-boot-starter-validation – Bean validation

✅ Database & ORM
mysql-connector-j – MySQL driver

lombok – Boilerplate code reduction (annotations like @Getter, @Setter, etc.)

✅ JWT & Authentication
jjwt-api, jjwt-impl, jjwt-jackson – JSON Web Token (JWT) authentication

✅ WebFlux (optional unless needed)
spring-boot-starter-webflux – For reactive APIs (not needed unless you're mixing reactive and non-reactive code)

✅ Testing
spring-boot-starter-test

reactor-test

spring-security-test

