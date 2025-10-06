package com.tattooshop.config;

import com.tattooshop.entity.ERole;
import com.tattooshop.entity.User;
import com.tattooshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User("admin", "admin@gmail.com", passwordEncoder.encode("admin"), ERole.ADMIN);
                User seller = new User("seller", "seller@gmail.com", passwordEncoder.encode("seller"), ERole.SELLER);
                User user = new User("user", "user@gmail.com", passwordEncoder.encode("user"), ERole.USER);

                userRepository.save(admin);
                userRepository.save(seller);
                userRepository.save(user);

                System.out.println("Usuarios iniciales creados correctamente:");
                System.out.println("ADMIN → admin / admin");
                System.out.println("SELLER → seller / seller");
                System.out.println("USER → user / user");
            } else {
                System.out.println("Usuarios ya existen, no duplicados.");
            }
        };
    }
}
