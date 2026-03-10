package com.farmermarket.market.controller;

import com.farmermarket.market.entity.Product;
import com.farmermarket.market.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service){
        this.service = service;
    }

    @GetMapping("/products")
    public List<Product> getProducts(){
        return service.getAllProducts();
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product){
        return service.saveProduct(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable int id,@RequestBody Product product){
        product.setId(id);
        return service.saveProduct(product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable int id){
        service.deleteProduct(id);
    }
}
