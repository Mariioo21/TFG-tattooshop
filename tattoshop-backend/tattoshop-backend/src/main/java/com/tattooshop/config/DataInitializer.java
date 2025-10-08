package com.tattooshop.config;

import com.tattooshop.entity.User;
import com.tattooshop.entity.ERole;
import com.tattooshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
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
        }
    
    }
}
