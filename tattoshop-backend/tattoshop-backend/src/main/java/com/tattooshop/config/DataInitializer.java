package com.tattooshop.config;

import com.tattooshop.entity.Category;
import com.tattooshop.entity.Product;
import com.tattooshop.entity.User;
import com.tattooshop.entity.ERole;
import com.tattooshop.repository.CategoryRepository;
import com.tattooshop.repository.ProductRepository;
import com.tattooshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.count() == 0) {
            User admin = new User("Admin", "admin@tattooshop.com", passwordEncoder.encode("Admin"), ERole.ADMIN);
            User seller = new User("Seller", "seller@tattooshop.com", passwordEncoder.encode("Seller"), ERole.SELLER);
            User user = new User("User", "user@tattooshop.com", passwordEncoder.encode("User"), ERole.USER);

            userRepository.saveAll(Arrays.asList(admin, seller, user));
            System.out.println("Usuarios iniciales creados correctamente");
        } else {
            System.out.println("Usuarios ya existen en la base de datos");
        }

        // 🏷️ Categorías iniciales
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    new Category("Tinta"),
                    new Category("Agujas"),
                    new Category("Máquinas"),
                    new Category("Fuentes de alimentación"),
                    new Category("Accesorios")
            );
            categoryRepository.saveAll(categories);
            System.out.println("Categorías iniciales creadas correctamente");
        } else {
            System.out.println("Categorías ya existen en la base de datos");
        }

        if (productRepository.count() == 0) {
            User seller = userRepository.findByUsername("Seller").orElse(null);
            if (seller != null) {
                Category tinta = categoryRepository.findByName("Tinta").orElse(null);
                Category agujas = categoryRepository.findByName("Agujas").orElse(null);

                if (tinta != null && agujas != null) {
                    Product p1 = new Product("Tinta Negra Eternal", "Tinta de alta calidad para líneas definidas", 24.99f, "https://i.imgur.com/Zq6Y9Ep.jpeg", tinta, seller);
                    Product p2 = new Product("Agujas Magnum 9", "Agujas estériles para sombreado", 14.50f, "https://i.imgur.com/JKg2RjW.jpeg", agujas, seller);

                    productRepository.saveAll(List.of(p1, p2));
                    System.out.println("Productos iniciales creados correctamente");
                }
            }
        } else {
            System.out.println("Productos ya existen en la base de datos");
        }
    }
}
