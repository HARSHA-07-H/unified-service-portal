package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "admin_id", unique = true, nullable = false)
    private String adminId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String rank;
    
    @Column(name = "area_of_working", nullable = false)
    private String areaOfWorking;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "password_changed", nullable = false)
    private Boolean passwordChanged = false;
    
    @Column(name = "first_login", nullable = false)
    private Boolean firstLogin = true;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<User> users = new java.util.ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
