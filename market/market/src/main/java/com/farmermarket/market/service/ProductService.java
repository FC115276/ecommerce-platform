package com.farmermarket.market.service;

import com.farmermarket.market.entity.Product;
import com.farmermarket.market.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo){
        this.repo = repo;
    }

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product saveProduct(Product product){
        return repo.save(product);
    }

    public void deleteProduct(int id){
        repo.deleteById(id);
    }
}
