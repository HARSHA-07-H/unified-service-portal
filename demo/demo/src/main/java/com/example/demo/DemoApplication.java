package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initializeDatabase(AdminRepository adminRepository) {
		return args -> {
			// Check if super admin already exists
			if (!adminRepository.findByAdminId("prerana").isPresent()) {
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				Admin superAdmin = new Admin();
				superAdmin.setAdminId("prerana");
				superAdmin.setName("Prerana");
				superAdmin.setPassword(encoder.encode("Prerana@542004"));
				superAdmin.setRank("Super Admin");
				superAdmin.setAreaOfWorking("Admin Panel");
				superAdmin.setFirstLogin(false); // Super admin doesn't need to change password
				superAdmin.setPasswordChanged(true);
				superAdmin.setIsActive(true);
				
				adminRepository.save(superAdmin);
				System.out.println("✅ Super Admin 'prerana' created successfully!");
			} else {
				System.out.println("✅ Super Admin 'prerana' already exists!");
			}
		};
	}

}

