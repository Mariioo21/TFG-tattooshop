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
                    new Category("Accesorios"),
                    new Category("Cartuchos"),
                    new Category("Stencil"),
                    new Category("Stencil Remover"),
                    new Category("Guantes"),
                    new Category("Vaselina")
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
                Category cartuchos = categoryRepository.findByName("Cartuchos").orElse(null);
                Category stencil = categoryRepository.findByName("Stencil").orElse(null);
                Category stencilRemover = categoryRepository.findByName("Stencil Remover").orElse(null);
                Category guantes = categoryRepository.findByName("Guantes").orElse(null);
                Category vaselina = categoryRepository.findByName("Vaselina").orElse(null);


                if (tinta != null && agujas != null && cartuchos != null && guantes != null && stencil != null && stencilRemover != null && vaselina != null) {
                    Product p1 = new Product("Tinta Negra Eternal", "Tinta de alta calidad para líneas definidas", 25f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761328276/TintaNegraEternal_r627du.webp", tinta, seller);
                    Product p2 = new Product("Agujas Magnum 9", "Agujas estériles para sombreado", 14.50f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761328785/KwadronMagnum_omiugo.webp", cartuchos, seller);
                    Product p3 = new Product("Tinta Roja Dynamic", "Tinta roja de alta calidad", 30f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761329702/TintaRojaDynamic_osxpbw.webp", tinta, seller);
                    Product p4 = new Product("Vaselina Flavour Cereza", "vaselina con olor a cereza especial para tatuajes", 12f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761329806/VaselinaFlavourCereza_eou2hr.png", vaselina, seller);
                    Product p5 = new Product("Stencil Proton Rosa", "Stencil Proton Rosa de larga duracion para los calcos", 25f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761330017/StencilProtonRosa_pzuu9b.jpg", stencil, seller);
                    Product p6 = new Product("Guantes Nitrilo Negro", "Guantes negros de nitrilo pack de 100", 20f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761330216/GuantesNitrilo_l4akvv.jpg", guantes, seller);
                    Product p7 = new Product("Stencil remover Proton Rosa", "Stencil remover marca proton rosa para eliminar calcos", 25f, "https://res.cloudinary.com/duhvulk5j/image/upload/v1761425504/StencilRemoverProtonRosa_sq2psv.jpg",stencilRemover, seller);
                    
                    productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7));
                    System.out.println("Productos iniciales creados correctamente");
                }
            }
        } else {
            System.out.println("Productos ya existen en la base de datos");
        }
    }
}
