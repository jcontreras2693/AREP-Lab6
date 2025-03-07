# Taller 6 | AREP

## Creation of a CRUD System to Manage Properties

In this project, we will develop a simple CRUD (Create, Read, Update, Delete) system for managing real estate properties through a web application. Users will be able to perform key operations on property listings, and the application will be deployed in the cloud using AWS EC2 instances.

The backend is built with Spring Boot and runs inside a Docker container on one EC2 instance, while the MySQL database is hosted in another Docker container on a separate EC2 instance. This architecture ensures scalability, maintainability, and separation of concerns, providing a flexible and efficient deployment strategy.

## Architecture

The architecture of this project follows a distributed deployment model using AWS EC2 instances. It consists of three main components:

- Browser: Users interact with the system through a web browser, sending requests to the web application.
- WebApplication: A Spring Boot application runs inside a Docker container on a EC2 instance, handling business logic, processing user requests, and communicating with the database.
- Database: A MySQL database runs inside a Docker container on a separate EC2 instance, storing and managing property data.

![](src/main/resources/images/architecture.png)

## Class Design

```
src/
  main/
    java/
      co/
        edu/
          eci/
            controller/
              PropertyController.java
            model/
              Property.java
            repository/
              PropertyRepository.java
            service/
              PropertyService.java
            WebApplication.java                 # Clase principal
    resources/
        images/                                 # Recursos para el archivo Readme
        static/            
            index.html
            styles.css
            script.js
        application.properties
  test/
    java/
      co/
        edu/
          eci/
            PropertyControllerTest.java         # Pruebas Unitarias
Dockerfile
pom.xml
README.md
```

## Getting Started

These instructions will allow you to get a working copy of the project on your local machine for development and testing purposes.

### Prerequisites

- [Java](https://www.oracle.com/co/java/technologies/downloads/) 21 or higher.
- [Maven](https://maven.apache.org/download.cgi). 3.8.1 o higher.
- [Docker](https://www.docker.com/products/docker-desktop/). Latest
- [AWS](https://aws.amazon.com/). Account
- [Git](https://git-scm.com/downloads) (optional).
- Web Browser.

To check if installed, run:

```
java -version
```
```
mvn --version
```
```
docker --version
```
```
git --version
```

### Installing

1. Download the repository from GitHub in a .zip or clone it to your local machine using Git.

    ```
    git clone https://github.com/jcontreras2693/AREP-Lab6.git
    ```

2. Navigate to the project directory.

    ```
    cd AREP-Lab6
    ```

3. Build the project by running the following command:

    ```
    mvn clean install
    ```

   ![](src/main/resources/images/succes.png)

## Deployment

1. Create a default EC2 instance on AWS and add a new Security Rule on the Security Group of the instance.

   ![](src/main/resources/images/security-db.png)

2. Connect to the EC2 instance, install docker with these commands:

    ```
    sudo yum update -y
    sudo yum install docker
    ```

3. Create and install a MySQL image on Docker, this will be our Database:

    ```
    docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=properties_db -p 3306:3306 -d mysql
    ```

4. You can get into the database in the container (password: root) with the command:

    ```
    docker exec -it mysql-container mysql -u root -p
    ```

5. Exit the connection and replace this line in the application.properties file:

    ```
    spring.datasource.url=jdbc:mysql://your-EC2-public-IP:3306/properties_db
    ```

6. Compile and generate the .jar files again with the following command:

    ```
    mvn clean package
    ```

7. Create the Docker image of the application:

    ```
    docker build --tag taller6arep .
    ```

8. For local tests [localhost:8080](http://localhost:8080/), create a Docker container of the application or run it using an IDE:

    ```
    docker run -d -p 8080:8080 --name taller6 taller6arep
    ```

   ![](src/main/resources/images/local-homepage.png)

9. Login and create the image on Dockerhub, the push the image:

    ```
    docker login
    docker tag taller6arep jcontreras2025/taller6arep:latest
    docker push jcontreras2025/taller6arep
    ```

   ![](src/main/resources/images/docker-hub.png)

10. Create a new default EC2 instance on AWS and add a new Security Rule on the Security Group of the instance.:

    ![](src/main/resources/images/security-app.png)

11. Connect to the EC2 instance, install docker with these commands:

    ```
    sudo yum update -y
    sudo yum install docker
    ```

12. Start the Docker service and run the container with the application using this command:

    ```
    sudo service docker start
    sudo docker run -d -p 8080:8080 --name taller6 jcontreras2025/taller6arep
    ```

13. Copy the public DNS of the EC2 instance and paste it on a web browser using the port 42000, should look like this:

    ```
    http://ec2-44-204-74-94.compute-1.amazonaws.com:8080/
    ```

    ![](src/main/resources/images/homepage.png)


## Application Running

- GET Request example.

  ![](src/main/resources/images/get.png)

- GET Request example by ID.

  ![](src/main/resources/images/getid.png)

- POST Request example.

  ![](src/main/resources/images/post.png)

- PUT Request example.

  ![](src/main/resources/images/put.png)

- DELETE Request example.

  ![](src/main/resources/images/delete.png)

## Running the Tests

The tests performed verify the getters and setters of the Pokémon class, the PokemonController GET and POST actions and the Concurrency on PokemonServer.

To run the tests from the console, use the following command:

```
mvn test
```

If the tests were successful, you will see a message like this in your command console.

![](src/main/resources/images/tests.png)

## Built With

* [Java Development Kit](https://www.oracle.com/co/java/technologies/downloads/) - Software Toolkit
* [Maven](https://maven.apache.org/) - Dependency Management
* [Git](https://git-scm.com/) - Distributed Version Control System

## Authors

* **Juan David Contreras Becerra** - *Taller 6 | AREP* - [AREP-Lab6](https://github.com/jcontreras2693/AREP-Lab6.git)