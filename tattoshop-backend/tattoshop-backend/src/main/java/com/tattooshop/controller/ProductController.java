package com.tattooshop.controller;

import com.tattooshop.entity.Category;
import com.tattooshop.entity.Product;
import com.tattooshop.entity.User;
import com.tattooshop.service.CategoryService;
import com.tattooshop.service.ProductService;
import com.tattooshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    // Publico
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.findAllPaged(pageable));
    }

    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/mine")
    public ResponseEntity<List<Product>> getMyProducts(Authentication authentication) {
        String username = authentication.getName();
        User seller = userService.findByUsername(username).orElseThrow();
        List<Product> products = productService.findBySeller(seller);
        return ResponseEntity.ok(products);
    }

    // Publico
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo vendedores o administradores
    @PreAuthorize("hasRole('SELLER')")
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product, Authentication authentication) {
        String username = authentication.getName();
        User seller = userService.findByUsername(username).orElseThrow();
        product.setSeller(seller);

        if (product.getCategory() != null && product.getCategory().getName() != null) {
            String catName = product.getCategory().getName().trim();
            Category category = categoryService.findByName(catName)
                    .orElseGet(() -> categoryService.save(new Category(catName)));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        return ResponseEntity.ok(productService.save(product));
    }

    // Solo vendedores o administradores
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.findById(id).map(existingProduct -> {

            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setImageURL(product.getImageURL());

            if (product.getCategory() != null && product.getCategory().getName() != null) {
                String catName = product.getCategory().getName().trim();
                Category category = categoryService.findByName(catName)
                        .orElseGet(() -> categoryService.save(new Category(catName))); // Crea la categoria si no existe
                existingProduct.setCategory(category);
            }

            Product updated = productService.save(existingProduct);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Solo vendedores o administradores
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Publico
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description) {
        List<Product> products = productService.searchByNameOrDescription(name, description);
        return ResponseEntity.ok(products);
    }

    // Test
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Products endpoint funcionando correctamente");
    }
}
