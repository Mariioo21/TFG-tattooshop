package com.tattooshop.service;

import com.tattooshop.entity.Product;
import com.tattooshop.entity.User;
import com.tattooshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product save(Product product){
        return productRepository.save(product);
    }

    public Optional<Product> findById(Long id){
        return productRepository.findById(id);
    }

    public List<Product> findAll(){
        return productRepository.findAll();
    }

    public List<Product> findBySeller(User seller){
        return productRepository.findBySeller(seller);
    }

    public List<Product> searchByNameOrDescription(String name, String description){
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(name, description);

    }

    public void deleteById(Long id){
        productRepository.deleteById(id);
    }


}
