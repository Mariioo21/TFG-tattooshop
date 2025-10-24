package com.tattooshop.service;

import com.tattooshop.entity.Category;
import com.tattooshop.repository.CategoryRepository;
import com.tattooshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.*;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public Category save(Category category){
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(Long id){
        return categoryRepository.findById(id);
    }

    public List<Category> findAll(){
        return categoryRepository.findAll();
    }

    public void deleteById(Long id){
        categoryRepository.deleteById(id);
    }

    public Optional<Category> findByName(String name){
        return categoryRepository.findByName(name);
    }
    public boolean existsByName(String name) {
        return categoryRepository.findByName(name).isPresent();
    }

    @Transactional
    public boolean deleteByIdSafe(Long id) {
        Category category = categoryRepository.findById(id)
                .orElse(null);
        if (category == null) return false;

        // Comprueba si tiene productos asociados
        long count = productRepository.countByCategoryId(id);
        if (count > 0) {
            // No se puede eliminar: tiene productos asociados
            return false;
        }

        categoryRepository.deleteById(id);
        return true;
    }

    public List<Map<String, Object>> getCategoriesWithProductCount() {
        List<Category> categories = categoryRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Category category : categories) {
            long count = productRepository.countByCategoryId(category.getId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", category.getId());
            map.put("name", category.getName());
            map.put("productCount", count);
            result.add(map);
        }

        return result;
    }
}
