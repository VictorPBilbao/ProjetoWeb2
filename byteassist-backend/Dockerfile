# Use an OpenJDK image as the base image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the .jar file into the container
COPY target/*.jar app.jar


# Expose the port the application will run on
EXPOSE 8080

# Command to run the .jar file
CMD ["java", "-jar", "app.jar"]