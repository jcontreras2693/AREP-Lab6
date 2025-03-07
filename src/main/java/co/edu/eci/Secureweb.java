package co.edu.eci;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class Secureweb {
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(Secureweb.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", "5000"));
				app.run(args);
	}

	static int getPort() {
		if (System.getenv("PORT") != null) {
			return Integer.parseInt(System.getenv("PORT"));
		}
		return 5000; //returns default port if heroku-port isn't set (i.e. on localhost)
	}
}
