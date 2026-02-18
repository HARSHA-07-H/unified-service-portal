package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ ADD USER
    @PostMapping("/add-user")
    public ResponseEntity<?> addUser(@RequestBody Map<String, String> request) {

        String adminId = request.get("adminId");
        String username = request.get("username");
        String password = request.get("password");
        String rank = request.get("rank");
        String areaOfWorking = request.get("areaOfWorking");

        if (adminId == null || username == null || password == null
                || rank == null || areaOfWorking == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            userService.addUserToAdmin(
                    adminId,
                    username,
                    password,
                    rank,
                    areaOfWorking
            );
            return ResponseEntity.ok("User added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ DELETE USER
    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(@RequestBody Map<String, String> request) {

        String adminId = request.get("adminId");
        String username = request.get("username");

        if (adminId == null || username == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            userService.deleteUserFromAdmin(adminId, username);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ UPDATE RANK & AREA
    @PutMapping("/edit-user")
    public ResponseEntity<?> editUser(@RequestBody Map<String, String> request) {

        String adminId = request.get("adminId");
        String username = request.get("username");
        String rank = request.get("rank");
        String areaOfWorking = request.get("areaOfWorking");

        if (adminId == null || username == null || rank == null || areaOfWorking == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            userService.updateUserRankAndArea(
                    adminId,
                    username,
                    rank,
                    areaOfWorking
            );
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ LIST USERS
    @GetMapping("/admin-users")
    public ResponseEntity<?> getUsersByAdmin(
            @RequestParam String adminId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            return ResponseEntity.ok(
                    userService.getUsersByAdminPaginated(adminId, page, size)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
