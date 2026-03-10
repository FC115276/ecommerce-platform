package com.farmermarket.market.entity;

import jakarta.persistence.*;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int productId;
    private int quantity;

    public Cart(){}

    public int getId(){ return id; }
    public void setId(int id){ this.id=id; }

    public int getProductId(){ return productId; }
    public void setProductId(int productId){ this.productId=productId; }

    public int getQuantity(){ return quantity; }
    public void setQuantity(int quantity){ this.quantity=quantity; }
}
